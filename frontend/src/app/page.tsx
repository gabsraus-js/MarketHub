'use client'

import { useEffect, useState } from 'react'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { HeroSection } from '@/components/organisms/HeroSection'
import { MarketplaceGrid } from '@/components/organisms/MarketplaceGrid'
import { StatCard } from '@/components/molecules/StatCard'
import { api } from '@/lib/api'
import { mockMarketplaces } from '@/lib/mock-data'
import type { Marketplace } from '@/types'

const DEMO_USER_ID = 'demo-user'

export default function HomePage() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [all, joined] = await Promise.all([
          api.marketplaces.list(),
          api.users.marketplaces(DEMO_USER_ID),
        ])
        setMarketplaces(all.slice(0, 6))
        setJoinedIds(new Set(joined.map(m => m.id)))
      } catch {
        setMarketplaces(mockMarketplaces.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleJoin = async (id: string) => {
    try {
      await api.marketplaces.join(id, DEMO_USER_ID)
    } catch { /* offline */ }
    setJoinedIds(prev => new Set(Array.from(prev).concat(id)))
  }

  const handleLeave = async (id: string) => {
    try {
      await api.marketplaces.leave(id, DEMO_USER_ID)
    } catch { /* offline */ }
    setJoinedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  return (
    <DefaultLayout>
      <HeroSection />

      <section className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Marketplaces"
          value={marketplaces.length || '—'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          label="Joined"
          value={joinedIds.size}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Categories"
          value="8"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
        <StatCard
          label="Members"
          value="50k+"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Marketplaces</h2>
            <p className="text-sm text-slate-400 mt-0.5">Most popular platforms to get started</p>
          </div>
          <a href="/marketplaces" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
            View all →
          </a>
        </div>
        <MarketplaceGrid
          marketplaces={marketplaces}
          joinedIds={joinedIds}
          onJoin={handleJoin}
          onLeave={handleLeave}
          loading={loading}
        />
      </section>
    </DefaultLayout>
  )
}
