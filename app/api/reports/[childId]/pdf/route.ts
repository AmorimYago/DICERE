import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generatePDFReportHTML } from "@/lib/pdf"
import { Permissions } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export async function GET(
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
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

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

    // Get sequences for the day
    const sequences = await prisma.sequence.findMany({
      where: {
        childId,
        timestamp: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        items: {
          include: {
            image: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    })

    // Format sequences for PDF
    const formattedSequences = sequences.map(seq => ({
      timestamp: new Date(seq.timestamp).toLocaleString('pt-BR'),
      images: seq.items.map(item => item.image.name),
    }))

    // Generate PDF HTML
    const html = generatePDFReportHTML({
      childName: child.name,
      date: new Date(date).toLocaleDateString('pt-BR'),
      totalSequences: report.totalSequences,
      totalImages: report.totalImages,
      mostUsedWords: report.mostUsedWords,
      sequences: formattedSequences,
    })

    // Return HTML that can be printed as PDF
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="relatorio-${child.name}-${date}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
