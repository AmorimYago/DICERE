import { NextResponse } from "next/server"
import { searchPictograms } from "@/lib/arasaac"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!keyword) {
      return NextResponse.json(
        { error: "Palavra-chave é obrigatória" },
        { status: 400 }
      )
    }

    const pictograms = await searchPictograms(keyword, limit)

    return NextResponse.json(pictograms)
  } catch (error) {
    console.error("Error searching ARASAAC pictograms:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pictogramas" },
      { status: 500 }
    )
  }
}
