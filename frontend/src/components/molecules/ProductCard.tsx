'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/atoms/Button'
import { BACKEND_URL } from '@/lib/api'
import type { Product, ProductImage } from '@/types'

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => Promise<void>
}

function imgSrc(img: ProductImage) {
  return img.url.startsWith('/uploads') ? `${BACKEND_URL}${img.url}` : img.url
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const t  = useTranslations('productCard')
  const tp = useTranslations('products')

  const [confirming, setConfirming] = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [images]    = useState(() =>
    [...(product.images ?? [])].sort((a, b) => a.order - b.order)
  )
  const [activeIdx, setActiveIdx] = useState(0)

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(product.id) }
    finally { setDeleting(false); setConfirming(false) }
  }

  const coverImage  = images[activeIdx]
  const lowestPrice = product.listings.length > 0
    ? Math.min(...product.listings.map(l => l.price))
    : null

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="group relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft hover:shadow-soft-lg transition-shadow duration-300 neuro:bg-background neuro:p-0 neuro:shadow-neuro neuro:hover:shadow-neuro"
    >
      {/* glass card body */}
      <div className="rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden flex flex-col h-full neuro:bg-transparent neuro:backdrop-blur-none neuro:rounded-2xl">

        {/* ── image area ── */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-50/90 to-slate-100/70 dark:from-slate-800/70 dark:to-slate-900/80">

          {/* top shimmer line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent z-10 pointer-events-none neuro:hidden" />

          {coverImage ? (
            <img
              src={imgSrc(coverImage)}
              alt={product.name}
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 px-2 z-10">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(i)}
                  className={`w-7 h-7 shrink-0 overflow-hidden rounded-lg transition-all duration-150 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft neuro:backdrop-blur-none neuro:bg-card ${
                    i === activeIdx ? 'ring-1 ring-primary' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgSrc(img)} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
              {images.length > 5 && (
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft neuro:backdrop-blur-none neuro:bg-card flex items-center justify-center text-[10px] text-fg-muted font-medium">
                  +{images.length - 5}
                </div>
              )}
            </div>
          )}

          {/* action buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={e => { e.stopPropagation(); onEdit(product) }}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft neuro:backdrop-blur-none neuro:bg-card text-fg-muted hover:text-primary transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); setConfirming(true) }}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft neuro:backdrop-blur-none neuro:bg-card text-fg-muted hover:text-red-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── info area ── */}
        <div className="flex flex-col gap-1.5 flex-1 px-4 pt-3 pb-4 border-t border-white/40 dark:border-white/5 neuro:border-border-subtle">
          <h3 className="text-sm font-semibold text-fg line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {lowestPrice !== null ? (
            <p className="text-base font-bold text-primary">
              R$ {lowestPrice.toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-fg-subtle italic">{tp('noPrice')}</p>
          )}

          {product.listings.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {product.listings.map(l => (
                <span
                  key={l.id}
                  className="text-[10px] text-fg-muted bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 px-1.5 py-0.5 rounded-full backdrop-blur-sm neuro:backdrop-blur-none neuro:bg-card-raised neuro:border-border-subtle"
                >
                  {l.marketplace.name}
                </span>
              ))}
            </div>
          )}

          {/* delete confirm — animated */}
          <AnimatePresence>
            {confirming && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 pt-2.5 border-t border-white/40 dark:border-white/10 neuro:border-border-subtle flex items-center justify-between gap-2">
                  <p className="text-xs text-fg-muted">{t('removeConfirm')}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                      {t('cancel')}
                    </Button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-500/90 text-white font-medium hover:bg-red-500 disabled:opacity-50 transition-colors backdrop-blur-sm"
                    >
                      {deleting ? t('removing') : t('remove')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
