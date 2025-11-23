import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { normalizeRole, isChildRole } from "@/lib/roles"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    const childCookie = cookieStore.get("childId")?.value

    const body = await request.json()
    const { childId, imageIds } = body

    if (!childId || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: "childId e imageIds são obrigatórios" }, { status: 400 })
    }

    // DEBUG: logs temporários — remova após validação
    console.log("[api/sequences] session?.user?.id:", session?.user?.id)
    console.log("[api/sequences] session?.user?.role:", (session?.user as any)?.role)
    console.log("[api/sequences] childCookie:", childCookie)
    console.log("[api/sequences] payload childId:", childId, "imageIds:", imageIds.length)

    // Se não houver sessão, negar (por segurança). Se quiser permitir somente cookie, podemos ajustar aqui.
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    const roleRaw = (session.user as any)?.role
    const role = normalizeRole(roleRaw)

    let hasAccess = false

    // Caso 1: sessão é de criança (role child)
    if (isChildRole(role)) {
      // Permite se a criança for a própria session.user.id
      if (userId === childId) {
        hasAccess = true
      } else if (childCookie === childId) {
        // Caso raro: role child mas session.user.id diferente, permite se cookie também apontar para esse childId
        hasAccess = true
      } else {
        hasAccess = false
      }
    } else {
      // Caso 2: sessão de cuidador/admin - verificar ChildAccess (userId_childId)
      const access = await prisma.childAccess.findUnique({
        where: {
          userId_childId: {
            userId,
            childId
          }
        }
      })

      if (access) {
        hasAccess = true
      } else {
        // Se existe cookie indicando "acessar como criança" mas sem ChildAccess, ainda negar.
        hasAccess = false
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Você não tem acesso a esta criança" }, { status: 403 })
    }

    // Autorizado: criar a sequência
    const sequence = await prisma.sequence.create({
      data: {
        childId: childId,
        items: {
          create: imageIds.map((imageId: string, index: number) => ({
            imageId,
            order: index
          }))
        }
      },
      include: {
        items: {
          include: {
            image: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    // Opcional: revalidar o path do relatório / dashboard (se usar App Router)
    // import { revalidatePath } from 'next/cache'
    // revalidatePath(`/reports/${childId}`)

    return NextResponse.json(sequence, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar sequência:", error)
    return NextResponse.json({ error: "Erro ao criar sequência" }, { status: 500 })
  }
}