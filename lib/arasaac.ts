/**
 * ARASAAC API Integration Service
 * API Documentation: https://arasaac.org/developers/api
 */

const ARASAAC_API_BASE = 'https://api.arasaac.org/v1';

export interface ArasaacPictogram {
  _id: number;
  keywords?: Array<{
    keyword: string;
    type: number;
    meaning?: string;
  }>;
  tags?: string[];
  schematic?: boolean;
  sex?: boolean;
  violence?: boolean;
  aac?: boolean;
  aacColor?: boolean;
  skin?: boolean;
  hair?: boolean;
  downloads?: number;
  lastUpdated?: number;
}

export interface ArasaacSearchResult {
  id: number;
  keywords: string[];
  imageUrl: string;
  tags?: string[];
}

/**
 * Search pictograms by keyword in Portuguese
 * @param keyword - Search term in Portuguese
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of pictograms matching the search
 */
export async function searchPictograms(
  keyword: string,
  limit: number = 20
): Promise<ArasaacSearchResult[]> {
  try {
    // ARASAAC API endpoint for searching pictograms
    // We search in Portuguese (pt)
    const url = `${ARASAAC_API_BASE}/pictograms/pt/search/${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`ARASAAC API error: ${response.status}`);
      return [];
    }

    const data: ArasaacPictogram[] = await response.json();
    
    // Transform and limit results
    return data.slice(0, limit).map(pictogram => ({
      id: pictogram._id,
      keywords: pictogram.keywords?.map(k => k.keyword) || [],
      imageUrl: getPictogramImageUrl(pictogram._id),
      tags: pictogram.tags,
    }));
  } catch (error) {
    console.error('Error fetching pictograms from ARASAAC:', error);
    return [];
  }
}

/**
 * Get image URL for a specific pictogram ID
 * @param pictogramId - ARASAAC pictogram ID
 * @param color - Whether to return colored version (default: true)
 * @param backgroundColor - Whether to include background (default: false)
 * @returns URL to the pictogram image
 */
export function getPictogramImageUrl(
  pictogramId: number,
  color: boolean = true,
  backgroundColor: boolean = false
): string {
  const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/de/National_Park_Service_sample_pictographs.svg';
  const bgParam = backgroundColor ? '?backgroundColor=true' : '';
  
  if (color) {
    return `${baseUrl}/${pictogramId}/${pictogramId}_500.png${bgParam}`;
  }
  
  return `${baseUrl}/${pictogramId}/${pictogramId}_bw_500.png${bgParam}`;
}

/**
 * Get pictogram details by ID
 * @param pictogramId - ARASAAC pictogram ID
 * @returns Pictogram details
 */
export async function getPictogramById(
  pictogramId: number
): Promise<ArasaacPictogram | null> {
  try {
    const url = `${ARASAAC_API_BASE}/pictograms/pt/${pictogramId}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`ARASAAC API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pictogram from ARASAAC:', error);
    return null;
  }
}

/**
 * Get multiple pictograms by searching multiple keywords
 * Useful for populating categories with related pictograms
 * @param keywords - Array of keywords to search
 * @param perKeyword - Number of results per keyword (default: 5)
 * @returns Array of unique pictograms
 */
export async function searchMultiplePictograms(
  keywords: string[],
  perKeyword: number = 5
): Promise<ArasaacSearchResult[]> {
  try {
    const allResults = await Promise.all(
      keywords.map(keyword => searchPictograms(keyword, perKeyword))
    );

    // Flatten and remove duplicates based on ID
    const uniquePictograms = new Map<number, ArasaacSearchResult>();
    
    allResults.flat().forEach(pictogram => {
      if (!uniquePictograms.has(pictogram.id)) {
        uniquePictograms.set(pictogram.id, pictogram);
      }
    });

    return Array.from(uniquePictograms.values());
  } catch (error) {
    console.error('Error fetching multiple pictograms:', error);
    return [];
  }
}

/**
 * Category-specific pictogram search presets
 * These are curated keyword lists for each category to get relevant pictograms
 */
export const CATEGORY_KEYWORDS = {
  GERAL: ['eu', 'você', 'sim', 'não', 'obrigado', 'por favor', 'ajuda', 'mais', 'parar', 'acabou'],
  COMIDA: ['comida', 'pão', 'arroz', 'feijão', 'fruta', 'maçã', 'banana', 'carne', 'peixe', 'ovo'],
  BEBIDAS: ['água', 'suco', 'leite', 'café', 'chá', 'refrigerante', 'beber'],
  SENTIMENTOS: ['feliz', 'triste', 'bravo', 'cansado', 'doente', 'assustado', 'amor', 'amigo'],
  SAUDE: ['médico', 'remédio', 'dor', 'hospital', 'dentista', 'doente', 'saúde'],
  OBJETOS: ['brinquedo', 'livro', 'cadeira', 'mesa', 'cama', 'telefone', 'computador', 'chave'],
  LUGARES: ['casa', 'escola', 'parque', 'hospital', 'loja', 'banheiro', 'quarto', 'cozinha'],
  ROUPAS: ['roupa', 'camisa', 'calça', 'sapato', 'vestido', 'chapéu', 'meia'],
  CORES: ['cor', 'vermelho', 'azul', 'verde', 'amarelo', 'preto', 'branco', 'rosa'],
  NUMEROS: ['número', 'um', 'dois', 'três', 'quatro', 'cinco', 'zero', 'dez'],
  ALFABETO: ['letra', 'a', 'b', 'c', 'alfabeto', 'vogal', 'consoante'],
  FORMAS: ['forma', 'círculo', 'quadrado', 'triângulo', 'retângulo', 'estrela'],
  DIVERSAO: ['brincar', 'jogar', 'música', 'dançar', 'cantar', 'parque', 'bola', 'diversão'],
};

/**
 * Fetch pictograms for a specific category
 * @param categoryName - Category name (e.g., 'COMIDA', 'BEBIDAS')
 * @param limit - Maximum number of pictograms to fetch
 * @returns Array of pictograms for the category
 */
export async function getPictogramsForCategory(
  categoryName: keyof typeof CATEGORY_KEYWORDS,
  limit: number = 30
): Promise<ArasaacSearchResult[]> {
  const keywords = CATEGORY_KEYWORDS[categoryName];
  
  if (!keywords) {
    console.error(`Unknown category: ${categoryName}`);
    return [];
  }

  const perKeyword = Math.ceil(limit / keywords.length);
  return searchMultiplePictograms(keywords, perKeyword);
}
