// =============================================
// Admin overrides — lee ediciones del admin desde localStorage
// y las aplica sobre los datos que vienen de Google Sheets.
//
// Cuando APPS_SCRIPT_URL/TOKEN están configurados, el admin
// también sincroniza los cambios a Sheets vía /api/sync (ver
// APPS-SCRIPT-SETUP.md). En ese flujo el localStorage queda
// como cache optimista hasta que la próxima fetch trae los
// datos ya actualizados desde Sheets.
// =============================================

export const PRODUCTOS_OVERRIDES_KEY = 'norte_productos_overrides'
export const LOOKBOOK_OVERRIDES_KEY = 'norte_lookbook_overrides'
export const LOOKBOOK_ORDER_KEY = 'norte_lookbook_order'

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function applyProductOverrides(productos) {
  if (!Array.isArray(productos) || productos.length === 0) return productos
  const overrides = readJSON(PRODUCTOS_OVERRIDES_KEY, {})
  if (!overrides || Object.keys(overrides).length === 0) return productos
  return productos.map((p) => ({ ...p, ...(overrides[p.id] || {}) }))
}

export function applyLookbookOverrides(items) {
  if (!Array.isArray(items)) return items
  const overrides = readJSON(LOOKBOOK_OVERRIDES_KEY, {})
  const order = readJSON(LOOKBOOK_ORDER_KEY, null)

  const hasOverrides = overrides && Object.keys(overrides).length > 0
  const hasOrder = Array.isArray(order) && order.length > 0
  if (!hasOverrides && !hasOrder) return items

  // Merge base items with overrides
  let merged = items.map((item) => ({ ...item, ...(overrides[item.id] || {}) }))

  // Add any custom items that don't exist in the base list
  const baseIds = items.map((i) => i.id)
  const customItems = Object.entries(overrides)
    .filter(([id]) => !baseIds.includes(Number(id)))
    .map(([id, data]) => ({ id: Number(id), ...data }))
  merged = [...merged, ...customItems]

  // Apply saved order
  if (hasOrder) {
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
