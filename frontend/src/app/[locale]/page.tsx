'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { api } from '@/lib/api'
import { mockUser, mockMarketplaces } from '@/lib/mock-data'
import type { User, Marketplace, Product } from '@/types'

const DEMO_USER_ID = 'demo-user'

const LEVELS = [
  { level: 1,  name: 'Newcomer',  min: 0    },
  { level: 2,  name: 'Explorer',  min: 200  },
  { level: 3,  name: 'Merchant',  min: 500  },
  { level: 4,  name: 'Trader',    min: 900  },
  { level: 5,  name: 'Hustler',   min: 1500 },
  { level: 6,  name: 'Veteran',   min: 2200 },
  { level: 7,  name: 'Expert',    min: 3000 },
  { level: 8,  name: 'Master',    min: 4000 },
  { level: 9,  name: 'Elite',     min: 5200 },
  { level: 10, name: 'Legend',    min: 6500 },
]

function getLevelInfo(memberships: number, products: number, totalListings: number) {
  const xp = memberships * 100 + products * 150 + totalListings * 50
  let idx = 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { idx = i; break }
  }
  const current = LEVELS[idx]
  const next = LEVELS[idx + 1] ?? null
  const progressXP = xp - current.min
  const rangeXP = next ? next.min - current.min : 1
  const progress = next ? Math.min(Math.round((progressXP / rangeXP) * 100), 100) : 100
  return { current, next, xp, progressXP, rangeXP, progress }
}

type GreetingKey = 'greetMorning' | 'greetAfternoon' | 'greetEvening' | 'greetNight'

function getGreetingKey(): GreetingKey {
  const h = new Date().getHours()
  if (h < 12) return 'greetMorning'
  if (h < 17) return 'greetAfternoon'
  if (h < 21) return 'greetEvening'
  return 'greetNight'
}

