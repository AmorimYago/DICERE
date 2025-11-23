import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, displayName, icon, color, description, imageUrl } = body

    // Validação
    if (!name || !displayName) {
      return NextResponse.json(
        { error: "Nome e nome de exibição são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se já existe uma categoria com esse nome
    const existingCategory = await prisma.category.findFirst({
      where: { name: name.toLowerCase() }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Já existe uma categoria com esse nome" },
        { status: 400 }
      )
    }

    // Obter a ordem máxima atual
    const maxOrder = await prisma.category.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    // Criar nova categoria
    const category = await prisma.category.create({
      data: {
        name: name.toLowerCase(),
        displayName,
        icon: icon || "📁",
        color: color || "#6B7280",
        description: description || "",
        imageUrl: imageUrl || null, // ← Campo adicionado
        order: (maxOrder?.order || 0) + 1,
        isCustom: true,
        isActive: true,
        createdBy: session.user.id,
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria: " + (error as Error).message },
      { status: 500 }
    )
  }
}