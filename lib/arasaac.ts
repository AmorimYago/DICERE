// Função para buscar pictogramas da API ARASAAC
export async function searchArasaacPictograms(searchTerm: string, limit: number = 10) {
  try {
    const response = await fetch(
      `https://api.arasaac.org/api/pictograms/pt/search/${encodeURIComponent(searchTerm)}`
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar pictogramas')
    }
    
    const data = await response.json()
    
    // Retornar apenas os primeiros resultados com as URLs das imagens
    return data.slice(0, limit).map((item: any) => ({
      id: item._id,
      keywords: item.keywords,
      imageUrl: `https://api.arasaac.org/api/pictograms/${item._id}?download=false`,
      name: item.keywords[0]?.keyword || 'Sem nome'
    }))
  } catch (error) {
    console.error('Erro ao buscar pictogramas ARASAAC:', error)
    return []
  }
}

// Função para obter URL de um pictograma específico
export function getArasaacImageUrl(pictogramId: number | string): string {
  return `https://api.arasaac.org/api/pictograms/${pictogramId}?download=false`
}

// Função para buscar pictogramas por categoria na API ARASAAC
export async function getPictogramsByCategory(category: string, limit: number = 10) {
  try {
    const response = await fetch(
      `https://api.arasaac.org/api/pictograms/pt/category/${encodeURIComponent(category)}`
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar pictogramas por categoria')
    }
    
    const data = await response.json()
    
    return data.slice(0, limit).map((item: any) => ({
      id: item._id,
      keywords: item.keywords,
      imageUrl: `https://api.arasaac.org/api/pictograms/${item._id}?download=false`,
      name: item.keywords[0]?.keyword || 'Sem nome'
    }))
  } catch (error) {
    console.error('Erro ao buscar pictogramas por categoria ARASAAC:', error)
    return []
  }
}