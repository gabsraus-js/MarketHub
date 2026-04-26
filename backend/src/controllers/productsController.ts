import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

type ListingInput = { marketplaceId: string; price: number }

const productInclude = {
  listings: {
    include: { marketplace: true },
    orderBy: { marketplace: { name: 'asc' as const } },
  },
  images: {
    orderBy: { order: 'asc' as const },
  },
}

export async function getProducts(req: Request, res: Response) {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    const products = await prisma.product.findMany({
      where: { userId: userId as string },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    })

    res.json(products)
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { userId, name, description, listings, imageUrls } = req.body as {
      userId: string
      name: string
      description?: string
      listings: ListingInput[]
      imageUrls?: string[]
    }

    const product = await prisma.product.create({
      data: {
        userId,
        name,
        description: description || null,
        listings: {
          create: listings.map(l => ({ marketplaceId: l.marketplaceId, price: l.price })),
        },
        images: {
          create: (imageUrls ?? []).map((url, order) => ({ url, order })),
        },
      },
      include: productInclude,
    })

    res.status(201).json(product)
  } catch {
    res.status(500).json({ error: 'Failed to create product' })
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { name, description, listings, imageUrls } = req.body as {
      name: string
      description?: string
      listings: ListingInput[]
      imageUrls?: string[]
    }

    await prisma.productListing.deleteMany({ where: { productId: req.params.id } })
    await prisma.productImage.deleteMany({ where: { productId: req.params.id } })

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description: description || null,
        listings: {
          create: listings.map(l => ({ marketplaceId: l.marketplaceId, price: l.price })),
        },
        images: {
          create: (imageUrls ?? []).map((url, order) => ({ url, order })),
        },
      },
      include: productInclude,
    })

    res.json(product)
  } catch {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ message: 'Product deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
