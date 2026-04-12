'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, X, Link, Check } from 'lucide-react'

const NETWORKS = [
  {
    name: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: 'bg-[#25D366] hover:bg-[#1ebe5b]',
    url: (text, url) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-[#1877F2] hover:bg-[#166fe5]',
    url: (text, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    name: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    url: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
]

export default function ShareButton({ product, variant = 'icon' }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareText = `${product.nombre} — $${product.precio.toLocaleString('es-AR')} | Norte Sport`

  const handleToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen((v) => !v)
  }

  const handleShare = (e, network) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(network.url(shareText, shareUrl), '_blank', 'noopener,noreferrer,width=600,height=400')
    setOpen(false)
  }

  const handleCopy = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = `${shareText}\n${shareUrl}`
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.share({ title: product.nombre, text: shareText, url: shareUrl })
    } catch {
      // User cancelled or not supported
    }
    setOpen(false)
  }

  if (variant === 'full') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleToggle}
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 text-secondary font-medium rounded-lg hover:border-accent hover:text-accent transition-colors text-sm"
        >
          <Share2 size={16} />
          Compartir
        </button>

        {open && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Compartir en</span>
              <button onClick={handleToggle} className="text-secondary hover:text-primary">
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              {NETWORKS.map((net) => (
                <button
                  key={net.name}
                  onClick={(e) => handleShare(e, net)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-medium transition-colors ${net.color}`}
                  title={net.name}
                >
                  {net.icon}
                  <span className="hidden sm:inline">{net.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-secondary hover:text-primary hover:border-gray-300 transition-colors text-xs font-medium"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Link size={14} />}
              {copied ? 'Copiado!' : 'Copiar enlace'}
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 w-full py-2 mt-1 rounded-lg border border-gray-200 text-secondary hover:text-primary hover:border-gray-300 transition-colors text-xs font-medium"
              >
                <Share2 size={14} />
                Más opciones...
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // variant === 'icon' — compact button for ProductCard
  return (
    <>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
        title="Compartir"
      >
        <Share2 size={16} />
        Compartir
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]" ref={menuRef}>
          <div className="absolute inset-0" onClick={handleToggle} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[240px] animate-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-primary">Compartir</span>
              <button onClick={handleToggle} className="text-secondary hover:text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {NETWORKS.map((net) => (
                <button
                  key={net.name}
                  onClick={(e) => handleShare(e, net)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${net.color}`}
                >
                  {net.icon}
                  {net.name}
                </button>
              ))}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-secondary hover:text-primary hover:border-gray-300 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Link size={14} />}
                {copied ? 'Copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
