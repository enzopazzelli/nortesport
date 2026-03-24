import * as XLSX from 'xlsx'

/**
 * Parse an Excel/CSV file and return structured data
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          reject(new Error('El archivo no tiene suficientes datos'))
          return
        }

        const headers = jsonData[0].map((h) => String(h || '').trim())
        const rows = jsonData.slice(1).filter((row) => row.some((cell) => cell != null && cell !== ''))

        resolve({ headers, rows, sheetName })
      } catch (err) {
        reject(new Error('Error al leer el archivo: ' + err.message))
      }
    }

    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Detect columns that contain price data
 */
export function detectPriceColumns(headers) {
  const priceKeywords = ['precio', 'price', 'costo', 'cost', 'valor', 'lista', 'venta', 'mayorista', 'minorista']
  return headers.filter((h) =>
    priceKeywords.some((keyword) => h.toLowerCase().includes(keyword))
  )
}

/**
 * Apply margin to a price
 */
export function applyMargin(price, marginPercent) {
  const numPrice = Number(price)
  if (isNaN(numPrice)) return 0
  return Math.round(numPrice * (1 + marginPercent / 100))
}

/**
 * Format price in ARS
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
