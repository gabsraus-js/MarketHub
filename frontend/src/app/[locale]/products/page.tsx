'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { ProductCard } from '@/components/molecules/ProductCard'
import { ProductForm } from '@/components/organisms/ProductForm'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { api } from '@/lib/api'
import { mockMarketplaces } from '@/lib/mock-data'
import type { Product, Marketplace, ProductPayload, ProductListingPayload } from '@/types'

const DEMO_USER_ID = 'demo-user'

function SkeletonCard() {
  return (
    <Card variant="glass" padding="none" className="overflow-hidden animate-pulse">
      <div className="h-36 bg-border-subtle" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border-subtle rounded-lg w-2/3" />
            <div className="h-3 bg-border-subtle rounded-lg w-full" />
          </div>
        </div>
        <div className="border-t border-border-subtle pt-3 flex gap-2">
          <div className="h-6 bg-border-subtle rounded-lg w-28" />
          <div className="h-6 bg-border-subtle rounded-lg w-24" />
        </div>
      </div>
    </Card>
  )
}

export default function ProductsPage() {
  const t = useTranslations('products')

  const [products, setProducts] = useState<Product[]>([])
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  useEffect(() => {
    async function load() {
      try {
        const [prods, markets] = await Promise.all([
          api.products.list(DEMO_USER_ID),
          api.marketplaces.list(),
        ])
        setProducts(prods)
        setMarketplaces(markets)
      } catch {
        setMarketplaces(mockMarketplaces)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openCreate = () => { setEditingProduct(undefined); setFormOpen(true) }
  const openEdit = (product: Product) => { setEditingProduct(product); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditingProduct(undefined) }

  const handleSave = async (data: ProductPayload) => {
    if (editingProduct) {
      try {
        const updated = await api.products.update(editingProduct.id, data)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p))
      } catch {
        const fakeUpdated: Product = {
          ...editingProduct,
          ...data,
          images: editingProduct.images,
          listings: data.listings.map((l: ProductListingPayload, i: number) => ({
            id: `listing-${i}`,
            productId: editingProduct.id,
            marketplaceId: l.marketplaceId,
            price: l.price,
            currency: 'USD',
            marketplace: marketplaces.find(m => m.id === l.marketplaceId)!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
          updatedAt: new Date().toISOString(),
        }
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? fakeUpdated : p))
      }
    } else {
      try {
        const created = await api.products.create({ userId: DEMO_USER_ID, ...data })
        setProducts(prev => [created, ...prev])
      } catch {
        const localId = `local-${Date.now()}`
        const fakeProduct: Product = {
          id: localId,
          userId: DEMO_USER_ID,
          name: data.name,
          description: data.description || null,
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          listings: data.listings.map((l: ProductListingPayload, i: number) => ({
            id: `listing-${i}`,
            productId: localId,
            marketplaceId: l.marketplaceId,
            price: l.price,
            currency: 'USD',
            marketplace: marketplaces.find(m => m.id === l.marketplaceId)!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        }
        setProducts(prev => [fakeProduct, ...prev])
      }
    }
    closeForm()
  }

  const handleDelete = async (id: string) => {
    try { await api.products.delete(id) } catch { /* offline */ }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const totalListings = products.reduce((sum, p) => sum + p.listings.length, 0)
  const coveredMarkets = new Set(products.flatMap(p => p.listings.map(l => l.marketplaceId))).size

  const registeredLabel = products.length === 1
    ? t('registeredSingle')
    : t('registeredPlural', { count: products.length })

  return (
    <DefaultLayout>
      {/* ── Hero ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute -top-10 right-1/3 w-80 h-80 bg-violet-100 dark:bg-violet-900/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
          <div className="absolute top-6 left-1/4 w-64 h-64 bg-primary-subtle rounded-full blur-3xl opacity-60 dark:opacity-25" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-40 dark:opacity-20" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-fg-muted mb-5 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {loading ? '—' : registeredLabel}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-fg tracking-tight leading-[1.1] mb-3">
              {t('title')}{' '}
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h1>
            <p className="text-base text-fg-muted">{t('subtitle')}</p>
          </div>

          <Button onClick={openCreate} size="lg" className="shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newProduct')}
          </Button>
        </div>
      </section>

      {/* ── Stats bar ── */}
      {!loading && products.length > 0 && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {[
            { label: t('stats.products'), value: products.length },
            { label: t('stats.totalListings'), value: totalListings },
            { label: t('stats.marketsCovered'), value: coveredMarkets },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-xl px-3 py-1.5 shadow-soft"
            >
              <span className="text-sm font-bold text-fg">{stat.value}</span>
              <span className="text-xs text-fg-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <Card variant="glass" padding="none" className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-fg-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-semibold text-fg mb-1">{t('empty.title')}</h3>
          <p className="text-sm text-fg-muted max-w-xs mx-auto mb-6">{t('empty.description')}</p>
          <Button onClick={openCreate} size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('empty.cta')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <ProductForm
          marketplaces={marketplaces}
          product={editingProduct}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </DefaultLayout>
  )
}
