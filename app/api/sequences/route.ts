
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { childId, images } = await request.json()

    if (!childId || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "childId e array de imagens são obrigatórios" },
        { status: 400 }
      )
    }

    // Verify user has access to this child
    const childAccess = await prisma.childAccess.findUnique({
      where: {
        userId_childId: {
          userId: session.user.id,
          childId
        }
      }
    })

    if (!childAccess) {
      return NextResponse.json(
        { error: "Acesso negado a este perfil" },
        { status: 403 }
      )
    }

    // Create sequence
    const sequence = await prisma.sequence.create({
      data: {
        childId,
        items: {
          create: images.map((imageId: string, index: number) => ({
            imageId,
            order: index
          }))
        }
      },
      include: {
        items: {
          include: {
            image: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({
      message: "Sequência registrada com sucesso",
      sequence
    })
  } catch (error) {
    console.error("Error creating sequence:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const url = new URL(request.url)
    const childId = url.searchParams.get('childId')
    const date = url.searchParams.get('date')

    if (!childId) {
      return NextResponse.json(
        { error: "childId é obrigatório" },
        { status: 400 }
      )
    }

    // Verify user has access to this child
    const childAccess = await prisma.childAccess.findUnique({
      where: {
        userId_childId: {
          userId: session.user.id,
          childId
        }
      }
    })

    if (!childAccess) {
      return NextResponse.json(
        { error: "Acesso negado a este perfil" },
        { status: 403 }
      )
    }

    const whereClause: any = { childId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      whereClause.timestamp = {
        gte: startDate,
        lt: endDate
      }
    }

    const sequences = await prisma.sequence.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            image: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: {
                  select: {
                    displayName: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    return NextResponse.json(sequences)
  } catch (error) {
    console.error("Error fetching sequences:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
