'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { promos } from '@/lib/config'

const STORAGE_KEY = 'norte-promo-bar-closed'

export default function PromoBar() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      setVisible(false)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (!visible) return null

  const marqueeText = promos.join(' | ') + ' | '

  return (
    <div className="relative bg-primary text-white text-[13px] overflow-hidden z-50">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        <span className="mx-4">{marqueeText}</span>
        <span className="mx-4">{marqueeText}</span>
        <span className="mx-4">{marqueeText}</span>
        <span className="mx-4">{marqueeText}</span>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20"
        aria-label="Cerrar barra de promociones"
      >
        <X size={14} />
      </button>
    </div>
  )
}
