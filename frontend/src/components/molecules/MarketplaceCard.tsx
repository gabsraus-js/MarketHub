'use client'

import { useState } from 'react'
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
  'E-commerce': 'primary',
  Freelance: 'success',
  'Digital Products': 'purple',
  Design: 'warning',
  Services: 'success',
  Startup: 'default',
}

const categoryColor: Record<string, string> = {
  'E-commerce': 'from-blue-100 to-indigo-100 text-indigo-600',
  Freelance: 'from-emerald-100 to-teal-100 text-emerald-700',
  'Digital Products': 'from-violet-100 to-purple-100 text-violet-700',
  Design: 'from-amber-100 to-orange-100 text-amber-700',
  Services: 'from-sky-100 to-cyan-100 text-sky-700',
  Startup: 'from-slate-100 to-gray-100 text-slate-600',
}

export function MarketplaceCard({ marketplace, isJoined = false, onJoin, onLeave }: Props) {
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

  const iconColors = categoryColor[marketplace.category] ?? 'from-slate-100 to-gray-100 text-slate-600'

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconColors} flex items-center justify-center text-lg font-bold shrink-0`}
        >
          {marketplace.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">{marketplace.name}</h3>
            {joined && (
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                ✓ Joined
              </span>
            )}
          </div>
          <Badge variant={categoryVariant[marketplace.category] ?? 'default'} className="mt-1">
            {marketplace.category}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{marketplace.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {marketplace.memberCount.toLocaleString()} members
        </span>
        <Button variant={joined ? 'secondary' : 'primary'} size="sm" loading={loading} onClick={toggle}>
          {joined ? 'Leave' : 'Join'}
        </Button>
      </div>
    </div>
  )
}
