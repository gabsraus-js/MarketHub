import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getMarketplaces(req: Request, res: Response) {
  try {
    const { search, category } = req.query

    const marketplaces = await prisma.marketplace.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search as string } },
            { description: { contains: search as string } },
          ],
        }),
        ...(category && { category: category as string }),
      },
      include: { _count: { select: { members: true } } },
      orderBy: { memberCount: 'desc' },
    })

    res.json(marketplaces)
  } catch {
    res.status(500).json({ error: 'Failed to fetch marketplaces' })
  }
}

export async function getMarketplace(req: Request, res: Response) {
  try {
    const marketplace = await prisma.marketplace.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { members: true } } },
    })

    if (!marketplace) return res.status(404).json({ error: 'Marketplace not found' })

    res.json(marketplace)
  } catch {
    res.status(500).json({ error: 'Failed to fetch marketplace' })
  }
}

export async function joinMarketplace(req: Request, res: Response) {
  try {
    const { userId } = req.body

    const membership = await prisma.marketplaceMember.create({
      data: { userId, marketplaceId: req.params.id },
    })

    await prisma.marketplace.update({
      where: { id: req.params.id },
      data: { memberCount: { increment: 1 } },
    })

    res.status(201).json(membership)
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Already a member' })
    }
    res.status(500).json({ error: 'Failed to join marketplace' })
  }
}

export async function leaveMarketplace(req: Request, res: Response) {
  try {
    const { userId } = req.body

    await prisma.marketplaceMember.delete({
      where: {
        userId_marketplaceId: { userId, marketplaceId: req.params.id },
      },
    })

    await prisma.marketplace.update({
      where: { id: req.params.id },
      data: { memberCount: { decrement: 1 } },
    })

    res.json({ message: 'Left marketplace successfully' })
  } catch {
    res.status(500).json({ error: 'Failed to leave marketplace' })
  }
}
