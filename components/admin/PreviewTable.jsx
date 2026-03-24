'use client'

import { useState, useEffect } from 'react'
import { Table, AlertCircle, CheckSquare, Square, MinusSquare } from 'lucide-react'
import { applyMargin, formatPrice } from '@/lib/excel-parser'

const MAX_PREVIEW_ROWS = 50

export default function PreviewTable({ headers, rows, config, onSelectionChange }) {
  const { priceColumn, margin } = config
  const [selected, setSelected] = useState(new Set())

  // Select all rows by default when rows change
  useEffect(() => {
    if (rows && rows.length > 0) {
      const allIndexes = new Set(rows.map((_, i) => i))
      setSelected(allIndexes)
    } else {
      setSelected(new Set())
    }
  }, [rows])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selected)
  }, [selected, onSelectionChange])

  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10 border border-border rounded-xl bg-bg-alt text-secondary">
        <AlertCircle className="w-8 h-8" />
        <p className="font-medium">No hay datos para mostrar</p>
      </div>
    )
  }

  const rowObjects = rows.map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? ''
    })
    return obj
  })

  const previewRows = rowObjects.slice(0, MAX_PREVIEW_ROWS)
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

  const toggleRow = (index) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(rows.map((_, i) => i)))
    }
  }

  const allSelected = selected.size === rows.length
  const someSelected = selected.size > 0 && selected.size < rows.length

  const SelectIcon = allSelected ? CheckSquare : someSelected ? MinusSquare : Square

  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-5 py-3 bg-bg-alt border-b border-border">
        <div className="flex items-center gap-2 text-dark font-semibold">
          <Table className="w-5 h-5 text-accent" />
          Vista previa
        </div>
        <div className="flex items-center gap-3">
          <span className="text-accent text-sm font-medium">
            {selected.size} de {rows.length} seleccionados
          </span>
          <span className="text-secondary text-sm">
            {rows.length > MAX_PREVIEW_ROWS
              ? `Mostrando ${MAX_PREVIEW_ROWS} de ${rows.length} filas`
              : `${rows.length} filas`}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="px-3 py-3 w-10">
                <button
                  onClick={toggleAll}
                  className="text-secondary hover:text-accent transition-colors"
                  title={allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                >
                  <SelectIcon className="w-5 h-5" />
                </button>
              </th>
              {headers.map((h) => (
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
            {previewRows.map((row, i) => {
              const isSelected = selected.has(i)
              return (
                <tr
                  key={i}
                  onClick={() => toggleRow(i)}
                  className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                    !isSelected
                      ? 'bg-gray-50 opacity-50'
                      : i % 2 === 1
                        ? 'bg-bg-alt/50 hover:bg-accent/5'
                        : 'hover:bg-accent/5'
                  }`}
                >
                  <td className="px-3 py-3 w-10">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-accent" />
                    ) : (
                      <Square className="w-5 h-5 text-secondary/40" />
                    )}
                  </td>
                  {headers.map((h) => (
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
