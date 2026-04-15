// =============================================
// Sync helpers — envían cambios del admin al webhook
// de Apps Script vía /api/sync (que agrega el token).
//
// Mapea los nombres internos de los objetos del cliente
// a los headers exactos de las hojas de Google Sheets.
// =============================================

const PRODUCT_FIELD_MAP = {
  nombre: 'Nombre',
  categoria: 'Categoria',
  descripcion: 'Descripcion',
  precio: 'Precio',
  precioAnterior: 'PrecioAnterior',
  badge: 'Badge',
  stock: 'Stock',
  disponible: 'Disponible',
}

const LOOKBOOK_FIELD_MAP = {
  titulo: 'Titulo',
  badge: 'Badge',
  tamano: 'Tamaño',
  imagenUrl: 'ImagenURL',
  imageUrl: 'ImagenURL',
}

function mapKeys(changes, map) {
  const out = {}
  for (const [k, v] of Object.entries(changes || {})) {
    const mapped = map[k]
    if (mapped) out[mapped] = v
  }
  return out
}

async function callSync(payload) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({ ok: false, error: 'bad_json' }))
    if (!data.ok) {
      console.warn('[sync] failed:', data.error || res.status, payload.action)
    }
    return data
  } catch (err) {
    console.warn('[sync] network error:', err)
    return { ok: false, error: String(err) }
  }
}

export function syncProductUpdate(id, changes) {
  const mapped = mapKeys(changes, PRODUCT_FIELD_MAP)
  if (Object.keys(mapped).length === 0) {
    return Promise.resolve({ ok: true, skipped: true })
  }
  return callSync({ action: 'update_product', id, changes: mapped })
}

export function syncLookbookUpdate(id, changes) {
  const mapped = mapKeys(changes, LOOKBOOK_FIELD_MAP)
  if (Object.keys(mapped).length === 0) {
    return Promise.resolve({ ok: true, skipped: true })
  }
  return callSync({ action: 'update_lookbook', id, changes: mapped })
}

export function syncLookbookAdd(item) {
  const mapped = mapKeys(item, LOOKBOOK_FIELD_MAP)
  return callSync({ action: 'add_lookbook', item: mapped })
}

export function syncLookbookDelete(id) {
  return callSync({ action: 'delete_lookbook', id })
}

export function syncLookbookReorder(order) {
  return callSync({ action: 'reorder_lookbook', order })
}
