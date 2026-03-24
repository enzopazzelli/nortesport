'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react'
import { waLink } from '@/lib/config'

const formatPrice = (price) =>
  '$' + price.toLocaleString('es-AR', { minimumFractionDigits: 0 })

export default function CarritoPanel({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  const [nombre, setNombre] = useState('')
  const [notas, setNotas] = useState('')

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const handleWhatsAppCheckout = () => {
    const productLines = items
      .map(
        (item) =>
          `\u2022 ${item.cantidad}x ${item.nombre}${item.talle ? ` (Talle ${item.talle})` : ''} \u2014 ${formatPrice(item.precio * item.cantidad)}`
      )
      .join('\n')

    const message = `\ud83c\udfcb\ufe0f *Nuevo pedido \u2014 Norte Sport*\n\n\ud83d\udc64 Nombre: ${nombre || 'No indicado'}\n\n\ud83d\udccb Productos:\n${productLines}\n\n\ud83d\udcb0 Total: ${formatPrice(total)}\n\n\ud83d\udcdd Notas: ${notas || 'Sin notas'}`

    window.open(waLink(message), '_blank')
  }

  const handleMercadoPago = () => {
    alert('Integraci\u00f3n con MercadoPago pr\u00f3ximamente. Por ahora, us\u00e1 WhatsApp.')
  }

  const scrollToProducts = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById('productos')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[56] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg text-dark">
            Tu carrito ({items.reduce((s, i) => s + i.cantidad, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag size={48} className="text-secondary/40 mb-4" />
              <p className="text-secondary text-lg mb-4">Tu carrito est&aacute; vac&iacute;o</p>
              <button
                onClick={scrollToProducts}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Items */}
              {items.map((item) => (
                <div key={`${item.id}-${item.talle}`} className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-[60px] h-[60px] rounded-lg flex-shrink-0 overflow-hidden">
                    {item.imagenes?.length > 0 ? (
                      <img
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: item.placeholder || 'linear-gradient(135deg, #2B3A52, #6B7B8D)',
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-dark text-sm truncate">{item.nombre}</p>
                        {item.talle && (
                          <p className="text-secondary text-xs">Talle {item.talle}</p>
                        )}
                        <p className="text-secondary text-xs mt-0.5">
                          {formatPrice(item.precio)} c/u
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id, item.talle)}
                        className="text-secondary hover:text-sale p-1 flex-shrink-0 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.talle, item.cantidad - 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-l-lg"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium min-w-[32px] text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.talle, item.cantidad + 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-r-lg"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="font-semibold text-dark text-sm">
                        {formatPrice(item.precio * item.cantidad)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <hr className="border-border" />

              {/* Buyer info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Indicaciones, color preferido, etc."
                    rows={2}
                    className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Divider */}
              <hr className="border-border" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Total</span>
                <span className="font-bold text-xl text-dark">{formatPrice(total)}</span>
              </div>

              {/* Checkout buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleMercadoPago}
                  className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Pagar con MercadoPago
                </button>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-whatsapp text-white font-semibold py-3 rounded-lg hover:bg-whatsapp/90 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Continuar por WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
