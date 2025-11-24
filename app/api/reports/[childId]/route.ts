import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type SequenceWithItems = {
  id: string
  childId: string
  timestamp: Date
  items: {
    id: string
    sequenceId: string
    imageId: string
    order: number
    image: {
      id: string
      name: string
      imageUrl?: string | null
      category?: {
        displayName: string
        color: string
      } | null
    }
  }[]
  comments: {
    id: string
    content: string
    createdAt: Date
    user: {
      name: string | null
      email: string
    } | null
  }[]
}

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const childId = params.childId
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const pageStr = url.searchParams.get('page')
    const pageSizeStr = url.searchParams.get('pageSize')

    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : undefined
    const pageSize = pageSizeStr ? Math.max(1, Math.min(100, parseInt(pageSizeStr, 10))) : undefined

    // Verify user has access to this child
    const childAccess = await prisma.childAccess.findUnique({
      where: {
        userId_childId: {
          userId: session.user.id,
          childId
        }
      }
    })

    if (!childAccess) {
      return NextResponse.json(
        { error: "Acesso negado a este perfil" },
        { status: 403 }
      )
    }

    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z')
        }
      }
    } else if (startDate) {
      const start = new Date(startDate)
      const end = new Date(startDate)
      end.setDate(end.getDate() + 1)
      dateFilter = {
        timestamp: {
          gte: start,
          lt: end
        }
      }
    }

    // Contagem total (independente de paginação)
    const totalSequences = await prisma.sequence.count({
      where: {
        childId,
        ...dateFilter
      }
    })

    // Configura paginação
    let skip: number | undefined = undefined
    let take: number | undefined = undefined

    if (page && pageSize) {
      skip = (page - 1) * pageSize
      take = pageSize
    } else if (pageSize) {
      take = pageSize
    } else {
      // Se não pediu paginação, traz tudo (com limite de segurança)
      take = Math.min(totalSequences, 2000)
    }

    // Fetch sequences para o período/paginação
    const sequences = (await prisma.sequence.findMany({
      where: {
        childId,
        ...dateFilter
      },
      include: {
        items: {
          include: {
            image: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: {
                  select: {
                    displayName: true,
                    color: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { timestamp: 'desc' },
      skip,
      take
    })) as SequenceWithItems[]

    // Generate statistics (com base nas sequences retornadas)
    const totalImages = sequences.reduce(
      (total: number, seq: SequenceWithItems) => total + seq.items.length,
      0
    )

    // Count word frequency
    const wordCount: { [key: string]: number } = {}
    sequences.forEach((seq: SequenceWithItems) => {
      seq.items.forEach(item => {
        const word = item.image.name
        wordCount[word] = (wordCount[word] || 0) + 1
      })
    })

    const mostUsedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    // Category usage
    const categoryCount: { [key: string]: number } = {}
    sequences.forEach((seq: SequenceWithItems) => {
      seq.items.forEach(item => {
        const category = item.image.category?.displayName || 'Sem categoria'
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })
    })

    const categoryUsage = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({ category, count }))

    // Daily breakdown if showing multiple days
    let dailyBreakdown: any[] = []
    if (startDate && endDate && startDate !== endDate) {
      const dailyStats: { [key: string]: any } = {}
      
      sequences.forEach((seq: SequenceWithItems) => {
        const date = seq.timestamp.toISOString().split('T')[0]
        if (!dailyStats[date]) {
          dailyStats[date] = {
            date,
            sequences: 0,
            images: 0,
            comments: 0
          }
        }
        dailyStats[date].sequences++
        dailyStats[date].images += seq.items.length
        dailyStats[date].comments += seq.comments.length
      })

      dailyBreakdown = Object.values(dailyStats).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }

    const totalComments = sequences.reduce(
      (total: number, seq: SequenceWithItems) => total + seq.comments.length,
      0
    )

    return NextResponse.json({
      summary: {
        totalSequences, // ✅ Total real (independente da paginação)
        totalImages,
        totalComments,
        averageSequenceLength: totalSequences > 0 ? Math.round(totalImages / totalSequences * 10) / 10 : 0
      },
      mostUsedWords,
      categoryUsage,
      dailyBreakdown,
      sequences, // ✅ Sequences paginadas (ou todas se não houver paginação)
      period: {
        startDate: startDate || 'N/A',
        endDate: endDate || startDate || 'N/A'
      }
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}