import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Criar card personalizado
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, imageUrl, categoryId, audioUrl } = body

    if (!name || !imageUrl || !categoryId) {
      return NextResponse.json(
        { error: 'name, imageUrl e categoryId são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar a ordem do último card na categoria
    const lastImage = await prisma.image.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
    })

    const newOrder = lastImage ? lastImage.order + 1 : 1

    const image = await prisma.image.create({
      data: {
        name,
        imageUrl,
        categoryId,
        audioUrl,
        isCustom: true,
        uploadedBy: session.user.id,
        order: newOrder,
        isActive: true,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar card:', error)
    return NextResponse.json(
      { error: 'Erro ao criar card' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar card personalizado
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, imageUrl, audioUrl } = body

    if (!id || !name) {
      return NextResponse.json(
        { error: 'id e name são obrigatórios' },
        { status: 400 }
      )
    }

    const image = await prisma.image.findUnique({ where: { id } })
    if (!image) {
      return NextResponse.json({ error: 'Card não encontrado' }, { status: 404 })
    }

    if (!image.isCustom) {
      return NextResponse.json({ error: 'Não é possível editar cards padrão' }, { status: 403 })
    }

    if (image.uploadedBy && image.uploadedBy !== session.user.id) {
      return NextResponse.json({ error: 'Você não tem permissão para editar este card' }, { status: 403 })
    }

    const updated = await prisma.image.update({
      where: { id },
      data: {
        name,
        imageUrl: imageUrl ?? image.imageUrl,
        audioUrl: audioUrl ?? image.audioUrl,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar card:', error)
    return NextResponse.json({ error: 'Erro ao atualizar card' }, { status: 500 })
  }
}

// DELETE - Deletar card personalizado
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return NextResponse.json(
        { error: 'id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o card é personalizado e pertence ao usuário
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Card não encontrado' }, { status: 404 })
    }

    if (!image.isCustom) {
      return NextResponse.json(
        { error: 'Não é possível deletar cards padrão' },
        { status: 403 }
      )
    }

    if (image.uploadedBy !== session.user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este card' },
        { status: 403 }
      )
    }

    await prisma.image.delete({
      where: { id: imageId },
    })

    return NextResponse.json({ message: 'Card deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar card:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar card' },
      { status: 500 }
    )
  }
}