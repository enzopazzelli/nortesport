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
import { productos as productosConfig } from '@/lib/config'

export default function Home() {
  const [carrito, setCarrito] = useState([])
  const [carritoOpen, setCarritoOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

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
      <PromoBar />
      <Navbar cartCount={cartCount} onCartToggle={() => setCarritoOpen(true)} />

      <main id="inicio">
        <Hero />

        <section id="productos" className="scroll-reveal">
          <Productos
            productos={productosConfig}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={addToCart}
          />
        </section>

        <section id="lookbook" className="scroll-reveal">
          <Lookbook />
        </section>

        <section id="nosotras" className="scroll-reveal">
          <AboutUs />
        </section>

        <section id="testimonios" className="scroll-reveal">
          <Testimonios />
        </section>

        <section id="faq" className="scroll-reveal">
          <FAQ />
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
