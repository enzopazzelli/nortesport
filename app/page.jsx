'use client'

import { useState, useEffect, useCallback } from 'react'
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

export default function Home() {
  const [carrito, setCarrito] = useState([])
  const [carritoOpen, setCarritoOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Data from Sheets (or fallback to config)
  const [productos, setProductos] = useState(productosConfig)
  const [testimonios, setTestimonios] = useState(testimoniosConfig)
  const [lookbook, setLookbook] = useState(lookbookConfig)
  const [faqs, setFaqs] = useState(faqsConfig)
  const [siteConfig, setSiteConfig] = useState({ temporada: temporadaActual, promos: promosConfig })

  // Fetch data from Sheets via API route
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.productos?.length) setProductos(data.productos)
        if (data.testimonios?.length) setTestimonios(data.testimonios)
        if (data.lookbook?.length) setLookbook(data.lookbook)
        if (data.faqs?.length) setFaqs(data.faqs)
        if (data.config) setSiteConfig(data.config)
      })
      .catch(() => {
        // Silently fallback to config.js data (already set as default)
      })
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
          talle,
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
      <Navbar cartCount={cartCount} onCartToggle={() => setCarritoOpen(true)} />

      <main id="inicio">
        <Hero temporada={siteConfig.temporada} />

        <section id="productos" className="scroll-reveal">
          <Productos
            productos={productos}
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
