import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const marketplacesData = [
  {
    id: 'shopify-partners',
    name: 'Shopify Partners',
    description: 'Join the Shopify ecosystem and build apps, themes, or provide services to merchants worldwide.',
    category: 'E-commerce',
    website: 'https://partners.shopify.com',
    memberCount: 12400,
  },
  {
    id: 'upwork',
    name: 'Upwork',
    description: "The world's leading freelancing platform connecting businesses with independent talent globally.",
    category: 'Freelance',
    website: 'https://upwork.com',
    memberCount: 18200,
  },
  {
    id: 'etsy-sellers',
    name: 'Etsy Sellers',
    description: 'A global marketplace for unique and creative goods. Perfect for handmade, vintage, and craft items.',
    category: 'E-commerce',
    website: 'https://etsy.com',
    memberCount: 9800,
  },
  {
    id: 'fiverr-pro',
    name: 'Fiverr Pro',
    description: 'Premium freelance marketplace where top talent delivers exceptional digital services on demand.',
    category: 'Services',
    website: 'https://fiverr.com',
    memberCount: 14600,
  },
  {
    id: 'gumroad',
    name: 'Gumroad',
    description: 'Sell your creations directly to your audience — software, ebooks, music, design assets, and more.',
    category: 'Digital Products',
    website: 'https://gumroad.com',
    memberCount: 7300,
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    description: "The world's leading community for creatives to share, grow, and get hired.",
    category: 'Design',
    website: 'https://dribbble.com',
    memberCount: 21000,
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    description: 'Discover the best new products in tech. A community for makers and early adopters to launch products.',
    category: 'Startup',
    website: 'https://producthunt.com',
    memberCount: 8900,
  },
  {
    id: 'amazon-sellers',
    name: 'Amazon Sellers',
    description: "Sell your products to hundreds of millions of customers on the world's largest online marketplace.",
    category: 'E-commerce',
    website: 'https://sellercentral.amazon.com',
    memberCount: 32000,
  },
  {
    id: 'toptal',
    name: 'Toptal',
    description: 'Exclusive network of the top 3% of freelance software developers, designers, and finance experts.',
    category: 'Freelance',
    website: 'https://toptal.com',
    memberCount: 5600,
  },
  {
    id: 'redbubble',
    name: 'Redbubble',
    description: 'Sell your original art printed on high-quality products: stickers, apparel, phone cases, and more.',
    category: 'Design',
    website: 'https://redbubble.com',
    memberCount: 11200,
  },
]

async function main() {
  console.log('Seeding database...')

  await prisma.marketplaceMember.deleteMany()
  await prisma.marketplace.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Alex Johnson',
      bio: 'Marketplace enthusiast and digital entrepreneur.',
    },
  })

  for (const marketplace of marketplacesData) {
    await prisma.marketplace.create({ data: marketplace })
  }

  console.log(`Seeded ${marketplacesData.length} marketplaces and 1 demo user.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
