'use client'

import { Eye, ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onQuickView, onAddToCart }) {
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

  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-400 group-hover:scale-105"
            style={{ background: product.placeholder }}
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded ${
              badgeStyles[product.badge] || 'bg-primary text-white'
            }`}
          >
            {badgeLabel[product.badge] || product.badge}
          </span>
        )}

        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
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
              onAddToCart?.(product)
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <ShoppingCart size={16} />
            Agregar
          </button>
        </div>
      </div>

      {/* Product info */}
      <div>
        {/* Category */}
        <p className="text-[11px] uppercase tracking-wide text-secondary mb-1">
          {product.categoria}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-primary text-sm mb-2">
          {product.nombre}
        </h3>

        {/* Size pills */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.talles.map((talle) => (
            <span
              key={talle}
              className="px-2 py-0.5 text-[10px] bg-gray-100 text-secondary rounded"
            >
              {talle}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  )
}
