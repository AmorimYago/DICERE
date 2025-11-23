import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const children = await prisma.child.findMany({
      where: {
        childAccess: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        childAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            sequences: true,
            reports: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(children)
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar usuário real no banco para garantir userId válido
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    const { name, birthDate, profilePhoto, notes, password } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        profilePhoto,
        notes,
        password: hashedPassword,
      }
    })

    // Create access for the current user (usa currentUser.id)
    await prisma.childAccess.create({
      data: {
        userId: currentUser.id,
        childId: child.id,
        role: "caregiver"
      }
    })

    return NextResponse.json({
      message: "Perfil da criança criado com sucesso",
      child
    })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT para alterar senha da criança
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { childId, password } = await request.json()

    if (!childId || !password || password.length < 4) {
      return NextResponse.json(
        { error: "childId e senha (mínimo 4 caracteres) são obrigatórios" },
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
        { error: "Você não tem acesso a esta criança" },
        { status: 403 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const child = await prisma.child.update({
      where: { id: childId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Senha atualizada com sucesso", child })
  } catch (error) {
    console.error("Error updating child password:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}