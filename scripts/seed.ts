
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin user for testing
  const hashedPassword = await bcrypt.hash('johndoe123', 10)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Admin Teste',
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('👤 Created test user:', testUser.email)

  // AAC Categories with their respective data
  const categories = [
    {
      name: 'GENERAL',
      displayName: 'Geral',
      icon: 'MessageCircle',
      color: 'bg-blue-100',
      order: 1,
      imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg'
    },
    {
      name: 'FOOD',
      displayName: 'Comida',
      icon: 'Apple',
      color: 'bg-red-100',
      order: 2,
      imageUrl: 'https://static.abacusaicdn.net/images/32c266a8-36d8-48f4-a302-e269a2c8aebb.jpg'
    },
    {
      name: 'BEVERAGES',
      displayName: 'Bebidas',
      icon: 'Coffee',
      color: 'bg-orange-100',
      order: 3,
      imageUrl: 'https://static.abacusaicdn.net/images/f49dda14-2849-4833-bc70-f182a2559105.jpg'
    },
    {
      name: 'FEELINGS',
      displayName: 'Sentimentos',
      icon: 'Smile',
      color: 'bg-yellow-100',
      order: 4,
      imageUrl: 'https://static.abacusaicdn.net/images/7cbccaf6-df0b-4d54-96b5-c44d7f7d1d0f.jpg'
    },
    {
      name: 'HEALTH',
      displayName: 'Saúde',
      icon: 'Heart',
      color: 'bg-pink-100',
      order: 5,
      imageUrl: 'https://static.abacusaicdn.net/images/df206d18-9ee3-4284-9ad3-4de13d6d3c2b.jpg'
    },
    {
      name: 'OBJECTS',
      displayName: 'Objetos',
      icon: 'Box',
      color: 'bg-purple-100',
      order: 6,
      imageUrl: 'https://static.abacusaicdn.net/images/d0f42644-693b-4748-a673-babb87ee5dec.jpg'
    },
    {
      name: 'PLACES',
      displayName: 'Lugares',
      icon: 'MapPin',
      color: 'bg-green-100',
      order: 7,
      imageUrl: 'https://static.abacusaicdn.net/images/7ce2371d-c1d2-4809-aa04-dd65235ca140.jpg'
    },
    {
      name: 'CLOTHES',
      displayName: 'Roupas',
      icon: 'Shirt',
      color: 'bg-indigo-100',
      order: 8,
      imageUrl: 'https://static.abacusaicdn.net/images/0ae2ce70-4151-438d-8520-fd8316a9be1e.jpg'
    },
    {
      name: 'COLORS',
      displayName: 'Cores',
      icon: 'Palette',
      color: 'bg-cyan-100',
      order: 9,
      imageUrl: 'https://static.abacusaicdn.net/images/51f395a1-4c54-471a-b39e-dec1ee6b50f9.jpg'
    },
    {
      name: 'NUMBERS',
      displayName: 'Números',
      icon: 'Hash',
      color: 'bg-emerald-100',
      order: 10,
      imageUrl: 'https://static.abacusaicdn.net/images/b7a575a2-26a7-4793-874e-7332c44a3539.png'
    },
    {
      name: 'ALPHABET',
      displayName: 'Alfabeto',
      icon: 'Type',
      color: 'bg-teal-100',
      order: 11,
      imageUrl: 'https://static.abacusaicdn.net/images/5a71bc30-aa40-48b5-ab1f-f2fc75b76b93.png'
    },
    {
      name: 'SHAPES',
      displayName: 'Formas',
      icon: 'Square',
      color: 'bg-slate-100',
      order: 12,
      imageUrl: 'https://static.abacusaicdn.net/images/7a6c434a-8915-4cff-8778-45f34a26722b.jpg'
    },
    {
      name: 'FUN',
      displayName: 'Diversão',
      icon: 'Gamepad2',
      color: 'bg-rose-100',
      order: 13,
      imageUrl: 'https://static.abacusaicdn.net/images/d4969c08-f874-440c-b2a8-82159d7b0737.jpg'
    }
  ]

  // Create categories
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        displayName: categoryData.displayName,
        icon: categoryData.icon,
        color: categoryData.color,
        order: categoryData.order
      }
    })

    console.log(`📁 Created category: ${category.displayName}`)

    // Create a representative image for each category using the generated images
    const existingImage = await prisma.image.findFirst({
      where: {
        name: `${categoryData.displayName} - Principal`,
        categoryId: category.id
      }
    })

    if (!existingImage) {
      await prisma.image.create({
        data: {
          name: `${categoryData.displayName} - Principal`,
          imageUrl: categoryData.imageUrl,
          categoryId: category.id,
          order: 1,
          isCustom: false
        }
      })
    }
  }

  // Add some basic default images for GENERAL category
  const generalCategory = await prisma.category.findUnique({
    where: { name: 'GENERAL' }
  })

  if (generalCategory) {
    const generalImages = [
      { name: 'Eu', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Quero', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Não Quero', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Mais', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Acabou', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Ajuda', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Por Favor', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' },
      { name: 'Obrigado', imageUrl: 'https://static.abacusaicdn.net/images/4a67afaa-9286-4eb3-9135-81a1b067177e.jpg' }
    ]

    for (let i = 0; i < generalImages.length; i++) {
      const existingGeneralImage = await prisma.image.findFirst({
        where: {
          name: generalImages[i].name,
          categoryId: generalCategory.id
        }
      })

      if (!existingGeneralImage) {
        await prisma.image.create({
          data: {
            name: generalImages[i].name,
            imageUrl: generalImages[i].imageUrl,
            categoryId: generalCategory.id,
            order: i + 2, // Start from 2 since category image is order 1
            isCustom: false
          }
        })
      }
    }

    console.log('✨ Added basic communication words to GENERAL category')
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
