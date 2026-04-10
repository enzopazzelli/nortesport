'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { categorias, tallesDisponibles } from '@/lib/defaults'
import FilterSidebar from '@/components/landing/FilterSidebar'
import ProductCard from '@/components/landing/ProductCard'

export default function Productos({ productos = [], onQuickView, onAddToCart }) {
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    price: null,
    status: null,
  })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClear = () => {
    setFilters({
      categories: [],
      sizes: [],
      price: null,
      status: null,
    })
  }

  // Filter logic
  const filteredProducts = productos.filter((product) => {
    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.categoria)
    ) {
      return false
    }

    // Size filter
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((s) => (product.talles || []).includes(s))
    ) {
      return false
    }

    // Price filter
    if (filters.price) {
      if (product.precio < filters.price.min || product.precio > filters.price.max) {
        return false
      }
    }

    // Status filter
    if (filters.status !== null) {
      if (filters.status === 'SIN_STOCK') {
        if (product.stock == null || product.stock > 0) return false
      } else {
        if (product.badge !== filters.status) return false
      }
    }

    return true
  })

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.price !== null ||
    filters.status !== null

  return (
    <section id="productos" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-accent font-semibold uppercase tracking-[3px] text-sm mb-3">
            COLECCIÓN
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-primary mb-4">
            Nuestros productos
          </h2>
          <p className="text-secondary text-base max-w-lg mx-auto">
            Encontrá tu próximo outfit favorito. Filtrá por categoría o talle.
          </p>
        </div>

        {/* Layout: sidebar + grid */}
        <div className="flex gap-10">
          {/* Filter sidebar (desktop) */}
          <FilterSidebar
            categories={categorias}
            sizes={tallesDisponibles}
            productos={productos}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* Product grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-secondary">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'producto' : 'productos'}
                {hasActiveFilters && ' (filtrado)'}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-secondary text-lg mb-2">
                  No se encontraron productos
                </p>
                <p className="text-secondary/60 text-sm mb-4">
                  Probá ajustando los filtros
                </p>
                <button
                  onClick={handleClear}
                  className="text-accent font-medium text-sm hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter button - sticky at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition-colors"
        >
          <SlidersHorizontal size={18} />
          Filtros
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {filters.categories.length +
                filters.sizes.length +
                (filters.price ? 1 : 0) +
                (filters.status ? 1 : 0)}
            </span>
          )}
        </button>
      </div>
    </section>
  )
}
