import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
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