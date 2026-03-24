import { SHEET_ID } from './admin'
import { productos, testimonios, lookbookItems, temporadaActual, promos } from './defaults'

const SHEETS_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=`

async function fetchSheet(sheetName) {
  try {
    const res = await fetch(`${SHEETS_BASE}${encodeURIComponent(sheetName)}`, {
      next: { revalidate: 300 },
    })
    const text = await res.text()
    const json = JSON.parse(text.substring(47).slice(0, -2))
    const headers = json.table.cols.map((col) => col.label)
    const rows = json.table.rows.map((row) =>
      Object.fromEntries(
        headers.map((header, i) => [header, row.c[i]?.v ?? null])
      )
    )
    return rows
  } catch {
    return null
  }
}

export async function getProductos() {
  const rows = await fetchSheet('Productos')
  if (!rows) return productos

  return rows
    .filter((row) => row.Disponible !== false && row.Disponible !== 'FALSE')
    .map((row) => ({
      id: row.ID,
      nombre: row.Nombre,
      categoria: row.Categoria,
      descripcion: row.Descripcion,
      precio: Number(row.Precio),
      precioAnterior: row.PrecioAnterior ? Number(row.PrecioAnterior) : null,
      talles: row.Talles ? row.Talles.split(',').map((t) => t.trim()) : [],
      badge: row.Badge || null,
      imagenes: row.ImagenURL ? row.ImagenURL.split('|').map((u) => u.trim()).filter(Boolean) : [],
      placeholder: `linear-gradient(135deg, #2B3A52, #6B7B8D)`,
      stock: row.Stock != null ? Number(row.Stock) : null,
      disponible: true,
    }))
    .sort((a, b) => (a.orden || 0) - (b.orden || 0))
}

export async function getTestimonios() {
  const rows = await fetchSheet('Testimonios')
  if (!rows) return testimonios

  return rows.map((row) => ({
    id: row.ID,
    nombre: row.Nombre,
    texto: row.Texto,
    estrellas: Number(row.Estrellas) || 5,
  }))
}

export async function getLookbook() {
  const rows = await fetchSheet('Lookbook')
  if (!rows) return lookbookItems

  return rows.map((row) => ({
    id: row.ID,
    titulo: row.Titulo,
    badge: row.Badge || null,
    tamano: (row['Tamaño'] || 'normal').toLowerCase(),
    imagenUrl: row.ImagenURL || null,
    placeholder: `linear-gradient(135deg, #2B3A52, #6B7B8D)`,
  }))
}

export async function getConfig() {
  const rows = await fetchSheet('Config')
  if (!rows) return { temporada: temporadaActual, promos }

  const config = Object.fromEntries(rows.map((row) => [row.Clave, row.Valor]))

  return {
    temporada: {
      nombre: config.temporadaNombre || temporadaActual.nombre,
      color: config.temporadaColor || temporadaActual.color,
      colorNombre: config.temporadaColorNombre || temporadaActual.colorNombre,
      emoji: config.temporadaEmoji || temporadaActual.emoji,
    },
    promos: config.promos ? config.promos.split('|').map((p) => p.trim()) : promos,
  }
}
