
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AAC_Interface } from "@/components/aac-interface"

interface AAC_PageProps {
  params: { childId: string }
}

export default async function AAC_Page({ params }: AAC_PageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Verify user has access to this child
  const childAccess = await prisma.childAccess.findUnique({
    where: {
      userId_childId: {
        userId: session.user.id,
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
      userId={session.user.id}
    />
  )
}
