'use client'

import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { lookbookItems } from '@/lib/config'

export default function Lookbook() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  const openLightbox = (index) => setLightbox({ open: true, index })
  const closeLightbox = () => setLightbox({ open: false, index: 0 })

  const goTo = useCallback(
    (dir) => {
      setLightbox((prev) => {
        const next = (prev.index + dir + lookbookItems.length) % lookbookItems.length
        return { ...prev, index: next }
      })
    },
    []
  )

  const sizeClasses = (tamano) => {
    switch (tamano) {
      case 'grande':
        return 'md:col-span-2 md:row-span-2'
      case 'horizontal':
        return 'md:col-span-2 md:row-span-1'
      default:
        return 'md:col-span-1 md:row-span-1'
    }
  }

  const current = lookbookItems[lightbox.index]

  return (
    <section id="lookbook" className="py-16 md:py-24 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-[3px] text-accent font-semibold text-sm mb-3">
            LOOKBOOK
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-dark mb-3">
            Inspirate con los looks
          </h2>
          <p className="text-secondary max-w-md mx-auto">
            Combiná prendas y armá tu outfit perfecto.
          </p>
        </div>

        {/* Grid — masonry-style on desktop, 2-col symmetric on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:auto-rows-[180px] gap-3 md:gap-4">
          {lookbookItems.map((item, idx) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden cursor-pointer group ${sizeClasses(item.tamano)}`}
              style={{ minHeight: '160px' }}
              onClick={() => openLightbox(idx)}
            >
              {/* Image or placeholder */}
              {item.imagenUrl ? (
                <img
                  src={item.imagenUrl}
                  alt={item.titulo}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: item.placeholder }} />
              )}

              {/* Badge */}
              {item.badge && (
                <span className="absolute top-3 right-3 bg-white/90 text-dark text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                  {item.badge}
                </span>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-lg text-center px-4">
                  {item.titulo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightbox.open && current && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox image */}
            {current.imagenUrl ? (
              <img
                src={current.imagenUrl}
                alt={current.titulo}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: current.placeholder }} />
            )}
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {/* Badge */}
            {current.badge && (
              <span className="absolute top-4 left-4 bg-white/90 text-dark text-sm font-semibold px-3 py-1 rounded-full z-10">
                {current.badge}
              </span>
            )}

            {/* Title */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">{current.titulo}</h3>
              <p className="text-white/70 text-sm mt-1">
                {lightbox.index + 1} / {lookbookItems.length}
              </p>
            </div>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goTo(-1)
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goTo(1)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
