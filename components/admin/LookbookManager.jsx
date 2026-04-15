'use client'

import { useState, useEffect } from 'react'
import {
  Image,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  X,
  Plus,
  RotateCcw,
  GripVertical,
  Eye,
} from 'lucide-react'
import { lookbookItems as defaultItems } from '@/lib/defaults'
import { syncLookbookAdd, syncLookbookReorder, syncLookbookUpdate } from '@/lib/sync'

const STORAGE_KEY = 'norte_lookbook_overrides'
const ORDER_KEY = 'norte_lookbook_order'

const SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'grande', label: 'Grande' },
  { value: 'horizontal', label: 'Horizontal' },
]

function getStoredData() {
  if (typeof window === 'undefined') return { overrides: {}, order: null }
  try {
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const order = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null')
    return { overrides, order }
  } catch {
    return { overrides: {}, order: null }
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

function saveOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order))
}

export default function LookbookManager() {
  const [items, setItems] = useState([])
  const [overrides, setOverrides] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ url: '', titulo: '', badge: '', tamano: 'normal' })
  const [showPreview, setShowPreview] = useState(false)

  const applyOverridesAndOrder = (baseItems, stored, order) => {
    // Merge base items with overrides
    let merged = baseItems.map((item) => ({
      ...item,
      ...(stored[item.id] || {}),
    }))

    // Add any custom items from overrides
    const baseIds = baseItems.map((i) => i.id)
    const customItems = Object.entries(stored)
      .filter(([id]) => !baseIds.includes(Number(id)))
      .map(([id, data]) => ({ id: Number(id), ...data }))
    merged = [...merged, ...customItems]

    // Apply order if saved
    if (order && Array.isArray(order)) {
      const ordered = []
      order.forEach((id) => {
        const found = merged.find((i) => i.id === id)
        if (found) ordered.push(found)
      })
      merged.forEach((item) => {
        if (!order.includes(item.id)) ordered.push(item)
      })
      merged = ordered
    }

    return merged
  }

  // Load items on mount, then fetch Sheets data
  useEffect(() => {
    const { overrides: stored, order } = getStoredData()
    setOverrides(stored)

    // Show defaults immediately
    setItems(applyOverridesAndOrder(defaultItems, stored, order))

    // Then fetch Sheets data
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.lookbook?.length) {
          const { overrides: freshOverrides, order: freshOrder } = getStoredData()
          setItems(applyOverridesAndOrder(data.lookbook, freshOverrides, freshOrder))
        }
      })
      .catch(() => {})
  }, [])

  const persistItems = (newItems, newOverrides) => {
    setItems(newItems)
    setOverrides(newOverrides)
    saveOverrides(newOverrides)
    saveOrder(newItems.map((i) => i.id))
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const newItems = [...items]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    setItems(newItems)
    const order = newItems.map((i) => i.id)
    saveOrder(order)
    syncLookbookReorder(order)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditForm({
      titulo: item.titulo || '',
      badge: item.badge || '',
      tamano: item.tamano || 'normal',
    })
  }

  const saveEdit = (id) => {
    const newOverrides = {
      ...overrides,
      [id]: { ...(overrides[id] || {}), ...editForm },
    }
    const newItems = items.map((item) =>
      item.id === id ? { ...item, ...editForm } : item
    )
    persistItems(newItems, newOverrides)
    setEditingId(null)
    syncLookbookUpdate(id, editForm)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleAdd = async () => {
    if (!addForm.titulo.trim()) return

    const maxId = items.reduce((max, i) => Math.max(max, i.id), 0)
    const tempId = maxId + 1
    const newItem = {
      id: tempId,
      titulo: addForm.titulo.trim(),
      badge: addForm.badge.trim() || null,
      tamano: addForm.tamano,
      placeholder:
        addForm.url.trim() ||
        `linear-gradient(135deg, #${Math.random().toString(16).slice(2, 8)}, #${Math.random().toString(16).slice(2, 8)})`,
      imageUrl: addForm.url.trim() || null,
    }

    const newOverrides = { ...overrides, [tempId]: newItem }
    const newItems = [...items, newItem]
    persistItems(newItems, newOverrides)
    setAddForm({ url: '', titulo: '', badge: '', tamano: 'normal' })
    setShowAddForm(false)

    const result = await syncLookbookAdd(newItem)
    if (result?.ok && result.id != null && result.id !== tempId) {
      const realId = result.id
      const remappedOverrides = { ...newOverrides }
      delete remappedOverrides[tempId]
      remappedOverrides[realId] = { ...newItem, id: realId }
      const remappedItems = newItems.map((i) =>
        i.id === tempId ? { ...i, id: realId } : i
      )
      persistItems(remappedItems, remappedOverrides)
    }
  }

  const handleRestore = () => {
    if (!confirm('Esto restaura los items del lookbook a los valores originales. ¿Continuar?')) return
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ORDER_KEY)
    setOverrides({})
    setItems([...defaultItems])
  }

  // Size classes for preview
  const getSizeClasses = (tamano) => {
    switch (tamano) {
      case 'grande':
        return 'col-span-1 row-span-2'
      case 'horizontal':
        return 'col-span-2 row-span-1'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark font-semibold text-lg">
          <Image className="w-5 h-5 text-accent" />
          Lookbook ({items.length} items)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 px-3 py-2 rounded-lg hover:bg-accent/5 border border-accent/20"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Ocultar preview' : 'Ver preview'}
          </button>
          <button
            onClick={handleRestore}
            className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-dark px-3 py-2 rounded-lg hover:bg-bg-alt border border-border"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </button>
        </div>
      </div>

      {/* Items grid */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border border-border rounded-xl bg-white hover:border-accent/20 group"
          >
            {/* Grip + order buttons */}
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <button
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="p-0.5 rounded text-secondary hover:text-dark disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <GripVertical className="w-4 h-4 text-border" />
              <button
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="p-0.5 rounded text-secondary hover:text-dark disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail */}
            <div
              className="w-16 h-16 rounded-lg shrink-0"
              style={{ background: item.placeholder || '#E5E7EB' }}
            />

            {/* Content */}
            {editingId === item.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                  placeholder="Título"
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <input
                  type="text"
                  value={editForm.badge}
                  onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                  placeholder="Badge (opcional)"
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <select
                  value={editForm.tamano}
                  onChange={(e) => setEditForm({ ...editForm, tamano: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-dark font-medium text-sm truncate">{item.titulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.badge && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-xs text-secondary capitalize">
                    {item.tamano || 'normal'}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 rounded-lg text-secondary hover:bg-bg-alt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-lg text-secondary hover:text-accent hover:bg-accent/5 opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAddForm ? (
        <div className="border border-accent/20 rounded-xl bg-accent/5 p-5 space-y-4">
          <p className="text-dark font-semibold text-sm">Agregar manualmente</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={addForm.url}
              onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
              placeholder="URL de imagen (opcional)"
              className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              type="text"
              value={addForm.titulo}
              onChange={(e) => setAddForm({ ...addForm, titulo: e.target.value })}
              placeholder="Título *"
              className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              type="text"
              value={addForm.badge}
              onChange={(e) => setAddForm({ ...addForm, badge: e.target.value })}
              placeholder="Badge (opcional)"
              className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <select
              value={addForm.tamano}
              onChange={(e) => setAddForm({ ...addForm, tamano: e.target.value })}
              className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={!addForm.titulo.trim()}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-medium text-sm py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-secondary hover:text-dark text-sm font-medium py-2 px-4 rounded-lg hover:bg-bg-alt"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 px-3 py-2 rounded-lg hover:bg-accent/5 border border-dashed border-accent/30"
        >
          <Plus className="w-4 h-4" />
          Agregar manualmente
        </button>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="border border-border rounded-xl bg-bg-alt p-5 space-y-4">
          <p className="text-dark font-semibold text-sm">Preview del masonry grid</p>
          <div className="grid grid-cols-4 auto-rows-[120px] gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl relative overflow-hidden ${getSizeClasses(item.tamano)}`}
                style={{ background: item.placeholder || '#E5E7EB' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold truncate">
                    {item.titulo}
                  </p>
                  {item.badge && (
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full mt-1 inline-block">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
