
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { content } = await request.json()
    const sequenceId = params.id

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comentário não pode estar vazio" },
        { status: 400 }
      )
    }

    // Verify the sequence exists and user has access to the child
    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        child: {
          include: {
            childAccess: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!sequence || sequence.child.childAccess.length === 0) {
      return NextResponse.json(
        { error: "Sequência não encontrada ou acesso negado" },
        { status: 403 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        sequenceId,
        userId: session.user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Comentário adicionado com sucesso",
      comment
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
