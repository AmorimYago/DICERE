import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
// Adicionar imports para autenticação
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    // 1. Obter a sessão do usuário
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // 2. Modificar o 'where' para incluir a lógica de exclusividade
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        // Condição OR: Incluir categorias padrão OU categorias customizadas criadas por este usuário
        OR: [
          { isCustom: false }, // Categorias padrão
          { createdBy: session.user.id } // Categorias customizadas do usuário
        ]
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        _count: {
          select: {
            images: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}