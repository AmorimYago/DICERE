
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const children = await prisma.child.findMany({
      where: {
        childAccess: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        childAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            sequences: true,
            reports: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(children)
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, birthDate, profilePhoto, notes } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        profilePhoto,
        notes
      }
    })

    // Create access for the current user
    await prisma.childAccess.create({
      data: {
        userId: session.user.id,
        childId: child.id,
        role: "caregiver"
      }
    })

    return NextResponse.json({
      message: "Perfil da criança criado com sucesso",
      child
    })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
