import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Converte ArrayBuffer para Uint8Array
function toArrayBufferView(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer);
}

// Função para parsear multipart/form-data manualmente usando apenas Uint8Array
async function parseMultipart(request: NextRequest) {
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    throw new Error("Invalid content type");
  }

  const arrayBuffer = await request.arrayBuffer();
  const uint8Array = toArrayBufferView(arrayBuffer);
  const boundary = contentType.split("boundary=")[1];

  if (!boundary) {
    throw new Error("Boundary not found");
  }

  return { uint8Array, boundary };
}

// Extrai o arquivo do corpo multipart usando Uint8Array
function extractFileFromMultipart(data: Uint8Array, boundary: string): Uint8Array | null {
  const boundaryBytes = new TextEncoder().encode(`--${boundary}`);
  const endBoundaryBytes = new TextEncoder().encode(`--${boundary}--`);

  // Encontra o início do primeiro chunk
  let startIndex = indexOfArray(data, boundaryBytes) + boundaryBytes.length;
  if (startIndex === -1) return null;

  // Encontra o fim do chunk
  let endIndex = indexOfArray(data, boundaryBytes, startIndex);
  if (endIndex === -1) {
    endIndex = indexOfArray(data, endBoundaryBytes, startIndex);
  }

  if (endIndex === -1) return null;

  const chunk = data.slice(startIndex, endIndex);
  
  // Encontra onde terminam os cabeçalhos
  const headerEndIndex = indexOfArray(chunk, new TextEncoder().encode("\r\n\r\n")) + 4;
  if (headerEndIndex === -1) return null;

  // Retorna apenas os bytes do arquivo
  return chunk.slice(headerEndIndex);
}

// Função auxiliar para encontrar índice de um array dentro de outro
function indexOfArray(source: Uint8Array, search: Uint8Array, start = 0): number {
  for (let i = start; i <= source.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (source[i + j] !== search[j]) {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  return -1;
}

export async function POST(req: NextRequest) {
  try {
    // Parse do formulário usando apenas Uint8Array
    const { uint8Array, boundary } = await parseMultipart(req);
    
    // Extrai o arquivo
    const fileData = extractFileFromMultipart(uint8Array, boundary);
    if (!fileData) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Diretório de upload
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Gera nome único para o arquivo
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    // Salva o arquivo (agora usando Uint8Array diretamente)
    fs.writeFileSync(filePath, fileData);

    const url = `/uploads/${fileName}`;

    return new Response(
      JSON.stringify({ url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no upload:", error);
    return new Response(
      JSON.stringify({ error: "Erro no upload" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}