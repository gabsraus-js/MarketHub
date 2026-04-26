'use client'

import { useEffect, useState, useCallback } from 'react'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { MarketplaceGrid } from '@/components/organisms/MarketplaceGrid'
import { SearchBar } from '@/components/molecules/SearchBar'
import { Badge } from '@/components/atoms/Badge'
import { api } from '@/lib/api'
import { mockMarketplaces } from '@/lib/mock-data'
import type { Marketplace } from '@/types'

const DEMO_USER_ID = 'demo-user'
const CATEGORIES = ['All', 'E-commerce', 'Freelance', 'Digital Products', 'Design', 'Services', 'Startup']

export default function MarketplacesPage() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [all, joined] = await Promise.all([
        api.marketplaces.list({
          search: search || undefined,
          category: category !== 'All' ? category : undefined,
        }),
        api.users.marketplaces(DEMO_USER_ID),
      ])
      setMarketplaces(all)
      setJoinedIds(new Set(joined.map(m => m.id)))
    } catch {
      const filtered = mockMarketplaces.filter(m => {
        const matchesSearch =
          !search ||
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'All' || m.category === category
        return matchesSearch && matchesCategory
      })
      setMarketplaces(filtered)
    } finally {
      setLoading(false)
    }
  }, [search, category])

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

  return (
    <DefaultLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-slate-900">Marketplaces</h1>
        <p className="text-slate-400 mt-1 text-base">Browse and join platforms that match your goals</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} className="sm:max-w-xs" />
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                category === cat
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-soft'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-slate-400">
          {loading ? 'Loading...' : `${marketplaces.length} marketplace${marketplaces.length !== 1 ? 's' : ''}`}
        </span>
        {joinedIds.size > 0 && (
          <Badge variant="success">{joinedIds.size} joined</Badge>
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
