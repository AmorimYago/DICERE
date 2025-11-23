import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT - Atualizar categoria
export async function PUT(
  req: NextRequest,
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

    const body = await req.json()
    const { displayName, icon, color, description, imageUrl } = body

    // Verificar se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Apenas categorias customizadas podem ser editadas
    if (!category.isCustom) {
      return NextResponse.json(
        { error: "Não é possível editar categorias padrão" },
        { status: 403 }
      )
    }

    // Atualizar categoria
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        displayName,
        icon,
        color,
        description,
        imageUrl: imageUrl || null, // Garante que null seja salvo se não enviado
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar categoria: " + (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE - Deletar categoria
export async function DELETE(
  req: NextRequest,
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

    // Verificar se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { images: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Apenas categorias customizadas podem ser deletadas
    if (!category.isCustom) {
      return NextResponse.json(
        { error: "Não é possível deletar categorias padrão" },
        { status: 403 }
      )
    }

    // Deletar todas as imagens associadas primeiro
    await prisma.image.deleteMany({
      where: { categoryId: params.id }
    })

    // Agora deletar a categoria
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: "Categoria deletada com sucesso" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Erro ao deletar categoria: " + (error as Error).message },
      { status: 500 }
    )
  }
}