'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Modal from '@/components/ui/Modal'

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  if (!product) return null

  const hasDiscount = product.badge === 'SALE' && product.precioAnterior
  const discountPercent = hasDiscount
    ? Math.round((1 - product.precio / product.precioAnterior) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onAddToCart?.({ ...product, selectedSize, quantity })
    handleClose()
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onAddToCart?.({ ...product, selectedSize, quantity })
    handleClose()
  }

  const handleClose = () => {
    setSelectedSize(null)
    setQuantity(1)
    setSizeError(false)
    onClose()
  }

  const incrementQty = () => setQuantity((q) => q + 1)
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1))

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: photo */}
        <div className="aspect-[3/4] w-full relative overflow-hidden">
          {product.imagenUrl ? (
            <img
              src={product.imagenUrl}
              alt={product.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: product.placeholder }} />
          )}
        </div>

        {/* Right: info */}
        <div className="p-6 md:p-8 flex flex-col">
          {/* Name */}
          <h2 className="font-bold text-xl text-primary mb-2">
            {product.nombre}
          </h2>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            {hasDiscount && (
              <>
                <span className="text-secondary line-through text-base">
                  ${product.precioAnterior.toLocaleString('es-AR')}
                </span>
                <span className="text-[11px] font-semibold text-sale bg-sale/10 px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
            <span
              className={`font-bold text-2xl ${
                hasDiscount ? 'text-sale' : 'text-primary'
              }`}
            >
              ${product.precio.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Description */}
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {product.descripcion}
          </p>

          {/* Size selector */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-primary mb-2">Talle</h4>
            <div className="flex flex-wrap gap-2">
              {product.talles.map((talle) => {
                const active = selectedSize === talle
                return (
                  <button
                    key={talle}
                    onClick={() => {
                      setSelectedSize(talle)
                      setSizeError(false)
                    }}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                      active
                        ? 'border-accent bg-accent/10 text-accent font-medium'
                        : 'border-gray-200 text-secondary hover:border-accent hover:text-accent'
                    }`}
                  >
                    {talle}
                  </button>
                )
              })}
            </div>
            {sizeError && (
              <p className="text-sale text-xs mt-2">
                Selecciona un talle para continuar
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-primary mb-2">
              Cantidad
            </h4>
            <div className="inline-flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={decrementQty}
                className="px-3 py-2 text-secondary hover:text-primary transition-colors"
                aria-label="Reducir cantidad"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-primary min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                className="px-3 py-2 text-secondary hover:text-primary transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Agregar al carrito
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
