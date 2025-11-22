
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id

    const images = await prisma.image.findMany({
      where: {
        categoryId,
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
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching category images:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Check if user is a parent (PAI role)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.role !== "PAI") {
      return NextResponse.json(
        { error: "Apenas pais podem adicionar imagens personalizadas" },
        { status: 403 }
      )
    }

    const categoryId = params.id
    const body = await request.json()
    const { name, imageUrl, audioUrl } = body

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Nome e URL da imagem são obrigatórios" },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Get the highest order in this category
    const lastImage = await prisma.image.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
    })

    const newOrder = (lastImage?.order ?? -1) + 1

    const image = await prisma.image.create({
      data: {
        name,
        imageUrl,
        audioUrl,
        categoryId,
        isCustom: true,
        uploadedBy: user.id,
        order: newOrder,
        isActive: true,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Error creating image:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
