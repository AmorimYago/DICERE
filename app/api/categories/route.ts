
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            images: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
        { error: "Apenas pais podem criar categorias personalizadas" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, displayName, icon, color } = body

    if (!name || !displayName) {
      return NextResponse.json(
        { error: "Nome e nome de exibição são obrigatórios" },
        { status: 400 }
      )
    }

    // Get the highest order to place new category at the end
    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: 'desc' },
    })

    const newOrder = (lastCategory?.order ?? -1) + 1

    const category = await prisma.category.create({
      data: {
        name: name.toUpperCase().replace(/\s+/g, '_'),
        displayName,
        icon: icon || 'Folder',
        color: color || '#2196F3',
        order: newOrder,
        isActive: true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
