import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id

    // Buscar imagens da categoria
    const images = await prisma.image.findMany({
      where: {
        categoryId: categoryId,
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        category: {
          select: {
            name: true,
            displayName: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching category images:", error)
    return NextResponse.json(
      { error: "Erro ao buscar imagens da categoria" },
      { status: 500 }
    )
  }
}

// POST - Adicionar nova imagem à categoria
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id
    const body = await req.json()
    const { name, imageUrl, audioUrl } = body

    // Validação
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Nome e URL da imagem são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Obter a ordem máxima atual na categoria
    const maxOrder = await prisma.image.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    // Criar nova imagem
    const image = await prisma.image.create({
      data: {
        name,
        imageUrl,
        audioUrl,
        categoryId,
        order: (maxOrder?.order || 0) + 1,
        isCustom: true,
        isActive: true
      },
      include: {
        category: {
          select: {
            name: true,
            displayName: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Error creating image:", error)
    return NextResponse.json(
      { error: "Erro ao criar imagem: " + (error as Error).message },
      { status: 500 }
    )
  }
}