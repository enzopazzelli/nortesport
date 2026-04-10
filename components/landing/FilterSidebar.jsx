'use client'

import { useMemo } from 'react'
import { X } from 'lucide-react'

function buildPriceRanges(productos) {
  const prices = productos.map((p) => p.precio).filter((p) => p > 0).sort((a, b) => a - b)
  if (prices.length === 0) return []

  const min = prices[0]
  const max = prices[prices.length - 1]
  if (min === max) return [{ label: `$${min.toLocaleString('es-AR')}`, min, max }]

  // Round to nearest nice step (500, 1000, 5000, etc.)
  const range = max - min
  const step = range <= 5000 ? 500 : range <= 20000 ? 1000 : range <= 100000 ? 5000 : 10000
  const roundUp = (v) => Math.ceil(v / step) * step
  const roundDown = (v) => Math.floor(v / step) * step

  const low = roundDown(min)
  const mid = roundUp(low + range / 3)
  const high = roundUp(low + (range * 2) / 3)
  const top = roundUp(max)

  const fmt = (n) => '$' + n.toLocaleString('es-AR')

  // Ensure distinct breakpoints
  if (mid >= high || mid >= top) {
    return [
      { label: `Hasta ${fmt(roundUp((min + max) / 2))}`, min: 0, max: roundUp((min + max) / 2) },
      { label: `${fmt(roundUp((min + max) / 2))}+`, min: roundUp((min + max) / 2), max: Infinity },
    ]
  }

  return [
    { label: `Hasta ${fmt(mid)}`, min: 0, max: mid },
    { label: `${fmt(mid)} — ${fmt(high)}`, min: mid, max: high },
    { label: `${fmt(high)}+`, min: high, max: Infinity },
  ]
}

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Nuevos', value: 'NUEVO' },
  { label: 'En oferta', value: 'SALE' },
  { label: 'Ultimas unidades', value: 'ÚLTIMAS' },
  { label: 'Sin stock', value: 'SIN_STOCK' },
]

export default function FilterSidebar({
  categories = [],
  sizes = [],
  productos = [],
  activeFilters = {},
  onFilterChange,
  onClear,
  isOpen = false,
  onClose,
}) {
  const priceRanges = useMemo(() => buildPriceRanges(productos), [productos])
  const selectedCategories = activeFilters.categories || []
  const selectedSizes = activeFilters.sizes || []
  const selectedPrice = activeFilters.price || null
  const selectedStatus = activeFilters.status || null

  const toggleCategory = (cat) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat]
    onFilterChange({ ...activeFilters, categories: updated })
  }

  const toggleSize = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]
    onFilterChange({ ...activeFilters, sizes: updated })
  }

  const setPrice = (range) => {
    const isSame =
      selectedPrice &&
      selectedPrice.min === range.min &&
      selectedPrice.max === range.max
    onFilterChange({
      ...activeFilters,
      price: isSame ? null : range,
    })
  }

  const setStatus = (value) => {
    onFilterChange({
      ...activeFilters,
      status: selectedStatus === value ? null : value,
    })
  }

  const filterContent = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-3">
          Categorias
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-3">
          Talles
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = selectedSizes.includes(size)
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
                  active
                    ? 'border-accent bg-accent/10 text-accent font-medium'
                    : 'border-gray-200 text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price ranges */}
      <div>
        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-3">
          Precio
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const active =
              selectedPrice &&
              selectedPrice.min === range.min &&
              selectedPrice.max === range.max
            return (
              <button
                key={range.label}
                onClick={() => setPrice(range)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                  active
                    ? 'border-accent bg-accent/10 text-accent font-medium'
                    : 'border-gray-200 text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-3">
          Estado
        </h4>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => {
            const active = selectedStatus === opt.value
            return (
              <button
                key={opt.label}
                onClick={() => setStatus(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
                  active
                    ? 'border-accent bg-accent/10 text-accent font-medium'
                    : 'border-gray-200 text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear button */}
      <button
        onClick={onClear}
        className="w-full py-2.5 text-sm font-medium text-secondary border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[250px] flex-shrink-0 sticky top-24 self-start">
        {filterContent}
      </aside>

      {/* Mobile drawer from bottom */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={onClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-6 slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-primary">Filtros</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Cerrar filtros"
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  )
}
