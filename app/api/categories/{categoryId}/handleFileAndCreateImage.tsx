async function uploadFile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Erro no upload')
  const data = await res.json()
  return data.url // ex: /uploads/uuid.jpg
}

async function createCard(categoryId: string, name: string, file?: File, imageUrlFromArasaac?: string) {
  let imageUrl = imageUrlFromArasaac ?? null
  if (file) {
    imageUrl = await uploadFile(file)
  }
  if (!imageUrl) throw new Error('Nenhuma imagem selecionada')

  const res = await fetch(`/api/categories/${categoryId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, imageUrl })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erro ao criar card')
  }
  return await res.json()
}