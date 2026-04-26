'use client'

import { useEffect, useState } from 'react'
import { DefaultLayout } from '@/components/templates/DefaultLayout'
import { ProductCard } from '@/components/molecules/ProductCard'
import { ProductForm } from '@/components/organisms/ProductForm'
import { Button } from '@/components/atoms/Button'
import { api } from '@/lib/api'
import { mockMarketplaces } from '@/lib/mock-data'
import type { Product, Marketplace, ProductPayload, ProductListingPayload } from '@/types'

const DEMO_USER_ID = 'demo-user'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
            <div className="h-3 bg-slate-100 rounded-lg w-full" />
          </div>
        </div>
        <div className="border-t border-slate-50 pt-3 flex gap-2">
          <div className="h-6 bg-slate-100 rounded-lg w-28" />
          <div className="h-6 bg-slate-100 rounded-lg w-24" />
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
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

  const openCreate = () => {
    setEditingProduct(undefined)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingProduct(undefined)
  }

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
    try {
      await api.products.delete(id)
    } catch { /* offline */ }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <DefaultLayout>
      {/* Page header */}
      <div className="py-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-400 mt-1">Register your products and set prices across marketplaces</p>
        </div>
        <Button onClick={openCreate} size="md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Product
        </Button>
      </div>

      {/* Stats bar */}
      {!loading && products.length > 0 && (
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{products.length}</span>{' '}
            product{products.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {products.reduce((sum, p) => sum + p.listings.length, 0)}
            </span>{' '}
            total listings
          </span>
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {new Set(products.flatMap(p => p.listings.map(l => l.marketplaceId))).size}
            </span>{' '}
            marketplaces covered
          </span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">No products yet</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
            Create your first product and list it across marketplaces with custom prices.
          </p>
          <Button onClick={openCreate} size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first product
          </Button>
        </div>
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

      {/* Form modal */}
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
