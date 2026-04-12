'use client'

import { useState, useMemo } from 'react'
import FilterSidebar from '@/components/landing/FilterSidebar'
import ProductCard from '@/components/landing/ProductCard'

// Natural sort: numeric values first (ascending), then common letter-size order, then alphabetical
const LETTER_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
function sortTalles(a, b) {
  const na = Number(a)
  const nb = Number(b)
  const aIsNum = !Number.isNaN(na)
  const bIsNum = !Number.isNaN(nb)
  if (aIsNum && bIsNum) return na - nb
  if (aIsNum) return -1
  if (bIsNum) return 1
  const ia = LETTER_ORDER.indexOf(String(a).toUpperCase())
  const ib = LETTER_ORDER.indexOf(String(b).toUpperCase())
  if (ia !== -1 && ib !== -1) return ia - ib
  if (ia !== -1) return -1
  if (ib !== -1) return 1
  return String(a).localeCompare(String(b))
}

export default function Productos({ productos = [], onQuickView, onAddToCart }) {
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    price: null,
    status: null,
  })

  // Derive categories and sizes from actual products so they work with any value (letters, numbers, etc.)
  const categorias = useMemo(() => {
    const set = new Set()
    productos.forEach((p) => {
      if (p.categoria) set.add(String(p.categoria))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [productos])

  const tallesDisponibles = useMemo(() => {
    const set = new Set()
    productos.forEach((p) => {
      (p.talles || []).forEach((t) => {
        if (t != null && t !== '') set.add(String(t))
      })
    })
    return Array.from(set).sort(sortTalles)
  }, [productos])

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

        {/* Layout: filters above on mobile, sidebar on desktop */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <FilterSidebar
            categories={categorias}
            sizes={tallesDisponibles}
            productos={productos}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
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

    </section>
  )
}
