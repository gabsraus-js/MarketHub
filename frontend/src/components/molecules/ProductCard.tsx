'use client'

import { useState } from 'react'
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
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [images] = useState(() =>
    [...(product.images ?? [])].sort((a, b) => a.order - b.order)
  )
  const [activeIdx, setActiveIdx] = useState(0)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(product.id)
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  const coverImage = images[activeIdx]
  const lowestPrice = product.listings.length > 0
    ? Math.min(...product.listings.map(l => l.price))
    : null

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* Image */}
      <div className="relative h-44 bg-slate-50 overflow-hidden">
        {coverImage ? (
          <img
            src={imgSrc(coverImage)}
            alt={product.name}
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Thumbnail strip overlay */}
        {images.length > 1 && (
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 px-2">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIdx(i)}
                className={`w-7 h-7 shrink-0 overflow-hidden rounded transition-all duration-150 bg-white shadow ${
                  i === activeIdx ? 'ring-1 ring-primary-500' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgSrc(img)} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
            {images.length > 5 && (
              <div className="w-7 h-7 shrink-0 rounded bg-white shadow flex items-center justify-center text-[10px] text-slate-400 font-medium">
                +{images.length - 5}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={e => { e.stopPropagation(); onEdit(product) }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-slate-400 hover:text-primary-600 transition-colors"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); setConfirming(true) }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm text-slate-800 font-medium line-clamp-2 leading-snug">{product.name}</h3>

        {lowestPrice !== null ? (
          <p className="text-lg font-bold text-primary-600 mt-0.5">
            R$ {lowestPrice.toFixed(2)}
          </p>
        ) : (
          <p className="text-sm text-slate-300 italic mt-0.5">Sem preço</p>
        )}

        {product.listings.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.listings.map(l => (
              <span key={l.id} className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {l.marketplace.name}
              </span>
            ))}
          </div>
        )}

        {confirming && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Remover produto?</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancelar</Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Removendo…' : 'Remover'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
