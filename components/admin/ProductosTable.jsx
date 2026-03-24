'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  RotateCcw,
  Check,
  X,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { productos as defaultProductos } from '@/lib/defaults'

const STORAGE_KEY = 'norte_productos_overrides'

function getStoredOverrides() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export default function ProductosTable() {
  const [products, setProducts] = useState([])
  const [overrides, setOverrides] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editField, setEditField] = useState(null) // 'precio' | 'stock'
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const stored = getStoredOverrides()
    setOverrides(stored)
    const merged = defaultProductos.map((p) => ({
      ...p,
      ...(stored[p.id] || {}),
    }))
    setProducts(merged)
  }, [])

  const updateOverride = (id, changes) => {
    const newOverrides = {
      ...overrides,
      [id]: { ...(overrides[id] || {}), ...changes },
    }
    setOverrides(newOverrides)
    saveOverrides(newOverrides)

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    )
  }

  const toggleDisponible = (id, current) => {
    updateOverride(id, { disponible: !current })
  }

  const startEdit = (product, field) => {
    setEditingId(product.id)
    setEditField(field)
    setEditValue(String(field === 'stock' ? (product.stock ?? '') : product.precio))
  }

  const saveEdit = (id) => {
    const num = Number(editValue)
    if (isNaN(num) || num < 0) {
      cancelEdit()
      return
    }
    updateOverride(id, { [editField]: editField === 'stock' ? Math.floor(num) : num })
    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditField(null)
    setEditValue('')
  }

  const handleRestore = () => {
    if (!confirm('Esto restaura todos los productos a sus valores originales. ¿Continuar?')) return
    localStorage.removeItem(STORAGE_KEY)
    setOverrides({})
    setProducts([...defaultProductos])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const hasOverrides = Object.keys(overrides).length > 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark font-semibold text-lg">
          <Package className="w-5 h-5 text-accent" />
          Productos ({products.length})
        </div>
        {hasOverrides && (
          <button
            onClick={handleRestore}
            className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-dark px-3 py-2 rounded-lg hover:bg-bg-alt border border-border"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar originales
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-alt">
                <th className="text-left px-4 py-3 font-semibold text-secondary w-16">
                  ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">
                  Categor&iacute;a
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary w-36">
                  Precio
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary w-24">
                  Stock
                </th>
                <th className="text-left px-4 py-3 font-semibold text-secondary w-28">
                  Badge
                </th>
                <th className="text-center px-4 py-3 font-semibold text-secondary w-28">
                  Disponible
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => {
                const isEditing = editingId === product.id
                const isOverridden = !!overrides[product.id]

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-border last:border-b-0 ${
                      i % 2 === 1 ? 'bg-bg-alt/50' : ''
                    } ${isOverridden ? 'bg-accent/[0.02]' : ''}`}
                  >
                    <td className="px-4 py-3 text-secondary font-mono text-xs">
                      {product.id}
                    </td>
                    <td className="px-4 py-3 text-dark font-medium">
                      {product.nombre}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {product.categoria}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing && editField === 'precio' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(product.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="w-24 px-2 py-1 border border-accent rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(product.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-secondary hover:bg-bg-alt rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(product, 'precio')}
                          className="group/price flex items-center gap-1 text-dark font-semibold hover:text-accent"
                        >
                          {formatPrice(product.precio)}
                          <Pencil className="w-3 h-3 opacity-0 group-hover/price:opacity-100 text-accent" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing && editField === 'stock' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(product.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="w-16 px-2 py-1 border border-accent rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                            autoFocus
                            min="0"
                          />
                          <button
                            onClick={() => saveEdit(product.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-secondary hover:bg-bg-alt rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(product, 'stock')}
                          className={`group/stock flex items-center gap-1 font-medium hover:text-accent ${
                            product.stock != null && product.stock <= 0
                              ? 'text-sale'
                              : 'text-dark'
                          }`}
                        >
                          {product.stock ?? '—'}
                          <Pencil className="w-3 h-3 opacity-0 group-hover/stock:opacity-100 text-accent" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.badge ? (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            product.badge === 'SALE'
                              ? 'bg-sale/10 text-sale'
                              : product.badge === 'NUEVO'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-secondary/40 text-xs">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleDisponible(product.id, product.disponible)}
                        className={`inline-flex items-center gap-1 text-sm font-medium rounded-full px-2 py-0.5 ${
                          product.disponible
                            ? 'text-green-600 bg-green-50'
                            : 'text-sale bg-sale/10'
                        }`}
                      >
                        {product.disponible ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            S&iacute;
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            No
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasOverrides && (
        <p className="text-xs text-secondary">
          Los cambios se guardan en el navegador. Us&aacute; &quot;Restaurar originales&quot; para volver a los valores por defecto.
        </p>
      )}
    </div>
  )
}
