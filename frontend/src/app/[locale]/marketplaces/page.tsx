'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { MarketplaceGrid } from '@/components/organisms/MarketplaceGrid'
import { SearchBar } from '@/components/molecules/SearchBar'
import { Badge } from '@/components/atoms/Badge'
import { api } from '@/lib/api'
import { mockMarketplaces } from '@/lib/mock-data'
import type { Marketplace } from '@/types'

const DEMO_USER_ID = 'demo-user'

export default function MarketplacesPage() {
  const t = useTranslations('marketplaces')

  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [all, joined] = await Promise.all([
        api.marketplaces.list({ search: search || undefined }),
        api.users.marketplaces(DEMO_USER_ID),
      ])
      setMarketplaces(all)
      setJoinedIds(new Set(joined.map(m => m.id)))
    } catch {
      const filtered = mockMarketplaces.filter(m =>
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      )
      setMarketplaces(filtered)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [load])

  const handleJoin = async (id: string) => {
    try { await api.marketplaces.join(id, DEMO_USER_ID) } catch { /* offline */ }
    setJoinedIds(prev => new Set(Array.from(prev).concat(id)))
  }

  const handleLeave = async (id: string) => {
    try { await api.marketplaces.leave(id, DEMO_USER_ID) } catch { /* offline */ }
    setJoinedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const resultsLabel = loading
    ? t('loadingResults')
    : search
      ? (marketplaces.length === 1
          ? t('resultSingle', { query: search })
          : t('resultPlural', { count: marketplaces.length, query: search }))
      : (marketplaces.length === 1
          ? t('totalSingle')
          : t('totalPlural', { count: marketplaces.length }))

  return (
    <DefaultLayout>
      {/* ── Hero ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute -top-10 left-1/3 w-80 h-80 bg-primary-subtle rounded-full blur-3xl opacity-60 dark:opacity-30" />
          <div className="absolute top-6 right-1/4 w-64 h-64 bg-violet-100 dark:bg-violet-900/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-40 dark:opacity-20" />
        </div>

        <div className="relative text-center max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-fg-muted mb-6 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {loading ? '—' : t('platforms', { count: marketplaces.length })}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-fg tracking-tight leading-[1.1] mb-3">
            {t('title')}{' '}
            <span className="gradient-text">{t('titleHighlight')}</span>
          </h1>
          <p className="text-base text-fg-muted mb-8">{t('subtitle')}</p>

          <div className="max-w-md mx-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t('searchPlaceholder')}
            />
          </div>
        </div>
      </section>

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between mb-6 px-0.5">
        <span className="text-sm text-fg-subtle">{resultsLabel}</span>
        {joinedIds.size > 0 && (
          <Badge variant="success">{t('joinedBadge', { count: joinedIds.size })}</Badge>
        )}
      </div>

      <MarketplaceGrid
        marketplaces={marketplaces}
        joinedIds={joinedIds}
        onJoin={handleJoin}
        onLeave={handleLeave}
        loading={loading}
      />
    </DefaultLayout>
  )
}
