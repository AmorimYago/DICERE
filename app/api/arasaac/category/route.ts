import { NextRequest, NextResponse } from "next/server"
import { getPictogramsByCategory } from "@/lib/arasaac"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { error: "Query parameter 'category' is required" },
        { status: 400 }
      )
    }

    const results = await getPictogramsByCategory(category)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching category pictograms:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pictogramas da categoria" },
      { status: 500 }
    )
  }
}