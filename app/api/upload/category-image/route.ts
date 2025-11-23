import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas imagens são permitidas" },
        { status: 400 }
      )
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagem muito grande. Máximo 5MB" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // Gerar nome único
    const timestamp = Date.now()
    const filename = `category-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), "public", "uploads", "categories")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }

    // Salvar arquivo
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Retornar URL pública
    const publicUrl = `/uploads/categories/${filename}`

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem" },
      { status: 500 }
    )
  }
}