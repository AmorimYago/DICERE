// scripts/update-categories.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Função para buscar imagem do ARASAAC
async function getArasaacImage(pictogramId: number): Promise<string> {
  return `https://api.arasaac.org/api/pictograms/${pictogramId}?download=false`
}

async function safeDelete(modelDeleteFn: () => Promise<any>) {
  try {
    await modelDeleteFn()
  } catch (err: any) {
    if (err?.code === 'P2021') {
      console.warn('   ⚠️  Tabela não existe, pulando delete:', err.meta?.table || err.meta)
    } else {
      throw err
    }
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🗑️  Deletando dados antigos...')

  // Deletar na ordem correta para respeitar as foreign keys
  await safeDelete(() => prisma.comment.deleteMany({}))
  console.log('   ✅ Comments deletados')

  await safeDelete(() => prisma.sequenceItem.deleteMany({}))
  console.log('   ✅ SequenceItems deletados')

  await safeDelete(() => prisma.sequence.deleteMany({}))
  console.log('   ✅ Sequences deletadas')

  await safeDelete(() => prisma.image.deleteMany({}))
  console.log('   ✅ Images deletadas')

  await safeDelete(() => prisma.category.deleteMany({}))
  console.log('   ✅ Categories deletadas')

  console.log('')
  console.log('🚀 Criando novas categorias...')

  const categoriesData = [
    {
      name: 'geral',
      displayName: 'Geral',
      icon: '💬',
      color: '#E3F2FD',
      order: 1,
      pictogramId: 6632,
      cards: [
        { name: 'Eu', searchTerm: 'eu', pictogramId: 6632 },
        { name: 'Sim', searchTerm: 'sim', pictogramId: 5584 },
        { name: 'Não', searchTerm: 'não', pictogramId: 5526 },
        { name: 'Quero', searchTerm: 'querer', pictogramId: 5441 },
        { name: 'Não quero', searchTerm: 'não querer', pictogramId: 6156 },
        { name: 'Quero mais', searchTerm: 'querer mais', pictogramId: 32753 },
        { name: 'Ser', searchTerm: 'ser', pictogramId: 36480 },
        { name: 'Ir', searchTerm: 'ir', pictogramId: 8142 },
        { name: 'Ver', searchTerm: 'ver', pictogramId: 6564 },
        { name: 'Ouvir', searchTerm: 'ouvir', pictogramId: 6572 },
        { name: 'Por favor', searchTerm: 'por favor', pictogramId: 8195 },
        { name: 'Obrigado', searchTerm: 'obrigado', pictogramId: 8129 },
        { name: 'Desculpa', searchTerm: 'desculpa', pictogramId: 38361 },
        { name: 'Ajuda', searchTerm: 'ajuda', pictogramId: 12252 },
        { name: 'Oi', searchTerm: 'oi', pictogramId: 6522 },
        { name: 'Até logo', searchTerm: 'tchau', pictogramId: 6028 },
        { name: 'Ok', searchTerm: 'ok', pictogramId: 31410 },
        { name: 'Buscar', searchTerm: 'buscar', pictogramId: 27391 },
      ]
    },
    {
      name: 'comida',
      displayName: 'Comida',
      icon: '🍎',
      color: '#FFF3E0',
      order: 2,
      pictogramId: 4611,
      cards: [
        { name: 'Comer', searchTerm: 'comer', pictogramId: 38413 },
        { name: 'Maçã', searchTerm: 'maçã', pictogramId: 2462 },
        { name: 'Banana', searchTerm: 'banana', pictogramId: 9054 },
        { name: 'Uva', searchTerm: 'uva', pictogramId: 34120 },
        { name: 'Pão', searchTerm: 'pão', pictogramId: 2494 },
        { name: 'Manteiga', searchTerm: 'manteiga', pictogramId: 2461 },
        { name: 'Presunto', searchTerm: 'presunto', pictogramId: 2963 },
        { name: 'Queijo', searchTerm: 'queijo', pictogramId: 2541 },
        { name: 'Bolo', searchTerm: 'bolo', pictogramId: 29226 },
        { name: 'Biscoito', searchTerm: 'biscoito', pictogramId: 38649 },
        { name: 'Biscoito de chocolate', searchTerm: 'biscoito chocolate', pictogramId: 6525 },
        { name: 'Chocolate', searchTerm: 'chocolate', pictogramId: 25940 },
        { name: 'Sorvete', searchTerm: 'sorvete', pictogramId: 35209 },
        { name: 'Espaguete', searchTerm: 'espaguete', pictogramId: 2383 },
        { name: 'Pizza', searchTerm: 'pizza', pictogramId: 2527 },
        { name: 'Hambúrguer', searchTerm: 'hambúrguer', pictogramId: 2419 },
        { name: 'Batata frita', searchTerm: 'batata frita', pictogramId: 8653 },
        { name: 'Sopa', searchTerm: 'sopa', pictogramId: 35355 },
        { name: 'Iogurte', searchTerm: 'iogurte', pictogramId: 2618 },
        { name: 'Doce', searchTerm: 'doce', pictogramId: 22182 },
        { name: 'Arroz', searchTerm: 'arroz', pictogramId: 39387 },
        { name: 'Feijão', searchTerm: 'feijão', pictogramId: 3294 },
        { name: 'Salada', searchTerm: 'salada', pictogramId: 2377 },
        { name: 'Pão de forma', searchTerm: 'pão de forma', pictogramId: 2865 },
      ]
    },
    {
      name: 'bebidas',
      displayName: 'Bebidas',
      icon: '☕',
      color: '#E8F5E9',
      order: 3,
      pictogramId: 30403,
      cards: [
        { name: 'Beber', searchTerm: 'beber', pictogramId: 6061 },
        { name: 'Água', searchTerm: 'água', pictogramId: 2248 },
        { name: 'Suco de laranja', searchTerm: 'suco laranja', pictogramId: 2624 },
        { name: 'Leite', searchTerm: 'leite', pictogramId: 2445 },
        { name: 'Achocolatado', searchTerm: 'achocolatado', pictogramId: 4940 },
        { name: 'Vitamina de frutas', searchTerm: 'vitamina', pictogramId: 32368 },
        { name: 'Café', searchTerm: 'café', pictogramId: 2296 },
        { name: 'Chá', searchTerm: 'chá', pictogramId: 29802 },
        { name: 'Coca-cola', searchTerm: 'refrigerante', pictogramId: 2338 },
      ]
    },
    {
      name: 'sentimentos',
      displayName: 'Sentimentos',
      icon: '😊',
      color: '#FFF9C4',
      order: 4,
      pictogramId: 11476,
      cards: [
        { name: 'Feliz', searchTerm: 'feliz', pictogramId: 6892 },
        { name: 'Engraçado', searchTerm: 'engraçado', pictogramId: 35555 },
        { name: 'Amoroso', searchTerm: 'amor', pictogramId: 37799 },
        { name: 'Apaixonado', searchTerm: 'apaixonado', pictogramId: 30389 },
        { name: 'Confuso', searchTerm: 'confuso', pictogramId: 35541 },
        { name: 'Chateado', searchTerm: 'chateado', pictogramId: 35531 },
        { name: 'Triste', searchTerm: 'triste', pictogramId: 35545 },
        { name: 'Irritado', searchTerm: 'irritado', pictogramId: 35539 },
        { name: 'Doente', searchTerm: 'doente', pictogramId: 8558 },
        { name: 'Bom', searchTerm: 'bom', pictogramId: 5397 },
        { name: 'Ruim', searchTerm: 'ruim', pictogramId: 5504 },
        { name: 'Com sono', searchTerm: 'sono', pictogramId: 6479 },
      ]
    },
    {
      name: 'saude',
      displayName: 'Saúde',
      icon: '❤️',
      color: '#FFEBEE',
      order: 5,
      pictogramId: 14264,
      cards: [
        { name: 'Calor', searchTerm: 'calor', pictogramId: 35561 },
        { name: 'Frio', searchTerm: 'frio', pictogramId: 35557 },
        { name: 'Dor', searchTerm: 'dor', pictogramId: 2367 },
        { name: 'Dor de cabeça', searchTerm: 'dor de cabeça', pictogramId: 28753 },
        { name: 'Dor de dente', searchTerm: 'dor de dente', pictogramId: 10263 },
        { name: 'Dor de barriga', searchTerm: 'dor de barriga', pictogramId: 10264 },
        { name: 'Dor nas costas', searchTerm: 'dor nas costas', pictogramId: 7775 },
        { name: 'Dor de garganta', searchTerm: 'dor de garganta', pictogramId: 10262 },
        { name: 'Dor de ouvido', searchTerm: 'dor de ouvido', pictogramId: 10265 },
        { name: 'Doente', searchTerm: 'doente', pictogramId: 8558 },
        { name: 'Tosse', searchTerm: 'tosse', pictogramId: 26508 },
        { name: 'Alergia', searchTerm: 'alergia', pictogramId: 31823 },
        { name: 'Resfriado', searchTerm: 'resfriado', pictogramId: 5479 },
        { name: 'Febre', searchTerm: 'febre', pictogramId: 32530 },
        { name: 'Sangue', searchTerm: 'sangue', pictogramId: 2803 },
        { name: 'Machucado', searchTerm: 'machucado', pictogramId: 5484 },
        { name: 'Queimadura', searchTerm: 'queimadura', pictogramId: 22064 },
        { name: 'Diarreia', searchTerm: 'diarreia', pictogramId: 38314 },
      ]
    },
    {
      name: 'objetos',
      displayName: 'Objetos',
      icon: '📱',
      color: '#F3E5F5',
      order: 6,
      pictogramId: 11318,
      cards: [
        { name: 'Usar', searchTerm: 'usar', pictogramId: 15485 },
        { name: 'Celular', searchTerm: 'celular', pictogramId: 25269 },
        { name: 'Tablet', searchTerm: 'tablet', pictogramId: 29151 },
        { name: 'Notebook', searchTerm: 'notebook', pictogramId: 7214 },
        { name: 'Óculos', searchTerm: 'óculos', pictogramId: 3329 },
        { name: 'Tabela de comunicação', searchTerm: 'prancha comunicação', pictogramId: 31882 },
        { name: 'Fone de ouvido', searchTerm: 'fone', pictogramId: 11208 },
        { name: 'Rádio', searchTerm: 'rádio', pictogramId: 38211 },
        { name: 'Livro', searchTerm: 'livro', pictogramId: 2450 },
        { name: 'Aparelho auditivo', searchTerm: 'aparelho auditivo', pictogramId: 5912 },
        { name: 'Muletas', searchTerm: 'muletas', pictogramId: 6154 },
        { name: 'Cadeira de rodas', searchTerm: 'cadeira de rodas', pictogramId: 6212 },
      ]
    },
    {
      name: 'lugares',
      displayName: 'Lugares',
      icon: '📍',
      color: '#E0F2F1',
      order: 7,
      pictogramId: 24161,
      cards: [
        { name: 'Casa', searchTerm: 'casa', pictogramId: 2317 },
        { name: 'Escola', searchTerm: 'escola', pictogramId: 3082 },
        { name: 'Trabalho', searchTerm: 'trabalho', pictogramId: 11457 },
        { name: 'Supermercado', searchTerm: 'supermercado', pictogramId: 3389 },
        { name: 'Banco', searchTerm: 'banco', pictogramId: 3062 },
        { name: 'Hospital', searchTerm: 'hospital', pictogramId: 37408 },
        { name: 'Farmácia', searchTerm: 'farmácia', pictogramId: 34274 },
        { name: 'Loja', searchTerm: 'loja', pictogramId: 9116 },
        { name: 'Restaurante', searchTerm: 'restaurante', pictogramId: 35391 },
        { name: 'Igreja', searchTerm: 'igreja', pictogramId: 3118 },
      ]
    },
    {
      name: 'roupas',
      displayName: 'Roupas',
      icon: '👕',
      color: '#FCE4EC',
      order: 8,
      pictogramId: 7233,
      cards: [
        { name: 'Vestir', searchTerm: 'vestir', pictogramId: 27052 },
        { name: 'Calça jeans', searchTerm: 'calça jeans', pictogramId: 24222 },
        { name: 'Calça', searchTerm: 'calça', pictogramId: 2565 },
        { name: 'Camiseta', searchTerm: 'camiseta', pictogramId: 2309 },
        { name: 'Vestido', searchTerm: 'vestido', pictogramId: 2613 },
        { name: 'Cueca', searchTerm: 'cueca', pictogramId: 2303 },
        { name: 'Calcinha', searchTerm: 'calcinha', pictogramId: 2289 },
        { name: 'Regata', searchTerm: 'regata', pictogramId: 2310 },
        { name: 'Saia', searchTerm: 'saia', pictogramId: 2391 },
        { name: 'Pijama', searchTerm: 'pijama', pictogramId: 2522 },
        { name: 'Moletom', searchTerm: 'moletom', pictogramId: 8701 },
        { name: 'Casaco', searchTerm: 'casaco', pictogramId: 4872 },
        { name: 'Capa de chuva', searchTerm: 'capa de chuva', pictogramId: 4927 },
        { name: 'Meia', searchTerm: 'meia', pictogramId: 2298 },
        { name: 'Chinelo', searchTerm: 'chinelo', pictogramId: 8343 },
        { name: 'Tênis', searchTerm: 'tênis', pictogramId: 8332 },
        { name: 'Sandália', searchTerm: 'sandália', pictogramId: 8368 },
        { name: 'Bota', searchTerm: 'bota', pictogramId: 36502 },
      ]
    },
    {
      name: 'cores',
      displayName: 'Cores',
      icon: '🎨',
      color: '#E1F5FE',
      order: 9,
      pictogramId: 5968,
      cards: [
        { name: 'Preto', searchTerm: 'preto', pictogramId: 2886 },
        { name: 'Azul', searchTerm: 'azul', pictogramId: 4869 },
        { name: 'Vermelho', searchTerm: 'vermelho', pictogramId: 2808 },
        { name: 'Branco', searchTerm: 'branco', pictogramId: 2662 },
        { name: 'Verde', searchTerm: 'verde', pictogramId: 4887 },
        { name: 'Amarelo', searchTerm: 'amarelo', pictogramId: 2648 },
        { name: 'Rosa', searchTerm: 'rosa', pictogramId: 2807 },
      ]
    },
    {
      name: 'numeros',
      displayName: 'Números',
      icon: '🔢',
      color: '#FFF8E1',
      order: 10,
      pictogramId: 2879,
      cards: [
        { name: '0', searchTerm: 'zero', pictogramId: 6972 },
        { name: '1', searchTerm: 'um', pictogramId: 7291 },
        { name: '2', searchTerm: 'dois', pictogramId: 7027 },
        { name: '3', searchTerm: 'três', pictogramId: 7283 },
        { name: '4', searchTerm: 'quatro', pictogramId: 7005 },
        { name: '5', searchTerm: 'cinco', pictogramId: 6979 },
        { name: '6', searchTerm: 'seis', pictogramId: 7241 },
        { name: '7', searchTerm: 'sete', pictogramId: 7248 },
        { name: '8', searchTerm: 'oito', pictogramId: 7189 },
        { name: '9', searchTerm: 'nove', pictogramId: 7188 },
        { name: '10', searchTerm: 'dez', pictogramId: 7025 },
      ]
    },
    {
      name: 'alfabeto',
      displayName: 'Alfabeto',
      icon: '🔤',
      color: '#F1F8E9',
      order: 11,
      pictogramId: 3050,
      cards: [
        { name: 'A', searchTerm: 'letra a', pictogramId: 3049 },
        { name: 'B', searchTerm: 'letra b', pictogramId: 3061 },
        { name: 'C', searchTerm: 'letra c', pictogramId: 3069 },
        { name: 'D', searchTerm: 'letra d', pictogramId: 3088 },
        { name: 'E', searchTerm: 'letra e', pictogramId: 3096 },
        { name: 'F', searchTerm: 'letra f', pictogramId: 3101 },
        { name: 'G', searchTerm: 'letra g', pictogramId: 3104 },
        { name: 'H', searchTerm: 'letra h', pictogramId: 3112 },
        { name: 'I', searchTerm: 'letra i', pictogramId: 3117 },
        { name: 'J', searchTerm: 'letra j', pictogramId: 3119 },
        { name: 'K', searchTerm: 'letra k', pictogramId: 3120 },
        { name: 'L', searchTerm: 'letra l', pictogramId: 3121 },
        { name: 'M', searchTerm: 'letra m', pictogramId: 3125 },
        { name: 'N', searchTerm: 'letra n', pictogramId: 3133 },
        { name: 'O', searchTerm: 'letra o', pictogramId: 3136 },
        { name: 'P', searchTerm: 'letra p', pictogramId: 3137 },
        { name: 'Q', searchTerm: 'letra q', pictogramId: 3146 },
        { name: 'R', searchTerm: 'letra r', pictogramId: 3147 },
        { name: 'S', searchTerm: 'letra s', pictogramId: 3152 },
        { name: 'T', searchTerm: 'letra t', pictogramId: 3158 },
        { name: 'U', searchTerm: 'letra u', pictogramId: 3164 },
        { name: 'V', searchTerm: 'letra v', pictogramId: 3165 },
        { name: 'W', searchTerm: 'letra w', pictogramId: 3167 },
        { name: 'X', searchTerm: 'letra x', pictogramId: 3168 },
        { name: 'Y', searchTerm: 'letra y', pictogramId: 3171 },
        { name: 'Z', searchTerm: 'letra z', pictogramId: 3173 },
        { name: 'Arroba', searchTerm: 'Arroba', pictogramId: 3177 },
        { name: 'Vírgula', searchTerm: 'Vírgula', pictogramId: 3189 },
        { name: 'Ponto', searchTerm: 'Ponto', pictogramId: 3218 },
        { name: 'Ponto e vírigula', searchTerm: 'Ponto e vírigula', pictogramId: 3422 },
        { name: 'Interrogação', searchTerm: 'Interrogação', pictogramId: 3418 },
        { name: 'Exclamação', searchTerm: 'Exclamação', pictogramId: 3417 },
        { name: 'Dois pontos', searchTerm: 'Dois pontos', pictogramId: 3420 },
        { name: 'Mais', searchTerm: 'Mais', pictogramId: 3220 },
        { name: 'Menos', searchTerm: 'Menos', pictogramId: 3200 },
        { name: 'Asterisco', searchTerm: 'Asterisco', pictogramId: 3178 },
        { name: 'Aspas', searchTerm: 'Aspas', pictogramId: 3190 },
        { name: 'Barra', searchTerm: 'Barra', pictogramId: 3413 },
      ]
    },
    {
      name: 'formas',
      displayName: 'Formas',
      icon: '⬜',
      color: '#EFEBE9',
      order: 12,
      pictogramId: 4651,
      cards: [
        { name: 'Círculo', searchTerm: 'círculo', pictogramId: 4603 },
        { name: 'Quadrado', searchTerm: 'quadrado', pictogramId: 4616 },
        { name: 'Retângulo', searchTerm: 'retângulo', pictogramId: 4731 },
        { name: 'Losango', searchTerm: 'losango', pictogramId: 4734 },
        { name: 'Triângulo', searchTerm: 'triângulo', pictogramId: 4763 },
        { name: 'Pentágono', searchTerm: 'pentágono', pictogramId: 4715 },
        { name: 'Hexágono', searchTerm: 'hexágono', pictogramId: 4663 },
        { name: 'Estrela', searchTerm: 'estrela', pictogramId: 4644 },
        { name: 'Linha', searchTerm: 'linha', pictogramId: 4684 },
        { name: 'Coração', searchTerm: 'coração', pictogramId: 4613 },
        { name: 'Pirâmide', searchTerm: 'pirâmide', pictogramId: 9110 },
        { name: 'Cilindro', searchTerm: 'cilindro', pictogramId: 9111 },
        { name: 'Cone', searchTerm: 'cone', pictogramId: 9112 },
        { name: 'Esfera', searchTerm: 'esfera', pictogramId: 9113 },
        { name: 'Cubo', searchTerm: 'cubo', pictogramId: 9115 },
      ]
    },
    {
      name: 'diversao',
      displayName: 'Diversão',
      icon: '🎮',
      color: '#E8EAF6',
      order: 13,
      pictogramId: 37464,
      cards: [
        { name: 'Cartas de baralho', searchTerm: 'baralho', pictogramId: 3182 },
        { name: 'Brincar', searchTerm: 'brincar', pictogramId: 23392 },
        { name: 'Videogame', searchTerm: 'videogame', pictogramId: 10162 },
        { name: 'Bola', searchTerm: 'bola', pictogramId: 2269 },
        { name: 'Blocos', searchTerm: 'blocos', pictogramId: 8508 },
        { name: 'Lápis de cor', searchTerm: 'lápis de cor', pictogramId: 17016 },
        { name: 'Carro', searchTerm: 'carro', pictogramId: 6981 },
        { name: 'Boneca', searchTerm: 'boneca', pictogramId: 26238 },
        { name: 'Amigos', searchTerm: 'amigos', pictogramId: 2255 },
        { name: 'Música', searchTerm: 'música', pictogramId: 38041 },
        { name: 'Televisão', searchTerm: 'televisão', pictogramId: 16139 },
        { name: 'Filmes', searchTerm: 'filmes', pictogramId: 36477 },
        { name: 'Vídeos', searchTerm: 'vídeos', pictogramId: 38207 },
      ]
    },
  ]

  for (const categoryData of categoriesData) {
    console.log(`\n📁 Criando categoria: ${categoryData.displayName}`)
    let category
    try {
      const imageUrl = await getArasaacImage(categoryData.pictogramId)
      category = await prisma.category.create({
        data: {
          name: categoryData.name,
          displayName: categoryData.displayName,
          icon: categoryData.icon,
          imageUrl,
          color: categoryData.color,
          order: categoryData.order,
        }
      })
      console.log(`   ✅ Categoria criada: ${category.displayName}`)
    } catch (err) {
      console.error(`   ❌ Erro ao criar categoria ${categoryData.displayName}:`, err)
      continue
    }

    let cardOrder = 1
    for (const card of categoryData.cards) {
      try {
        const cardImageUrl = await getArasaacImage(card.pictogramId)
        await prisma.image.create({
          data: {
            name: card.name,
            imageUrl: cardImageUrl,
            categoryId: category.id,
            order: cardOrder++,
          }
        })
        console.log(`   ✅ Card criado: ${card.name}`)
        await delay(100) // não sobrecarregar a API
      } catch (error) {
        console.error(`   ❌ Erro ao criar card ${card.name}:`, error)
      }
    }
  }

  console.log('\n✅ Todas as categorias foram criadas com sucesso!')
  console.log('\n📊 Resumo:')

  const totalCategories = await prisma.category.count()
  const totalImages = await prisma.image.count()

  console.log(`   - ${totalCategories} categorias`)
  console.log(`   - ${totalImages} cards`)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })