'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { api, BACKEND_URL } from '@/lib/api'
import type { Marketplace, Product, ProductPayload } from '@/types'

interface Props {
  marketplaces: Marketplace[]
  product?: Product
  onSave: (data: ProductPayload) => Promise<void>
  onClose: () => void
}

type ImageEntry = {
  id?: string
  url: string
  remoteUrl?: string
  file?: File
}

function ImageUpload({ images, onChange }: { images: ImageEntry[]; onChange: (v: ImageEntry[]) => void }) {
  const t = useTranslations('productForm')
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
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-fg">{t('photos')}</label>
        <span className="text-xs text-fg-subtle">{images.length}/5</span>
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-28 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary-subtle/30 flex flex-col items-center justify-center gap-2 transition-all duration-200 text-fg-subtle hover:text-primary group"
        >
          <div className="w-10 h-10 rounded-xl bg-border-subtle group-hover:bg-primary-subtle flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">{t('addPhotos')}</p>
            <p className="text-[10px] text-fg-subtle mt-0.5">{t('upTo5')}</p>
          </div>
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group shadow-soft">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
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
              className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary-subtle/30 flex flex-col items-center justify-center gap-1 transition-all text-fg-subtle hover:text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-medium">{t('add')}</span>
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
    </div>
  )
}

type ListingEntry = {
  marketplaceId: string
  name: string
  category: string
  enabled: boolean
  price: string
}

const categoryColors: Record<string, string> = {
  'E-commerce':       'from-blue-100 to-indigo-100 text-indigo-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-indigo-400',
  Freelance:          'from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-400',
  'Digital Products': 'from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-400',
  Design:             'from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400',
  Services:           'from-sky-100 to-cyan-100 text-sky-700 dark:from-sky-900/30 dark:to-cyan-900/30 dark:text-sky-400',
  Startup:            'from-border-subtle to-border text-fg-muted',
}

