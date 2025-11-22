import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendReportEmail } from "@/lib/email"
import { Permissions } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Check permissions
    const permission = Permissions.viewReports(session.user.role)
    if (!permission.hasAccess) {
      return NextResponse.json(
        { error: permission.message },
        { status: 403 }
      )
    }

    const childId = params.childId
    const body = await request.json()
    const { date, email } = body

    if (!date) {
      return NextResponse.json(
        { error: "Data do relatório é obrigatória" },
        { status: 400 }
      )
    }

    // Get child data
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: {
        name: true,
        childAccess: {
          where: { userId: session.user.id },
        },
      },
    })

    if (!child || child.childAccess.length === 0) {
      return NextResponse.json(
        { error: "Criança não encontrada ou sem permissão" },
        { status: 404 }
      )
    }

    // Get report data
    const report = await prisma.report.findUnique({
      where: {
        childId_date: {
          childId,
          date: new Date(date),
        },
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Relatório não encontrado" },
        { status: 404 }
      )
    }

    // Send email
    const recipientEmail = email || session.user.email
    const success = await sendReportEmail(recipientEmail, {
      childName: child.name,
      date: new Date(date).toLocaleDateString('pt-BR'),
      totalSequences: report.totalSequences,
      totalImages: report.totalImages,
      mostUsedWords: report.mostUsedWords,
      reportUrl: `${process.env.NEXTAUTH_URL}/reports/${childId}?date=${date}`,
    })

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao enviar email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Email enviado com sucesso"
    })
  } catch (error) {
    console.error("Error sending report email:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
