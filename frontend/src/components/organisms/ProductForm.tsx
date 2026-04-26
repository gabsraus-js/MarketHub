'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { api, BACKEND_URL } from '@/lib/api'
import type { Marketplace, Product, ProductPayload } from '@/types'

interface Props {
  marketplaces: Marketplace[]
  product?: Product
  onSave: (data: ProductPayload) => Promise<void>
  onClose: () => void
}

// ─── Image upload section ────────────────────────────────────────────────────

type ImageEntry = {
  id?: string
  url: string       // blob URL (new) or full URL (existing, for display)
  remoteUrl?: string // server path like /uploads/…, for existing images
  file?: File
}

function ImageUpload({ images, onChange }: { images: ImageEntry[]; onChange: (v: ImageEntry[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - images.length)
    const entries: ImageEntry[] = files.map(file => ({ url: URL.createObjectURL(file), file }))
    onChange([...images, ...entries])
    e.target.value = ''
  }

  const remove = (i: number) => {
    const img = images[i]
    if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
    onChange(images.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Photos{' '}
        <span className="text-slate-400 font-normal">({images.length}/5)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group shadow-soft">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft">
                <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 flex flex-col items-center justify-center gap-1 transition-all text-slate-400 hover:text-primary-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] font-medium leading-none">Add photo</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
    </div>
  )
}

// ─── Marketplace row ─────────────────────────────────────────────────────────

type ListingEntry = {
  marketplaceId: string
  name: string
  category: string
  enabled: boolean
  price: string
}

const categoryColors: Record<string, string> = {
  'E-commerce': 'from-blue-100 to-indigo-100 text-indigo-600',
  Freelance: 'from-emerald-100 to-teal-100 text-emerald-700',
  'Digital Products': 'from-violet-100 to-purple-100 text-violet-700',
  Design: 'from-amber-100 to-orange-100 text-amber-700',
  Services: 'from-sky-100 to-cyan-100 text-sky-700',
  Startup: 'from-slate-100 to-gray-100 text-slate-600',
}

function MarketplaceRow({
  entry,
  basePrice,
  onToggle,
  onPriceChange,
  priceError,
}: {
  entry: ListingEntry
  basePrice: string
  onToggle: () => void
  onPriceChange: (v: string) => void
  priceError?: string
}) {
  const colors = categoryColors[entry.category] ?? 'from-slate-100 to-gray-100 text-slate-600'
  const isCustom = entry.enabled && basePrice !== '' && entry.price !== basePrice && entry.price !== ''

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 ${
        entry.enabled ? 'border-primary-200 bg-primary-50/30' : 'border-slate-100 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
          entry.enabled ? 'bg-primary-500 border-primary-500' : 'border-slate-300 hover:border-primary-400'
        }`}
      >
        {entry.enabled && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center text-xs font-bold shrink-0 select-none`}>
        {entry.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate leading-tight">{entry.name}</p>
        <p className="text-xs text-slate-400">{entry.category}</p>
      </div>

      <div className="shrink-0 w-28 flex flex-col items-end gap-0.5">
        {entry.enabled ? (
          <>
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={entry.price}
                onChange={e => onPriceChange(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-6 pr-2 py-1.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  priceError
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
                }`}
              />
            </div>
            {isCustom && (
              <span className="text-[10px] text-primary-500 font-medium">custom price</span>
            )}
          </>
        ) : (
          <span className="text-xs text-slate-300 italic">—</span>
        )}
      </div>
    </div>
  )
}

// ─── Main form ───────────────────────────────────────────────────────────────

export function ProductForm({ marketplaces, product, onSave, onClose }: Props) {
  const isEdit = Boolean(product)
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [images, setImages] = useState<ImageEntry[]>([])
  const [listings, setListings] = useState<ListingEntry[]>([])
  const [basePrice, setBasePrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Init images from existing product
    if (product?.images) {
      setImages(
        product.images.map(img => ({
          id: img.id,
          url: `${BACKEND_URL}${img.url}`,
          remoteUrl: img.url,
        }))
      )
    }
    // Init listing rows
    setListings(
      marketplaces.map(m => {
        const existing = product?.listings.find(l => l.marketplaceId === m.id)
        return {
          marketplaceId: m.id,
          name: m.name,
          category: m.category,
          enabled: Boolean(existing),
          price: existing ? String(existing.price) : '',
        }
      })
    )
  }, [marketplaces, product])

  const enabledCount = listings.filter(l => l.enabled).length
  const allEnabled = listings.length > 0 && enabledCount === listings.length

  const applyBasePrice = () => {
    if (!basePrice) return
    setListings(prev => prev.map(l => l.enabled ? { ...l, price: basePrice } : l))
  }

  const toggleAll = () => {
    const next = !allEnabled
    setListings(prev =>
      prev.map(l => ({
        ...l,
        enabled: next,
        price: next && !l.price && basePrice ? basePrice : l.price,
      }))
    )
  }

  const toggle = (id: string) => {
    setListings(prev =>
      prev.map(l => {
        if (l.marketplaceId !== id) return l
        const willEnable = !l.enabled
        return {
          ...l,
          enabled: willEnable,
          price: willEnable && !l.price && basePrice ? basePrice : l.price,
        }
      })
    )
    setErrors(prev => { const n = { ...prev }; delete n[`price_${id}`]; return n })
  }

  const setPrice = (id: string, value: string) => {
    setListings(prev => prev.map(l => l.marketplaceId === id ? { ...l, price: value } : l))
    setErrors(prev => { const n = { ...prev }; delete n[`price_${id}`]; return n })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Product name is required'
    const enabled = listings.filter(l => l.enabled)
    if (enabled.length === 0) errs.listings = 'Select at least one marketplace'
    enabled.forEach(l => {
      const p = parseFloat(l.price)
      if (!l.price || isNaN(p) || p <= 0) errs[`price_${l.marketplaceId}`] = 'Enter a valid price'
    })
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    try {
      // Upload any new images first
      const imageUrls = (
        await Promise.all(
          images.map(async img => {
            if (img.file) {
              try {
                const { url } = await api.upload(img.file)
                return url
              } catch {
                return null
              }
            }
            return img.remoteUrl ?? null
          })
        )
      ).filter((u): u is string => u !== null)

      await onSave({
        name: name.trim(),
        description: description.trim(),
        listings: listings
          .filter(l => l.enabled)
          .map(l => ({ marketplaceId: l.marketplaceId, price: parseFloat(l.price) })),
        imageUrls,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-soft-lg w-full max-w-lg flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? 'Update details, photos, and marketplace prices' : 'Add photos, set a base price, then customise per marketplace'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Photos */}
          <ImageUpload images={images} onChange={setImages} />

          {/* Name */}
          <Input
            label="Product Name"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="e.g. Premium Design Kit"
            error={errors.name}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your product in a few sentences..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-soft focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            />
          </div>

          {/* Marketplace listings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Marketplace Listings</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {enabledCount > 0 ? `${enabledCount} selected` : 'Choose where to list this product'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {allEnabled ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            {/* Base price row */}
            <div className="flex items-end gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Base price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={applyBasePrice}
                disabled={!basePrice}
                className="shrink-0 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
              >
                Apply to all
              </button>
            </div>

            {errors.listings && (
              <p className="text-xs text-red-500 mb-2">{errors.listings}</p>
            )}

            <div className="space-y-1.5">
              {listings.map(l => (
                <MarketplaceRow
                  key={l.marketplaceId}
                  entry={l}
                  basePrice={basePrice}
                  onToggle={() => toggle(l.marketplaceId)}
                  onPriceChange={v => setPrice(l.marketplaceId, v)}
                  priceError={errors[`price_${l.marketplaceId}`]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" loading={saving} onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  )
}
