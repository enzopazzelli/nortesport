'use client'

import { useState } from 'react'
import { FileDown, Loader2, CheckCircle } from 'lucide-react'
import { generateCatalogPDF } from '@/lib/pdf-generator'

export default function PDFGenerator({ products, config }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleGenerate = async () => {
    if (!products || products.length === 0) return

    setLoading(true)
    setSuccess(false)

    try {
      // Small delay so UI updates
      await new Promise((r) => setTimeout(r, 100))

      const doc = generateCatalogPDF({
        products,
        priceColumn: config.priceColumn,
        margin: config.margin,
        columnMapping: config.columnMapping,
        title: config.title || 'Lista de Precios',
      })

      const today = new Date().toISOString().split('T')[0]
      doc.save(`catalogo-norte-sport-${today}.pdf`)
      setSuccess(true)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Error al generar el PDF: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const disabled = loading || !products || products.length === 0

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleGenerate}
        disabled={disabled}
        className="flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            Generar PDF
          </>
        )}
      </button>

      {success && (
        <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <CheckCircle className="w-5 h-5" />
          PDF descargado
        </div>
      )}

      {products && products.length > 0 && (
        <span className="text-secondary text-sm">
          {products.length} producto{products.length !== 1 ? 's' : ''} a incluir
        </span>
      )}
    </div>
  )
}
