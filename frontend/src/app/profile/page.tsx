'use client'

import { useEffect, useState } from 'react'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { ProfileHeader } from '@/components/organisms/ProfileHeader'
import { MarketplaceGrid } from '@/components/organisms/MarketplaceGrid'
import { StatCard } from '@/components/molecules/StatCard'
import { api } from '@/lib/api'
import { mockUser } from '@/lib/mock-data'
import type { User, Marketplace } from '@/types'

const DEMO_USER_ID = 'demo-user'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [userData, joined] = await Promise.all([
          api.users.get(DEMO_USER_ID),
          api.users.marketplaces(DEMO_USER_ID),
        ])
        setUser(userData)
        setMarketplaces(joined)
      } catch {
        setUser(mockUser)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUpdate = async (data: Partial<User>) => {
    if (!user) return
    try {
      const updated = await api.users.update(user.id, data)
      setUser(updated)
    } catch {
      setUser(prev => prev ? { ...prev, ...data } : prev)
    }
  }

  const handleLeave = async (id: string) => {
    if (!user) return
    try { await api.marketplaces.leave(id, user.id) } catch { /* offline */ }
    setMarketplaces(prev => prev.filter(m => m.id !== id))
    setUser(prev => prev && prev._count ? { ...prev, _count: { memberships: prev._count.memberships - 1 } } : prev)
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8 animate-pulse">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-100 rounded-lg w-48" />
                <div className="h-4 bg-slate-100 rounded-lg w-64" />
                <div className="h-3 bg-slate-100 rounded-lg w-80 max-w-full" />
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="text-center py-24">
          <p className="text-slate-400 text-sm">Could not load profile. Is the backend running?</p>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="py-8 space-y-6">
        <ProfileHeader user={user} onUpdate={handleUpdate} />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            label="Joined"
            value={marketplaces.length}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            {marketplaces.length > 0 ? 'Your Marketplaces' : 'No marketplaces yet'}
          </h2>
          {marketplaces.length > 0 ? (
            <MarketplaceGrid
              marketplaces={marketplaces}
              joinedIds={new Set(marketplaces.map(m => m.id))}
              onLeave={handleLeave}
            />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm mb-4">You haven&apos;t joined any marketplaces yet</p>
              <a href="/marketplaces" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Browse marketplaces →
              </a>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
