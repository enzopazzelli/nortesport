'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonios } from '@/lib/config'

function getInitials(nombre) {
  return nombre
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Testimonios() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  // Cards visible per viewport
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 768) return 1
    return 3
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount())
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonios.length - visibleCount)

  const goTo = useCallback(
    (dir) => {
      setCurrentIndex((prev) => {
        const next = prev + dir
        if (next < 0) return maxIndex
        if (next > maxIndex) return 0
        return next
      })
    },
    [maxIndex]
  )

  // Autoplay
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(() => goTo(1), 5000)
    return () => clearInterval(intervalRef.current)
  }, [isPaused, goTo])

  const totalDots = maxIndex + 1

  return (
    <section id="testimonios" className="py-16 md:py-24 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-[3px] text-accent font-semibold text-sm mb-3">
            TESTIMONIOS
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-dark mb-3">
            Lo que dicen nuestras clientas
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Prev button — hidden on mobile */}
          <button
            onClick={() => goTo(-1)}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonios.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-white shadow-sm rounded-xl p-6 h-full flex flex-col">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {getInitials(t.nombre)}
                      </div>
                      <span className="font-semibold text-dark">{t.nombre}</span>
                    </div>

                    {/* Text */}
                    <p className="text-secondary flex-1 leading-relaxed mb-4">
                      &ldquo;{t.texto}&rdquo;
                    </p>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.estrellas }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next button — hidden on mobile */}
          <button
            onClick={() => goTo(1)}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentIndex ? 'bg-primary' : 'bg-primary/25'
              }`}
              aria-label={`Ir a testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
