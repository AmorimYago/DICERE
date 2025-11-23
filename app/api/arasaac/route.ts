import { NextRequest, NextResponse } from "next/server"
import { searchArasaacPictograms } from "@/lib/arasaac"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      )
    }

    const results = await searchArasaacPictograms(query)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching ARASAAC:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pictogramas" },
      { status: 500 }
    )
  }
}