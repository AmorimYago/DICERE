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

    // Verificar se o usuário tem acesso à criança
    const hasAccess = await prisma.childAccess.findFirst({
      where: {
        userId: session.user.id,
        childId: childId,
      },
    })

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

// GET - Buscar sequências de uma criança
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')

    if (!childId) {
      return NextResponse.json(
        { error: 'childId é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário tem acesso à criança
    const hasAccess = await prisma.childAccess.findFirst({
      where: {
        userId: session.user.id,
        childId: childId,
      },
    })

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Você não tem acesso a esta criança' },
        { status: 403 }
      )
      }

    const sequences = await prisma.sequence.findMany({
      where: {
        childId: childId,
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
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    return NextResponse.json(sequences)
  } catch (error) {
    console.error('Erro ao buscar sequências:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar sequências' },
      { status: 500 }
    )
  }
}