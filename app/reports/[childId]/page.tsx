
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ReportsInterface } from "@/components/reports-interface"

interface ReportsPageProps {
  params: { childId: string }
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

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
    <ReportsInterface 
      child={childAccess.child}
      userId={session.user.id}
    />
  )
}
