'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { BACKEND_URL } from '@/lib/api'
import type { Product } from '@/types'

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => Promise<void>
}

const MAX_VISIBLE = 3

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(product.id)
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  const visibleListings = product.listings.slice(0, MAX_VISIBLE)
  const extraCount = product.listings.length - MAX_VISIBLE
  const coverImage = product.images?.[0]
  const extraImages = (product.images?.length ?? 0) - 1

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover image */}
      {coverImage && (
        <div className="relative h-36 shrink-0 overflow-hidden">
          <img
            src={coverImage.url.startsWith('/uploads') ? `${BACKEND_URL}${coverImage.url}` : coverImage.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {extraImages > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-md">
              +{extraImages} photo{extraImages !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          {!coverImage && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-violet-100 text-primary-600 flex items-center justify-center text-base font-bold shrink-0 select-none">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</h3>
            {product.description ? (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{product.description}</p>
            ) : (
              <p className="text-xs text-slate-300 mt-0.5 italic">No description</p>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(product)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Listings */}
        <div className="border-t border-slate-50 pt-3 mt-auto">
          {product.listings.length > 0 ? (
            <>
              <p className="text-xs text-slate-400 mb-2">
                Listed on{' '}
                <span className="font-medium text-slate-600">{product.listings.length}</span>{' '}
                marketplace{product.listings.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {visibleListings.map(l => (
                  <span
                    key={l.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-medium text-slate-700">{l.marketplace.name}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-primary-600">${l.price.toFixed(2)}</span>
                  </span>
                ))}
                {extraCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-400">
                    +{extraCount} more
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-300 italic">Not listed on any marketplace yet</p>
          )}
        </div>

        {/* Inline delete confirm */}
        {confirming && (
          <div className="border-t border-red-50 pt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Remove this product permanently?</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
