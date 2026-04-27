'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { Marketplace } from '@/types'

interface Props {
  marketplace: Marketplace
  isJoined?: boolean
  onJoin?: (id: string) => Promise<void>
  onLeave?: (id: string) => Promise<void>
}

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'purple'

const categoryVariant: Record<string, BadgeVariant> = {
  'E-commerce':      'primary',
  Freelance:         'success',
  'Digital Products':'purple',
  Design:            'warning',
  Services:          'success',
  Startup:           'default',
}

// decorative icon gradients — intentional fixed hues, dark: expected
const categoryColor: Record<string, string> = {
  'E-commerce':      'from-blue-100 to-indigo-100 text-indigo-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-indigo-400',
  Freelance:         'from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-400',
  'Digital Products':'from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-400',
  Design:            'from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400',
  Services:          'from-sky-100 to-cyan-100 text-sky-700 dark:from-sky-900/30 dark:to-cyan-900/30 dark:text-sky-400',
  Startup:           'from-card-raised to-card-raised text-fg-muted',
}

export function MarketplaceCard({ marketplace, isJoined = false, onJoin, onLeave }: Props) {
  const t = useTranslations('common')
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(isJoined)

  const toggle = async () => {
    setLoading(true)
    try {
      if (joined) {
        await onLeave?.(marketplace.id)
        setJoined(false)
      } else {
        await onJoin?.(marketplace.id)
        setJoined(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const iconColors = categoryColor[marketplace.category] ?? 'from-card-raised to-card-raised text-fg-muted'

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="group relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft hover:shadow-soft-lg transition-shadow duration-300 neuro:bg-background neuro:p-0 neuro:shadow-neuro neuro:hover:shadow-neuro"
    >
      <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden flex flex-col gap-4 p-5 h-full neuro:bg-transparent neuro:backdrop-blur-none neuro:rounded-2xl">

        {/* top shimmer line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none neuro:hidden" />

        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconColors} flex items-center justify-center text-lg font-bold shrink-0`}
          >
            {marketplace.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-fg text-sm leading-tight truncate">{marketplace.name}</h3>
              {joined && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full shrink-0">
                  ✓ {t('joined')}
                </span>
              )}
            </div>
            <Badge variant={categoryVariant[marketplace.category] ?? 'default'} className="mt-1">
              {marketplace.category}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-fg-muted leading-relaxed line-clamp-2 flex-1">{marketplace.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-fg-subtle flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('members', { count: marketplace.memberCount.toLocaleString() })}
          </span>
          <Button variant={joined ? 'secondary' : 'primary'} size="sm" loading={loading} onClick={toggle}>
            {joined ? t('leave') : t('join')}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
