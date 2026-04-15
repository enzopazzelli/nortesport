'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import PromoBar from '@/components/landing/PromoBar'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Productos from '@/components/landing/Productos'
import Lookbook from '@/components/landing/Lookbook'
import AboutUs from '@/components/landing/AboutUs'
import Testimonios from '@/components/landing/Testimonios'
import FAQ from '@/components/landing/FAQ'
import Contacto from '@/components/landing/Contacto'
import Footer from '@/components/landing/Footer'
import CarritoPanel from '@/components/landing/CarritoPanel'
import QuickViewModal from '@/components/landing/QuickViewModal'
import {
  productos as productosConfig,
  testimonios as testimoniosConfig,
  lookbookItems as lookbookConfig,
  faqs as faqsConfig,
  temporadaActual,
  promos as promosConfig,
} from '@/lib/defaults'
import {
  applyProductOverrides,
  applyLookbookOverrides,
  PRODUCTOS_OVERRIDES_KEY,
  LOOKBOOK_OVERRIDES_KEY,
  LOOKBOOK_ORDER_KEY,
} from '@/lib/overrides'

export default function Home() {
  const [carrito, setCarrito] = useState([])
  const [carritoOpen, setCarritoOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Raw data from Sheets (or fallback to config) — overrides are applied below
  const [rawProductos, setRawProductos] = useState(productosConfig)
  const [rawLookbook, setRawLookbook] = useState(lookbookConfig)
  const [testimonios, setTestimonios] = useState(testimoniosConfig)
  const [faqs, setFaqs] = useState(faqsConfig)
  const [siteConfig, setSiteConfig] = useState({ temporada: temporadaActual, promos: promosConfig })
  const [overridesVersion, setOverridesVersion] = useState(0)

  // Apply admin localStorage overrides on top of raw data
  const productos = useMemo(
    () => applyProductOverrides(rawProductos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawProductos, overridesVersion]
  )
  const lookbook = useMemo(
    () => applyLookbookOverrides(rawLookbook),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawLookbook, overridesVersion]
  )

  // Fetch data from Sheets via API route
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.productos?.length) setRawProductos(data.productos)
        if (data.testimonios?.length) setTestimonios(data.testimonios)
        if (data.lookbook?.length) setRawLookbook(data.lookbook)
        if (data.faqs?.length) setFaqs(data.faqs)
        if (data.config) setSiteConfig(data.config)
      })
      .catch(() => {
        // Silently fallback to config.js data (already set as default)
      })
  }, [])

  // Re-apply overrides when admin edits from another tab (same browser)
  useEffect(() => {
    const handleStorage = (e) => {
      if (
        e.key === PRODUCTOS_OVERRIDES_KEY ||
        e.key === LOOKBOOK_OVERRIDES_KEY ||
        e.key === LOOKBOOK_ORDER_KEY
      ) {
        setOverridesVersion((v) => v + 1)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('norte-sport-carrito')
      if (saved) setCarrito(JSON.parse(saved))
    } catch {}
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('norte-sport-carrito', JSON.stringify(carrito))
  }, [carrito])

  const addToCart = useCallback((product, talle, cantidad = 1) => {
    setCarrito((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.talle === talle)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.talle === talle
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          talle: talle || null,
          tallesDisponibles: product.talles || [],
          cantidad,
          imagenes: product.imagenes || [],
          placeholder: product.placeholder,
        },
      ]
    })
    setCarritoOpen(true)
  }, [])

  const updateQuantity = useCallback((id, talle, newCantidad) => {
    if (newCantidad < 1) return
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id && item.talle === talle ? { ...item, cantidad: newCantidad } : item
      )
    )
  }, [])

  const updateTalle = useCallback((id, oldTalle, newTalle) => {
    setCarrito((prev) => {
      // Check if there's already an item with the new talle → merge quantities
      const collision = prev.find((item) => item.id === id && item.talle === newTalle)
      if (collision) {
        return prev
          .map((item) => {
            if (item.id === id && item.talle === newTalle) {
              const currentItem = prev.find((i) => i.id === id && i.talle === oldTalle)
              return { ...item, cantidad: item.cantidad + (currentItem?.cantidad || 0) }
            }
            return item
          })
          .filter((item) => !(item.id === id && item.talle === oldTalle))
      }
      // Otherwise just update the talle
      return prev.map((item) =>
        item.id === id && item.talle === oldTalle ? { ...item, talle: newTalle } : item
      )
    })
  }, [])

  const removeFromCart = useCallback((id, talle) => {
    setCarrito((prev) => prev.filter((item) => !(item.id === id && item.talle === talle)))
  }, [])

  const cartCount = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PromoBar promos={siteConfig.promos} />
      <Navbar cartCount={cartCount} onCartToggle={() => setCarritoOpen(true)} onSearch={setSearchTerm} />

      <main id="inicio">
        <Hero temporada={siteConfig.temporada} />

        <section id="productos" className="scroll-reveal">
          <Productos
            productos={productos}
            searchTerm={searchTerm}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={addToCart}
          />
        </section>

        <section id="lookbook" className="scroll-reveal">
          <Lookbook items={lookbook} />
        </section>

        <section id="nosotras" className="scroll-reveal">
          <AboutUs />
        </section>

        <section id="testimonios" className="scroll-reveal">
          <Testimonios items={testimonios} />
        </section>

        <section id="faq" className="scroll-reveal">
          <FAQ items={faqs} />
        </section>

        <section id="contacto" className="scroll-reveal">
          <Contacto />
        </section>
      </main>

      <Footer />

      <CarritoPanel
        isOpen={carritoOpen}
        onClose={() => setCarritoOpen(false)}
        items={carrito}
        onUpdateQuantity={updateQuantity}
        onUpdateTalle={updateTalle}
        onRemove={removeFromCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </>
  )
}
