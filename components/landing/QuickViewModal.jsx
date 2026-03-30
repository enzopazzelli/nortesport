'use client'

import { useState } from 'react'
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ShareButton from '@/components/ui/ShareButton'

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)

  if (!product) return null

  const images = product.imagenes?.length ? product.imagenes : []
  const hasMultiple = images.length > 1
  const outOfStock = product.stock != null && product.stock <= 0

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
    onAddToCart?.(product, selectedSize, quantity)
    handleClose()
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onAddToCart?.(product, selectedSize, quantity)
    handleClose()
  }

  const handleClose = () => {
    setSelectedSize(null)
    setQuantity(1)
    setSizeError(false)
    setCurrentImg(0)
    onClose()
  }

  const incrementQty = () => setQuantity((q) => q + 1)
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1))

  const prevImg = () => setCurrentImg((c) => (c === 0 ? images.length - 1 : c - 1))
  const nextImg = () => setCurrentImg((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: photo carousel */}
        <div className="flex flex-col">
          <div className="aspect-[3/4] w-full relative overflow-hidden">
            {images.length > 0 ? (
              <>
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

                {/* Arrows */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft size={18} className="text-primary" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight size={18} className="text-primary" />
                    </button>
                  </>
                )}

                {/* Counter */}
                {hasMultiple && (
                  <span className="absolute bottom-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImg + 1}/{images.length}
                  </span>
                )}
              </>
            ) : (
              <div className="absolute inset-0" style={{ background: product.placeholder }} />
            )}
          </div>

          {/* Thumbnails */}
          {hasMultiple && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setCurrentImg(i)}
                  className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentImg ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: info */}
        <div className="p-6 md:p-8 flex flex-col">
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

          {outOfStock ? (
            <div className="flex flex-col gap-3 mt-auto">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="font-semibold text-secondary text-sm uppercase tracking-wide">Producto sin stock</p>
                <p className="text-secondary/70 text-xs mt-1">Este producto no est&aacute; disponible en este momento</p>
              </div>
              <a
                href={`https://wa.me/${encodeURIComponent('5493854788733')}?text=${encodeURIComponent(`Hola! Quería consultar cuándo vuelve a estar disponible: ${product.nombre}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-whatsapp text-white font-semibold rounded-lg hover:bg-whatsapp/90 transition-colors text-center text-sm"
              >
                Consultanos por WhatsApp
              </a>
            </div>
          ) : (
            <>
              {/* Size selector */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-primary mb-2">Talle</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.talles || []).map((talle) => {
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
                <ShareButton product={product} variant="full" />
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
