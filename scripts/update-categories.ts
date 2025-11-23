import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getArasaacImage(pictogramId: number): Promise<string> {
  return `https://api.arasaac.org/api/pictograms/${pictogramId}?download=false`
}

async function safeDelete(modelDeleteFn: () => Promise<any>) {
  try {
    await modelDeleteFn()
  } catch (err: any) {
    if (err?.code === 'P2021') {
      console.warn('Tabela não existe, pulando delete:', err.meta?.table || err.meta)
    } else {
      throw err
    }
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('Deletando dados antigos...')

  await safeDelete(() => prisma.comment.deleteMany({}))
  await safeDelete(() => prisma.sequenceItem.deleteMany({}))
  await safeDelete(() => prisma.sequence.deleteMany({}))
  await safeDelete(() => prisma.image.deleteMany({}))
  await safeDelete(() => prisma.category.deleteMany({}))

  console.log('Criando categorias e cards...')

  const categoriesData = [
    {
      name: 'geral',
      displayName: 'Geral',
      icon: '💬',
      color: '#E3F2FD',
      order: 1,
      pictogramId: 6632,
      cards: [
        { name: 'Eu', pictogramId: 6632 },
        { name: 'Sim', pictogramId: 5584 },
        { name: 'Não', pictogramId: 5526 },
        { name: 'Quero', pictogramId: 5441 },
        { name: 'Não quero', pictogramId: 6156 },
        { name: 'Quero mais', pictogramId: 32753 },
        { name: 'Ser', pictogramId: 36480 },
        { name: 'Ir', pictogramId: 8142 },
        { name: 'Ver', pictogramId: 6564 },
        { name: 'Ouvir', pictogramId: 6572 },
        { name: 'Por favor', pictogramId: 8195 },
        { name: 'Obrigado', pictogramId: 8129 },
        { name: 'Desculpa', pictogramId: 38361 },
        { name: 'Ajuda', pictogramId: 12252 },
        { name: 'Oi', pictogramId: 6522 },
        { name: 'Até logo', pictogramId: 6028 },
        { name: 'Ok', pictogramId: 31410 },
        { name: 'Buscar', pictogramId: 27391 },
      ],
    },
    {
      name: 'comida',
      displayName: 'Comida',
      icon: '🍎',
      color: '#FFF3E0',
      order: 2,
      pictogramId: 4611,
      cards: [
        { name: 'Comer', pictogramId: 38413 },
        { name: 'Maçã', pictogramId: 2462 },
        { name: 'Banana', pictogramId: 9054 },
        { name: 'Uva', pictogramId: 34120 },
        { name: 'Pão', pictogramId: 2494 },
        { name: 'Manteiga', pictogramId: 2461 },
        { name: 'Presunto', pictogramId: 2963 },
        { name: 'Queijo', pictogramId: 2541 },
        { name: 'Bolo', pictogramId: 29226 },
        { name: 'Biscoito', pictogramId: 38649 },
        { name: 'Biscoito de chocolate', pictogramId: 6525 },
        { name: 'Chocolate', pictogramId: 25940 },
        { name: 'Sorvete', pictogramId: 35209 },
        { name: 'Espaguete', pictogramId: 2383 },
        { name: 'Pizza', pictogramId: 2527 },
        { name: 'Hambúrguer', pictogramId: 2419 },
        { name: 'Batata frita', pictogramId: 8653 },
        { name: 'Sopa', pictogramId: 35355 },
        { name: 'Iogurte', pictogramId: 2618 },
        { name: 'Doce', pictogramId: 22182 },
        { name: 'Arroz', pictogramId: 39387 },
        { name: 'Feijão', pictogramId: 3294 },
        { name: 'Salada', pictogramId: 2377 },
        { name: 'Pão de forma', pictogramId: 2865 },
      ],
    },
    {
      name: 'bebidas',
      displayName: 'Bebidas',
      icon: '☕',
      color: '#E8F5E9',
      order: 3,
      pictogramId: 30403,
      cards: [
        { name: 'Beber', pictogramId: 6061 },
        { name: 'Água', pictogramId: 2248 },
        { name: 'Suco de laranja', pictogramId: 2624 },
        { name: 'Leite', pictogramId: 2445 },
        { name: 'Achocolatado', pictogramId: 4940 },
        { name: 'Vitamina de frutas', pictogramId: 32368 },
        { name: 'Café', pictogramId: 2296 },
        { name: 'Chá', pictogramId: 29802 },
        { name: 'Coca-cola', pictogramId: 2338 },
      ],
    },
    {
      name: 'sentimentos',
      displayName: 'Sentimentos',
      icon: '😊',
      color: '#FFF9C4',
      order: 4,
      pictogramId: 11476,
      cards: [
        { name: 'Feliz', pictogramId: 6892 },
        { name: 'Engraçado', pictogramId: 35555 },
        { name: 'Amoroso', pictogramId: 37799 },
        { name: 'Apaixonado', pictogramId: 30389 },
        { name: 'Confuso', pictogramId: 35541 },
        { name: 'Chateado', pictogramId: 35531 },
        { name: 'Triste', pictogramId: 35545 },
        { name: 'Irritado', pictogramId: 35539 },
        { name: 'Doente', pictogramId: 8558 },
        { name: 'Bom', pictogramId: 5397 },
        { name: 'Ruim', pictogramId: 5504 },
        { name: 'Com sono', pictogramId: 6479 },
      ],
    },
    {
      name: 'saude',
      displayName: 'Saúde',
      icon: '❤️',
      color: '#FFEBEE',
      order: 5,
      pictogramId: 14264,
      cards: [
        { name: 'Calor', pictogramId: 35561 },
        { name: 'Frio', pictogramId: 35557 },
        { name: 'Dor', pictogramId: 2367 },
        { name: 'Dor de cabeça', pictogramId: 28753 },
        { name: 'Dor de dente', pictogramId: 10263 },
        { name: 'Dor de barriga', pictogramId: 10264 },
        { name: 'Dor nas costas', pictogramId: 7775 },
        { name: 'Dor de garganta', pictogramId: 10262 },
        { name: 'Dor de ouvido', pictogramId: 10265 },
        { name: 'Doente', pictogramId: 8558 },
        { name: 'Tosse', pictogramId: 26508 },
        { name: 'Alergia', pictogramId: 31823 },
        { name: 'Resfriado', pictogramId: 5479 },
        { name: 'Febre', pictogramId: 32530 },
        { name: 'Sangue', pictogramId: 2803 },
        { name: 'Machucado', pictogramId: 5484 },
        { name: 'Queimadura', pictogramId: 22064 },
        { name: 'Diarreia', pictogramId: 38314 },
      ],
    },
    {
      name: 'objetos',
      displayName: 'Objetos',
      icon: '📱',
      color: '#F3E5F5',
      order: 6,
      pictogramId: 11318,
      cards: [
        { name: 'Usar', pictogramId: 15485 },
        { name: 'Celular', pictogramId: 25269 },
        { name: 'Tablet', pictogramId: 29151 },
        { name: 'Notebook', pictogramId: 7214 },
        { name: 'Óculos', pictogramId: 3329 },
        { name: 'Tabela de comunicação', pictogramId: 31882 },
        { name: 'Fone de ouvido', pictogramId: 11208 },
        { name: 'Rádio', pictogramId: 38211 },
        { name: 'Livro', pictogramId: 2450 },
        { name: 'Aparelho auditivo', pictogramId: 5912 },
        { name: 'Muletas', pictogramId: 6154 },
        { name: 'Cadeira de rodas', pictogramId: 6212 },
      ],
    },
    {
      name: 'lugares',
      displayName: 'Lugares',
      icon: '📍',
      color: '#E0F2F1',
      order: 7,
      pictogramId: 24161,
      cards: [
        { name: 'Casa', pictogramId: 2317 },
        { name: 'Escola', pictogramId: 2441 },
        { name: 'Parque', pictogramId: 2419 },
        { name: 'Praia', pictogramId: 2420 },
        { name: 'Hospital', pictogramId: 2418 },
        { name: 'Igreja', pictogramId: 2421 },
        { name: 'Supermercado', pictogramId: 2422 },
        { name: 'Restaurante', pictogramId: 2423 },
        { name: 'Cinema', pictogramId: 2424 },
        { name: 'Museu', pictogramId: 2425 },
      ],
    },
    {
      name: 'roupas',
      displayName: 'Roupas',
      icon: '👕',
      color: '#E1F5FE',
      order: 8,
      pictogramId: 12345,
      cards: [
        { name: 'Camisa', pictogramId: 12346 },
        { name: 'Calça', pictogramId: 12347 },
        { name: 'Sapato', pictogramId: 12348 },
        { name: 'Chapéu', pictogramId: 12349 },
      ],
    },
    {
      name: 'cores',
      displayName: 'Cores',
      icon: '🎨',
      color: '#FFFDE7',
      order: 9,
      pictogramId: 67890,
      cards: [
        { name: 'Vermelho', pictogramId: 67891 },
        { name: 'Azul', pictogramId: 67892 },
        { name: 'Verde', pictogramId: 67893 },
        { name: 'Amarelo', pictogramId: 67894 },
      ],
    },
    {
      name: 'numeros',
      displayName: 'Números',
      icon: '🔢',
      color: '#E8EAF6',
      order: 10,
      pictogramId: 13579,
      cards: [
        { name: 'Um', pictogramId: 13580 },
        { name: 'Dois', pictogramId: 13581 },
        { name: 'Três', pictogramId: 13582 },
        { name: 'Quatro', pictogramId: 13583 },
      ],
    },
    {
      name: 'alfabeto',
      displayName: 'Alfabeto',
      icon: '🔤',
      color: '#F3E5F5',
      order: 11,
      pictogramId: 24680,
      cards: [
        { name: 'A', pictogramId: 24681 },
        { name: 'B', pictogramId: 24682 },
        { name: 'C', pictogramId: 24683 },
        { name: 'D', pictogramId: 24684 },
      ],
    },
    {
      name: 'formas',
      displayName: 'Formas',
      icon: '🔷',
      color: '#E0F7FA',
      order: 12,
      pictogramId: 11223,
      cards: [
        { name: 'Círculo', pictogramId: 11224 },
        { name: 'Quadrado', pictogramId: 11225 },
        { name: 'Triângulo', pictogramId: 11226 },
        { name: 'Retângulo', pictogramId: 11227 },
      ],
    },
    {
      name: 'diversao',
      displayName: 'Diversão',
      icon: '🎉',
      color: '#FFF3E0',
      order: 13,
      pictogramId: 33445,
      cards: [
        { name: 'Brincar', pictogramId: 33446 },
        { name: 'Correr', pictogramId: 33447 },
        { name: 'Pular', pictogramId: 33448 },
        { name: 'Dançar', pictogramId: 33449 },
      ],
    },
  ]

  for (const categoryData of categoriesData) {
    console.log(`Criando categoria: ${categoryData.displayName}`)
    try {
      const imageUrl = await getArasaacImage(categoryData.pictogramId)
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          displayName: categoryData.displayName,
          icon: categoryData.icon,
          imageUrl,
          color: categoryData.color,
          order: categoryData.order,
          isCustom: false,
        },
      })

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
              isCustom: false,
              isActive: true,
            },
          })
          await delay(100)
        } catch (error) {
          console.error(`Erro ao criar card ${card.name}:`, error)
        }
      }
    } catch (error) {
      console.error(`Erro ao criar categoria ${categoryData.displayName}:`, error)
    }
  }

  console.log('Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })