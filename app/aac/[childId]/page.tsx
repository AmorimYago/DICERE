// app/aac/[childId]/page.tsx
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AAC_Interface } from "@/components/aac-interface"
import { isChildRole, normalizeRole } from "@/lib/roles" // import das helpers

interface AAC_PageProps {
  params: { childId: string }
}

export default async function AAC_Page({ params }: AAC_PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id
  const roleRaw = (session.user as any)?.role
  const role = normalizeRole(roleRaw) // normaliza para canonical ("child", "caregiver", ...)

  // Se for criança, verifica se é a própria criança
  if (isChildRole(role)) {
    if (userId !== params.childId) {
      notFound()
    }

    // Busca os dados da criança
    const child = await prisma.child.findUnique({
      where: { id: params.childId },
      select: {
        id: true,
        name: true,
        profilePhoto: true
      }
    })

    if (!child) {
      notFound()
    }

    return (
      <AAC_Interface
        child={child}
        userId={userId}
        role={roleRaw} // passa o role original se quiser manter compatibilidade
      />
    )
  }

  // Se for pai/cuidador, verifica acesso via ChildAccess
  const childAccess = await prisma.childAccess.findUnique({
    where: {
      userId_childId: {
        userId: userId,
        childId: params.childId
      }
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          profilePhoto: true
        }
      }
    }
  })

  if (!childAccess) {
    notFound()
  }

  return (
    <AAC_Interface
      child={childAccess.child}
      userId={userId}
      role={roleRaw}
    />
  )
}                    