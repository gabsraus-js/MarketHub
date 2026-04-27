'use client'

import { motion, type Variants } from 'motion/react'
import { Card } from '@/components/atoms/Card'
import { MarketplaceCard } from '@/components/molecules/MarketplaceCard'
import type { Marketplace } from '@/types'

interface Props {
  marketplaces: Marketplace[]
  joinedIds?: Set<string>
  onJoin?: (id: string) => Promise<void>
  onLeave?: (id: string) => Promise<void>
  loading?: boolean
}

function SkeletonCard() {
  return (
    <Card variant="glass" padding="md" className="animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-border-subtle shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border-subtle rounded-lg w-3/4" />
          <div className="h-3 bg-border-subtle rounded-full w-20" />
        </div>
      </div>
      <div className="space-y-2 mb-5">
        <div className="h-3 bg-border-subtle rounded-lg" />
        <div className="h-3 bg-border-subtle rounded-lg w-4/5" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-border-subtle rounded-lg w-24" />
        <div className="h-8 bg-border-subtle rounded-xl w-16" />
      </div>
    </Card>
  )
}

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

export function MarketplaceGrid({ marketplaces, joinedIds = new Set(), onJoin, onLeave, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (marketplaces.length === 0) {
    return (
      <Card variant="glass" padding="none" className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-fg-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-fg font-semibold mb-1">No marketplaces found</p>
        <p className="text-fg-subtle text-sm">Try a different search term</p>
      </Card>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {marketplaces.map(marketplace => (
        <motion.div key={marketplace.id} variants={item}>
          <MarketplaceCard
            marketplace={marketplace}
            isJoined={joinedIds.has(marketplace.id)}
            onJoin={onJoin}
            onLeave={onLeave}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
