'use client'

import { useState } from 'react'
import { Eye, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import ShareButton from '@/components/ui/ShareButton'

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  const [currentImg, setCurrentImg] = useState(0)
  const images = product.imagenes?.length ? product.imagenes : []
  const hasMultiple = images.length > 1
  const outOfStock = product.stock != null && product.stock <= 0

  const hasDiscount = product.badge === 'SALE' && product.precioAnterior
  const discountPercent = hasDiscount
    ? Math.round((1 - product.precio / product.precioAnterior) * 100)
    : 0

  const badgeStyles = {
    NUEVO: 'bg-primary text-white',
    SALE: 'bg-sale text-white',
    'ÚLTIMAS': 'bg-yellow-500 text-white',
  }

  const badgeLabel = {
    NUEVO: 'NUEVO',
    SALE: `-${discountPercent}%`,
    'ÚLTIMAS': 'ÚLTIMAS',
  }

  const goTo = (e, idx) => {
    e.stopPropagation()
    setCurrentImg(idx)
  }

  const prev = (e) => {
    e.stopPropagation()
    setCurrentImg((c) => (c === 0 ? images.length - 1 : c - 1))
  }

  const next = (e) => {
    e.stopPropagation()
    setCurrentImg((c) => (c === images.length - 1 ? 0 : c + 1))
  }

  return (
    <div className={`group cursor-pointer ${outOfStock ? 'opacity-70' : ''}`}>
      {/* Image carousel */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
        {images.length > 0 ? (
          <div className={`absolute inset-0 ${outOfStock ? 'grayscale-[40%]' : ''}`}>
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${product.nombre} - foto ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  i === currentImg ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        ) : (
          <div
            className={`absolute inset-0 ${outOfStock ? 'grayscale-[40%]' : ''}`}
            style={{ background: product.placeholder }}
          />
        )}

        {/* Out of stock badge */}
        {outOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-semibold uppercase tracking-wide px-4 py-2 rounded-lg">
              Sin stock
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && !outOfStock && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded z-10 ${
              badgeStyles[product.badge] || 'bg-primary text-white'
            }`}
          >
            {badgeLabel[product.badge] || product.badge}
          </span>
        )}

        {/* Carousel arrows (visible on hover when multiple images) */}
        {hasMultiple && !outOfStock && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={16} className="text-primary" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={16} className="text-primary" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {hasMultiple && !outOfStock && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(e, i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImg
                    ? 'bg-white w-3'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Ver foto ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hover overlay with action buttons */}
        {!outOfStock && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 flex-wrap opacity-0 group-hover:opacity-100 z-[5]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onQuickView?.(product)
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Eye size={16} />
              Ver
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const talles = product.talles || []
                if (talles.length > 1) {
                  // Force talle selection via QuickView modal
                  onQuickView?.(product)
                } else {
                  // No talles or single talle → add directly
                  onAddToCart?.(product, talles[0] || null)
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <ShoppingCart size={16} />
              Agregar
            </button>
            <ShareButton product={product} variant="icon" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-secondary mb-1">
          {product.categoria}
        </p>
        <h3 className={`font-semibold text-sm mb-2 ${outOfStock ? 'text-secondary' : 'text-primary'}`}>
          {product.nombre}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {(product.talles || []).map((talle) => (
            <span
              key={talle}
              className="px-2 py-0.5 text-[10px] bg-gray-100 text-secondary rounded"
            >
              {talle}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {outOfStock ? (
            <span className="text-sm font-medium text-secondary">Sin stock</span>
          ) : (
            <>
              {hasDiscount && (
                <span className="text-sm text-secondary line-through">
                  ${product.precioAnterior.toLocaleString('es-AR')}
                </span>
              )}
              <span
                className={`font-bold text-base ${
                  hasDiscount ? 'text-sale' : 'text-primary'
                }`}
              >
                ${product.precio.toLocaleString('es-AR')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
