import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getUser(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { memberships: true } } },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { name, bio, avatar } = req.body

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, bio, avatar },
      include: { _count: { select: { memberships: true } } },
    })

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export async function getUserMarketplaces(req: Request, res: Response) {
  try {
    const memberships = await prisma.marketplaceMember.findMany({
      where: { userId: req.params.id },
      include: { marketplace: true },
      orderBy: { joinedAt: 'desc' },
    })

    res.json(memberships.map(m => ({ ...m.marketplace, joinedAt: m.joinedAt })))
  } catch {
    res.status(500).json({ error: 'Failed to fetch user marketplaces' })
  }
}
