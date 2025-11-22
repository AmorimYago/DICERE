import { PrismaClient } from '@prisma/client'
import { 
  searchMultiplePictograms, 
  CATEGORY_KEYWORDS,
  getPictogramImageUrl 
} from '../lib/arasaac'

const prisma = new PrismaClient()

// Categories with Portuguese names and colors from DICERE logo
const CATEGORIES = [
  {
    name: 'GERAL',
    displayName: 'Geral',
    icon: 'MessageSquare',
    color: '#2196F3', // DICERE Blue
    order: 0,
  },
  {
    name: 'COMIDA',
    displayName: 'Comida',
    icon: 'Apple',
    color: '#FF6B35', // DICERE Orange
    order: 1,
  },
  {
    name: 'BEBIDAS',
    displayName: 'Bebidas',
    icon: 'Coffee',
    color: '#4CAF50', // DICERE Green
    order: 2,
  },
  {
    name: 'SENTIMENTOS',
    displayName: 'Sentimentos',
    icon: 'Heart',
    color: '#FFC107', // DICERE Yellow
    order: 3,
  },
  {
    name: 'SAUDE',
    displayName: 'Saúde',
    icon: 'Heart',
    color: '#2196F3',
    order: 4,
  },
  {
    name: 'OBJETOS',
    displayName: 'Objetos',
    icon: 'Box',
    color: '#FF6B35',
    order: 5,
  },
  {
    name: 'LUGARES',
    displayName: 'Lugares',
    icon: 'MapPin',
    color: '#4CAF50',
    order: 6,
  },
  {
    name: 'ROUPAS',
    displayName: 'Roupas',
    icon: 'Shirt',
    color: '#FFC107',
    order: 7,
  },
  {
    name: 'CORES',
    displayName: 'Cores',
    icon: 'Palette',
    color: '#2196F3',
    order: 8,
  },
  {
    name: 'NUMEROS',
    displayName: 'Números',
    icon: 'Hash',
    color: '#FF6B35',
    order: 9,
  },
  {
    name: 'ALFABETO',
    displayName: 'Alfabeto',
    icon: 'Type',
    color: '#4CAF50',
    order: 10,
  },
  {
    name: 'FORMAS',
    displayName: 'Formas',
    icon: 'Square',
    color: '#FFC107',
    order: 11,
  },
  {
    name: 'DIVERSAO',
    displayName: 'Diversão',
    icon: 'Smile',
    color: '#2196F3',
    order: 12,
  },
]

async function seedCategories() {
  console.log('🌱 Seeding categories...')

  for (const category of CATEGORIES) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: category.name },
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      })
      console.log(`✅ Created category: ${category.displayName}`)
    } else {
      await prisma.category.update({
        where: { name: category.name },
        data: category,
      })
      console.log(`🔄 Updated category: ${category.displayName}`)
    }
  }
}

async function seedPictograms() {
  console.log('🌱 Seeding pictograms from ARASAAC...')

  const categories = await prisma.category.findMany()

  for (const category of categories) {
    console.log(`📦 Fetching pictograms for ${category.displayName}...`)

    const keywords = CATEGORY_KEYWORDS[category.name as keyof typeof CATEGORY_KEYWORDS]
    
    if (!keywords) {
      console.log(`⚠️  No keywords found for ${category.name}`)
      continue
    }

    try {
      // Fetch pictograms from ARASAAC
      const pictograms = await searchMultiplePictograms(keywords, 3)
      
      console.log(`  Found ${pictograms.length} pictograms`)

      // Save pictograms to database
      for (let i = 0; i < pictograms.length; i++) {
        const pictogram = pictograms[i]
        
        // Check if pictogram already exists
        const existing = await prisma.image.findFirst({
          where: {
            categoryId: category.id,
            imageUrl: pictogram.imageUrl,
          },
        })

        if (!existing) {
          await prisma.image.create({
            data: {
              name: pictogram.keywords[0] || `Pictograma ${pictogram.id}`,
              imageUrl: pictogram.imageUrl,
              categoryId: category.id,
              isCustom: false,
              order: i,
              isActive: true,
            },
          })
          console.log(`  ✅ Added: ${pictogram.keywords[0]}`)
        }
      }
    } catch (error) {
      console.error(`  ❌ Error fetching pictograms for ${category.name}:`, error)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seed...\n')

    await seedCategories()
    console.log('\n')
    await seedPictograms()

    console.log('\n✨ Database seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
