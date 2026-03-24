'use client'

import { Table, AlertCircle } from 'lucide-react'
import { applyMargin, formatPrice } from '@/lib/excel-parser'

const MAX_PREVIEW_ROWS = 20

export default function PreviewTable({ headers, rows, config }) {
  const { priceColumn, margin, columnMapping } = config

  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10 border border-border rounded-xl bg-bg-alt text-secondary">
        <AlertCircle className="w-8 h-8" />
        <p className="font-medium">No hay datos para mostrar</p>
      </div>
    )
  }

  // Build row objects from arrays
  const rowObjects = rows.map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? ''
    })
    return obj
  })

  const previewRows = rowObjects.slice(0, MAX_PREVIEW_ROWS)

  // Determine which columns to show
  const displayHeaders = headers.filter((h) => {
    // Always show mapped columns and price column, plus a few more for context
    return true
  })

  const isPriceColumn = (header) => header === priceColumn

  const getCellValue = (row, header) => {
    const value = row[header]
    if (isPriceColumn(header) && margin > 0) {
      const withMargin = applyMargin(value, margin)
      return withMargin > 0 ? formatPrice(withMargin) : String(value ?? '')
    }
    if (isPriceColumn(header)) {
      const num = Number(value)
      return !isNaN(num) && num > 0 ? formatPrice(num) : String(value ?? '')
    }
    return String(value ?? '')
  }

  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-5 py-3 bg-bg-alt border-b border-border">
        <div className="flex items-center gap-2 text-dark font-semibold">
          <Table className="w-5 h-5 text-accent" />
          Vista previa
        </div>
        <span className="text-secondary text-sm">
          Mostrando {Math.min(MAX_PREVIEW_ROWS, rows.length)} de {rows.length} filas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              {displayHeaders.map((h) => (
                <th
                  key={h}
                  className={`text-left px-4 py-3 font-semibold text-secondary whitespace-nowrap ${
                    isPriceColumn(h) ? 'text-accent' : ''
                  }`}
                >
                  {h}
                  {isPriceColumn(h) && margin > 0 && (
                    <span className="ml-1 text-xs text-accent font-normal">
                      (+{margin}%)
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-border last:border-b-0 ${
                  i % 2 === 1 ? 'bg-bg-alt/50' : ''
                }`}
              >
                {displayHeaders.map((h) => (
                  <td
                    key={h}
                    className={`px-4 py-3 text-dark whitespace-nowrap ${
                      isPriceColumn(h) ? 'font-semibold text-accent' : ''
                    }`}
                  >
                    {getCellValue(row, h)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
