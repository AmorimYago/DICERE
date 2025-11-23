// app/api/sequences/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Criar nova sequência de comunicação
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { childId, imageIds } = body

    if (!childId || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'childId e imageIds são obrigatórios' },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const role = (session.user as any).role

    let hasAccess = false

    if (role === "CRIANCA") {
      // A criança só pode criar sequência para ela mesma
      if (userId === childId) {
        hasAccess = true
      }
    } else {
      // Pai/cuidador deve ter acesso via ChildAccess
      hasAccess = !!(await prisma.childAccess.findFirst({
        where: {
          userId,
          childId
        }
      }))
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Você não tem acesso a esta criança' },
        { status: 403 }
      )
    }

    // Criar a sequência com os itens
    const sequence = await prisma.sequence.create({
      data: {
        childId: childId,
        items: {
          create: imageIds.map((imageId: string, index: number) => ({
            imageId: imageId,
            order: index,
          })),
        },
      },
      include: {
        items: {
          include: {
            image: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return NextResponse.json(sequence, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar sequência:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sequência' },
      { status: 500 }
    )
  }
}