const categoryColor: Record<string, string> = {
  'E-commerce':       'from-blue-100 to-indigo-100 text-indigo-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-indigo-400',
  Freelance:          'from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-400',
  'Digital Products': 'from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-400',
  Design:             'from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400',
  Services:           'from-sky-100 to-cyan-100 text-sky-700 dark:from-sky-900/30 dark:to-cyan-900/30 dark:text-sky-400',
  Startup:            'from-card-raised to-card-raised text-fg-muted',
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tc = useTranslations('common')
  const locale = useLocale()

  const [user, setUser] = useState<User | null>(null)
  const [joinedMarketplaces, setJoinedMarketplaces] = useState<Marketplace[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [userData, joined, prods] = await Promise.all([
          api.users.get(DEMO_USER_ID),
          api.users.marketplaces(DEMO_USER_ID),
          api.products.list(DEMO_USER_ID),
        ])
        setUser(userData)
        setJoinedMarketplaces(joined)
        setProducts(prods)
      } catch {
        setUser(mockUser)
        setJoinedMarketplaces(mockMarketplaces.slice(0, 3))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalListings = products.reduce((sum, p) => sum + p.listings.length, 0)
  const coveredMarkets = new Set(products.flatMap(p => p.listings.map(l => l.marketplaceId))).size
  const levelInfo = getLevelInfo(joinedMarketplaces.length, products.length, totalListings)
  const today = new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  const kpis = [
    {
      label: t('kpi.marketplaces'),
      value: loading ? '—' : joinedMarketplaces.length,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      href: '/marketplaces',
    },
    {
      label: t('kpi.products'),
      value: loading ? '—' : products.length,
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      iconColor: 'text-amber-600 dark:text-amber-400',
      href: '/products',
    },
    {
      label: t('kpi.totalListings'),
      value: loading ? '—' : totalListings,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      href: '/products',
    },
    {
      label: t('kpi.marketsCovered'),
      value: loading ? '—' : coveredMarkets,
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      href: '/products',
    },
  ]

  const quickActions = [
    {
      label: t('actions.browseLabel'),
      desc: t('actions.browseDesc'),
      href: '/marketplaces',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      label: t('actions.addLabel'),
      desc: t('actions.addDesc'),
      href: '/products',
      icon: 'M12 4v16m8-8H4',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: t('actions.viewProfileLabel'),
      desc: t('actions.viewProfileDesc'),
      href: '/profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    },
  ]

  return (
    <DefaultLayout>
      {/* ── Greeting hero ── */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute -top-8 left-1/3 w-72 h-72 bg-primary-subtle rounded-full blur-3xl opacity-60 dark:opacity-25" />
          <div className="absolute top-4 right-1/4 w-60 h-60 bg-violet-100 dark:bg-violet-900/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm text-fg-muted font-medium mb-1">{today}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-fg tracking-tight">
              {t(getGreetingKey())},{' '}
              <span className="gradient-text">{loading ? '…' : (user?.name.split(' ')[0] ?? 'there')}</span>
            </h1>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-xl px-4 py-2.5 shadow-soft shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {levelInfo.current.level}
              </div>
              <div>
                <p className="text-xs font-semibold text-fg leading-tight">{levelInfo.current.name}</p>
                <p className="text-[10px] text-fg-muted">{levelInfo.xp.toLocaleString()} XP</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => (
          <Link key={kpi.label} href={kpi.href} className="group">
            <div className="relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer h-full">
              <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden p-5 h-full">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-primary-subtle flex items-center justify-center shrink-0 ${kpi.iconColor}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-fg">{kpi.value}</p>
                <p className="text-xs text-fg-muted mt-0.5 font-medium">{kpi.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Level + Quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft">
          <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden p-5 h-full">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-fg">{t('levelProgress')}</p>
            <Link href="/profile" className="text-xs text-primary font-medium hover:text-primary-hover transition-colors">
              {tc('viewProfile')}
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold shrink-0">
              {levelInfo.current.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-fg">{levelInfo.current.name}</span>
                <span className="text-xs text-fg-muted">{levelInfo.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          </div>
          {levelInfo.next ? (
            <p className="text-xs text-fg-muted">
              {t('xpNeeded', { xp: (levelInfo.rangeXP - levelInfo.progressXP).toLocaleString(), level: levelInfo.next.name })}
            </p>
          ) : (
            <p className="text-xs text-primary font-semibold">{t('maxLevel')}</p>
          )}
          </div>
        </div>

        <div className="relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft">
          <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden p-5 h-full">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
          <p className="text-sm font-semibold text-fg mb-4">{t('quickActions')}</p>
          <div className="space-y-2">
            {quickActions.map(action => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">{action.label}</p>
                    <p className="text-xs text-fg-muted">{action.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-fg-subtle group-hover:text-fg-muted transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* ── Joined marketplaces ── */}
      {!loading && joinedMarketplaces.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-fg">{t('joinedMarketplaces')}</h2>
            <Link href="/marketplaces" className="text-xs text-primary font-medium hover:text-primary-hover transition-colors">
              {tc('browseAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {joinedMarketplaces.slice(0, 6).map(m => {
              const colors = categoryColor[m.category] ?? 'from-card-raised to-card-raised text-fg-muted'
              return (
                <div key={m.id} className="relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft">
                  <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden p-4 flex items-center gap-3">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors} flex items-center justify-center text-sm font-bold shrink-0`}>
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-fg truncate">{m.name}</p>
                      <p className="text-xs text-fg-muted">{m.category}</p>
                    </div>
                    <Badge variant="success" className="shrink-0">{tc('joined')}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && joinedMarketplaces.length === 0 && products.length === 0 && (
        <Card variant="glass" padding="none" className="text-center py-16 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-fg-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-fg mb-1">{tc('noDataTitle')}</h3>
          <p className="text-sm text-fg-muted mb-6">{tc('noDataDesc')}</p>
          <div className="flex items-center justify-center gap-3">
            <Button href="/marketplaces" size="sm">{tc('browseMarketplaces')}</Button>
            <Button href="/products" variant="secondary" size="sm">{tc('addProduct')}</Button>
          </div>
        </Card>
      )}
    </DefaultLayout>
  )
}
