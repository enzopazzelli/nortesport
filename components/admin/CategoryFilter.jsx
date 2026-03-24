'use client'

import { Filter, CheckSquare, Square } from 'lucide-react'

export default function CategoryFilter({ categories, activeCategories, onChange }) {
  if (!categories || categories.length === 0) {
    return null
  }

  const handleToggle = (cat) => {
    if (activeCategories.includes(cat)) {
      onChange(activeCategories.filter((c) => c !== cat))
    } else {
      onChange([...activeCategories, cat])
    }
  }

  const handleSelectAll = () => {
    onChange([...categories])
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <div className="w-full border border-border rounded-xl bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark font-semibold">
          <Filter className="w-5 h-5 text-accent" />
          Filtrar por categor&iacute;a
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs font-medium text-accent hover:text-accent/80 px-2 py-1 rounded hover:bg-accent/5"
          >
            Seleccionar todas
          </button>
          <span className="text-border">|</span>
          <button
            onClick={handleClear}
            className="text-xs font-medium text-secondary hover:text-dark px-2 py-1 rounded hover:bg-bg-alt"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = activeCategories.includes(cat)
          return (
            <button
              key={cat}
              onClick={() => handleToggle(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                active
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-white border-border text-secondary hover:border-accent/30 hover:text-dark'
              }`}
            >
              {active ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {cat}
            </button>
          )
        })}
      </div>

      {activeCategories.length > 0 && (
        <p className="text-xs text-secondary">
          {activeCategories.length} de {categories.length} categor&iacute;as seleccionadas
        </p>
      )}
    </div>
  )
}