function MarketplaceRow({
  entry, basePrice, onToggle, onPriceChange, priceError,
}: {
  entry: ListingEntry
  basePrice: string
  onToggle: () => void
  onPriceChange: (v: string) => void
  priceError?: string
}) {
  const t = useTranslations('productForm')
  const colors = categoryColors[entry.category] ?? 'from-border-subtle to-border text-fg-muted'
  const isCustom = entry.enabled && basePrice !== '' && entry.price !== basePrice && entry.price !== ''

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 ${
        entry.enabled
          ? 'border-primary/30 bg-primary-subtle/40 dark:bg-primary/10'
          : 'border-border-subtle bg-white/30 dark:bg-white/5'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
          entry.enabled
            ? 'bg-primary border-primary shadow-soft'
            : 'border-border hover:border-primary/60'
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
        <p className="text-sm font-medium text-fg truncate leading-tight">{entry.name}</p>
        <p className="text-xs text-fg-subtle">{entry.category}</p>
      </div>

      <div className="shrink-0 w-28 flex flex-col items-end gap-0.5">
        {entry.enabled ? (
          <>
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-subtle text-sm select-none">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={entry.price}
                onChange={e => onPriceChange(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-6 pr-2 py-1.5 text-sm border rounded-lg bg-white/70 dark:bg-white/10 text-fg focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                  priceError
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-border focus:border-primary/60 focus:ring-primary/10'
                }`}
              />
            </div>
            {isCustom && (
              <span className="text-[10px] text-primary font-medium">{t('customPrice')}</span>
            )}
          </>
        ) : (
          <span className="text-xs text-fg-subtle italic">—</span>
        )}
      </div>
    </div>
  )
}

export function ProductForm({ marketplaces, product, onSave, onClose }: Props) {
  const t = useTranslations('productForm')
  const isEdit = Boolean(product)
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [images, setImages] = useState<ImageEntry[]>([])
  const [listings, setListings] = useState<ListingEntry[]>([])
  const [basePrice, setBasePrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (product?.images) {
      setImages(product.images.map(img => ({
        id: img.id,
        url: `${BACKEND_URL}${img.url}`,
        remoteUrl: img.url,
      })))
    }
    setListings(marketplaces.map(m => {
      const existing = product?.listings.find(l => l.marketplaceId === m.id)
      return {
        marketplaceId: m.id,
        name: m.name,
        category: m.category,
        enabled: Boolean(existing),
        price: existing ? String(existing.price) : '',
      }
    }))
  }, [marketplaces, product])

  const enabledCount = listings.filter(l => l.enabled).length
  const allEnabled = listings.length > 0 && enabledCount === listings.length

  const applyBasePrice = () => {
    if (!basePrice) return
    setListings(prev => prev.map(l => l.enabled ? { ...l, price: basePrice } : l))
  }

  const toggleAll = () => {
    const next = !allEnabled
    setListings(prev => prev.map(l => ({
      ...l,
      enabled: next,
      price: next && !l.price && basePrice ? basePrice : l.price,
    })))
  }

  const toggle = (id: string) => {
    setListings(prev => prev.map(l => {
      if (l.marketplaceId !== id) return l
      const willEnable = !l.enabled
      return { ...l, enabled: willEnable, price: willEnable && !l.price && basePrice ? basePrice : l.price }
    }))
    setErrors(prev => { const n = { ...prev }; delete n[`price_${id}`]; return n })
  }

  const setPrice = (id: string, value: string) => {
    setListings(prev => prev.map(l => l.marketplaceId === id ? { ...l, price: value } : l))
    setErrors(prev => { const n = { ...prev }; delete n[`price_${id}`]; return n })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = t('productNameRequired')
    const enabled = listings.filter(l => l.enabled)
    if (enabled.length === 0) errs.listings = t('selectAtLeast')
    enabled.forEach(l => {
      const p = parseFloat(l.price)
      if (!l.price || isNaN(p) || p <= 0) errs[`price_${l.marketplaceId}`] = t('invalidPrice')
    })
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setUploadError(null)
    try {
      let uploadFailed = false
      const imageUrls = (
        await Promise.all(images.map(async img => {
          if (img.file) {
            try { return (await api.upload(img.file)).url }
            catch { uploadFailed = true; return null }
          }
          return img.remoteUrl ?? null
        }))
      ).filter((u): u is string => u !== null)

      if (uploadFailed) setUploadError(t('uploadError'))

      await onSave({
        name: name.trim(),
        description: description.trim(),
        listings: listings.filter(l => l.enabled).map(l => ({
          marketplaceId: l.marketplaceId,
          price: parseFloat(l.price),
        })),
        imageUrls,
      })
    } finally {
      setSaving(false)
    }
  }

  const footerLabel = enabledCount > 0
    ? (enabledCount === 1 ? t('selectedSingle') : t('selectedPlural', { count: enabledCount }))
    : t('noMarketplace')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" onClick={onClose} />

      <Card variant="glass" padding="none" className="relative w-full max-w-lg flex flex-col max-h-[92vh] shadow-soft-lg">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-soft shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEdit
                  ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  : 'M12 4v16m8-8H4'
                } />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-fg">{isEdit ? t('editTitle') : t('newTitle')}</h2>
              <p className="text-xs text-fg-muted">
                {isEdit ? t('editSubtitle') : t('newSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-fg-subtle hover:text-fg hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <ImageUpload images={images} onChange={setImages} />
          {uploadError && (
            <p className="text-xs text-red-500 -mt-3">{uploadError}</p>
          )}

          <Input
            label={t('productName')}
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            placeholder={t('productNamePlaceholder')}
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-fg mb-1.5">
              {t('description')}{' '}
              <span className="text-fg-subtle font-normal">{t('descriptionOptional')}</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
              className="w-full rounded-xl border border-border bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm text-fg placeholder-fg-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-fg">{t('marketplaceListings')}</p>
                <p className="text-xs text-fg-muted mt-0.5">
                  {enabledCount > 0 ? t('selectedCount', { count: enabledCount }) : t('chooseWhere')}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
              >
                {allEnabled ? t('deselectAll') : t('selectAll')}
              </button>
            </div>

            <div className="flex items-end gap-2 mb-3 p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-border-subtle backdrop-blur-sm">
              <div className="flex-1">
                <label className="block text-xs font-medium text-fg-muted mb-1">{t('basePrice')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle text-sm select-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-border rounded-lg bg-white/70 dark:bg-white/10 text-fg focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60 transition-all backdrop-blur-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={applyBasePrice}
                disabled={!basePrice}
                className="shrink-0 px-3 py-2 text-xs font-semibold rounded-lg bg-primary-subtle text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {t('applyToAll')}
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

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle shrink-0">
          <span className="text-xs text-fg-subtle">{footerLabel}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>{t('cancel')}</Button>
            <Button size="sm" loading={saving} onClick={handleSubmit}>
              {isEdit ? t('saveChanges') : t('createProduct')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
