import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Categorias padrão
  const defaultCategories = [
    {
      name: 'general',
      displayName: 'Geral',
      icon: '🏠',
      color: '#3B82F6',
      description: 'Itens gerais e diversos',
      order: 1,
      isCustom: false,
      isActive: true
    },
    {
      name: 'food',
      displayName: 'Comida',
      icon: '🍎',
      color: '#F97316',
      description: 'Alimentos e comidas',
      order: 2,
      isCustom: false,
      isActive: true
    },
    {
      name: 'beverages',
      displayName: 'Bebidas',
      icon: '🥤',
      color: '#EAB308',
      description: 'Bebidas e líquidos',
      order: 3,
      isCustom: false,
      isActive: true
    },
    {
      name: 'emotions',
      displayName: 'Emoções',
      icon: '😊',
      color: '#10B981',
      description: 'Sentimentos e emoções',
      order: 4,
      isCustom: false,
      isActive: true
    },
    {
      name: 'actions',
      displayName: 'Ações',
      icon: '🏃',
      color: '#8B5CF6',
      description: 'Verbos e ações',
      order: 5,
      isCustom: false,
      isActive: true
    },
    {
      name: 'people',
      displayName: 'Pessoas',
      icon: '👨',
      color: '#EC4899',
      description: 'Pessoas e família',
      order: 6,
      isCustom: false,
      isActive: true
    },
    {
      name: 'places',
      displayName: 'Lugares',
      icon: '🏫',
      color: '#EF4444',
      description: 'Locais e lugares',
      order: 7,
      isCustom: false,
      isActive: true
    },
    {
      name: 'animals',
      displayName: 'Animais',
      icon: '🐶',
      color: '#14B8A6',
      description: 'Animais e pets',
      order: 8,
      isCustom: false,
      isActive: true
    }
  ]

  // Criar categorias padrão
  for (const category of defaultCategories) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name }
    })

    if (!existing) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Categoria criada: ${category.displayName}`)
    } else {
      console.log(`⏭️  Categoria já existe: ${category.displayName}`)
    }
  }

  console.log('✨ Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })