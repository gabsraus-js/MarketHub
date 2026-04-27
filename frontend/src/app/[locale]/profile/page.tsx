'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { ProfileHeader } from '@/components/organisms/ProfileHeader'
import { Card } from '@/components/atoms/Card'
import { api } from '@/lib/api'
import { mockUser } from '@/lib/mock-data'
import type { User, Product } from '@/types'

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

function computeXP(memberships: number, products: number, totalListings: number) {
  return memberships * 100 + products * 150 + totalListings * 50
}

function getLevelInfo(xp: number) {
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

interface AchievementStats {
  memberships: number
  products: number
  totalListings: number
  coveredMarkets: number
  daysActive: number
}

interface AchievementDef {
  id: string
  title: string
  description: string
  xp: number
  color: string
  iconPath: string
  check: (s: AchievementStats) => boolean
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_marketplace',
    title: 'First Steps',
    description: 'Join your first marketplace',
    xp: 100,
    color: 'from-indigo-400 to-blue-500',
    iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    check: s => s.memberships >= 1,
  },
  {
    id: 'networker',
    title: 'Networker',
    description: 'Join 3 different marketplaces',
    xp: 250,
    color: 'from-emerald-400 to-teal-500',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    check: s => s.memberships >= 3,
  },
  {
    id: 'market_leader',
    title: 'Market Leader',
    description: 'Join 5 or more marketplaces',
    xp: 500,
    color: 'from-violet-400 to-purple-600',
    iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    check: s => s.memberships >= 5,
  },
  {
    id: 'first_product',
    title: 'First Product',
    description: 'Create your first product',
    xp: 150,
    color: 'from-amber-400 to-yellow-500',
    iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    check: s => s.products >= 1,
  },
  {
    id: 'catalog',
    title: 'Catalog Builder',
    description: 'Create 3 or more products',
    xp: 400,
    color: 'from-orange-400 to-red-500',
    iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    check: s => s.products >= 3,
  },
  {
    id: 'price_setter',
    title: 'Price Setter',
    description: 'List a product on a marketplace',
    xp: 200,
    color: 'from-rose-400 to-pink-500',
    iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    check: s => s.totalListings >= 1,
  },
  {
    id: 'multi_market',
    title: 'Multi-Market',
    description: 'Cover 3 different marketplaces with listings',
    xp: 450,
    color: 'from-cyan-400 to-sky-500',
    iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    check: s => s.coveredMarkets >= 3,
  },
  {
    id: 'day_one',
    title: 'Day One',
    description: 'Active member for 30+ days',
    xp: 300,
    color: 'from-yellow-400 to-amber-500',
    iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    check: s => s.daysActive >= 30,
  },
]

function LevelCard({ xp, progress, current, next, progressXP, rangeXP }: ReturnType<typeof getLevelInfo>) {
  const t = useTranslations('profile')
  const isMaxLevel = !next

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-soft">
            {current.level}
          </div>
          <div>
            <p className="text-sm font-bold text-fg">{current.name}</p>
            <p className="text-xs text-fg-muted">{t('levelCard.level', { level: current.level })}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-fg">{xp.toLocaleString()} XP</p>
          {!isMaxLevel && (
            <p className="text-xs text-fg-muted">{t('levelCard.xpToLevel', { xp: (rangeXP - progressXP).toLocaleString(), level: next!.level })}</p>
          )}
        </div>
      </div>

      <div className="h-2.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isMaxLevel ? (
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-fg-subtle">{current.name}</span>
          <span className="text-xs text-fg-subtle">{next!.name} · {next!.min.toLocaleString()} XP</span>
        </div>
      ) : (
        <p className="text-xs text-primary font-medium mt-2 text-center">{t('levelCard.maxLevel')}</p>
      )}
    </Card>
  )
}

function AchievementCard({ achievement, unlocked }: { achievement: AchievementDef; unlocked: boolean }) {
  const t = useTranslations('profile')

  return (
    <Card
      variant="glass"
      padding="md"
      className={`flex flex-col gap-3 transition-all duration-200 ${
        unlocked ? 'hover:-translate-y-0.5' : 'opacity-50 grayscale'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${
            unlocked ? achievement.color : 'from-border to-border-subtle'
          } shadow-soft`}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={achievement.iconPath} />
          </svg>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            unlocked
              ? 'bg-primary-subtle text-primary'
              : 'bg-border-subtle text-fg-subtle'
          }`}
        >
          +{achievement.xp} XP
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-fg leading-tight">{achievement.title}</p>
        <p className="text-xs text-fg-muted mt-0.5 leading-relaxed">{achievement.description}</p>
      </div>

      {unlocked && (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium">{t('achievementUnlocked')}</span>
        </div>
      )}
    </Card>
  )
}

export default function ProfilePage() {
  const t = useTranslations('profile')

  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [membershipCount, setMembershipCount] = useState(0)
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
        setMembershipCount(joined.length)
        setProducts(prods)
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

  if (loading) {
    return (
      <DefaultLayout>
        <div className="py-8 space-y-4">
          <Card variant="glass" padding="lg" className="animate-pulse">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-border-subtle" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-border-subtle rounded-lg w-48" />
                <div className="h-4 bg-border-subtle rounded-lg w-64" />
              </div>
            </div>
          </Card>
          <Card variant="glass" padding="md" className="animate-pulse h-24" />
        </div>
      </DefaultLayout>
    )
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="text-center py-24">
          <p className="text-fg-muted text-sm">{t('notFound')}</p>
        </div>
      </DefaultLayout>
    )
  }

  const totalListings = products.reduce((sum, p) => sum + p.listings.length, 0)
  const coveredMarkets = new Set(products.flatMap(p => p.listings.map(l => l.marketplaceId))).size
  const daysActive = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86_400_000)

  const xp = computeXP(membershipCount, products.length, totalListings)
  const levelInfo = getLevelInfo(xp)

  const achievementStats: AchievementStats = {
    memberships: membershipCount,
    products: products.length,
    totalListings,
    coveredMarkets,
    daysActive,
  }

  const unlockedCount = ACHIEVEMENTS.filter(a => a.check(achievementStats)).length

  const stats = [
    {
      label: t('stats.totalXP'),
      value: xp.toLocaleString(),
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'text-primary',
    },
    {
      label: t('stats.marketplaces'),
      value: membershipCount,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: t('stats.products'),
      value: products.length,
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: t('stats.achievements'),
      value: `${unlockedCount}/${ACHIEVEMENTS.length}`,
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      color: 'text-violet-600 dark:text-violet-400',
    },
  ]

  return (
    <DefaultLayout>
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute -top-10 left-1/3 w-80 h-80 bg-primary-subtle rounded-full blur-3xl opacity-60 dark:opacity-25" />
          <div className="absolute top-6 right-1/4 w-64 h-64 bg-violet-100 dark:bg-violet-900/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="relative">
          <ProfileHeader
            user={user}
            onUpdate={handleUpdate}
            level={levelInfo.current.level}
            levelName={levelInfo.current.name}
          />
        </div>
      </section>

      <div className="space-y-6 pb-16">
        <LevelCard {...levelInfo} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} variant="glass" padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-fg-subtle uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-fg">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl bg-primary-subtle flex items-center justify-center shrink-0 ${stat.color}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-fg">{t('achievements')}</h2>
            <span className="text-sm text-fg-muted">
              {t('unlockedCount', { unlocked: unlockedCount, total: ACHIEVEMENTS.length })}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.check(achievementStats)}
              />
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
