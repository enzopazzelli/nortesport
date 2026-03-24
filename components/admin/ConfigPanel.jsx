'use client'

import { Settings, Columns, Percent, Tag } from 'lucide-react'

export default function ConfigPanel({ headers, priceColumns, config, onConfigChange }) {
  const handleChange = (key, value) => {
    onConfigChange({ ...config, [key]: value })
  }

  const handleMappingChange = (field, value) => {
    onConfigChange({
      ...config,
      columnMapping: { ...config.columnMapping, [field]: value },
    })
  }

  return (
    <div className="w-full border border-border rounded-xl bg-white p-6 space-y-6">
      <div className="flex items-center gap-2 text-dark font-semibold text-lg">
        <Settings className="w-5 h-5 text-accent" />
        Configuraci&oacute;n del cat&aacute;logo
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Price column selector */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-secondary mb-1.5">
            <Tag className="w-4 h-4" />
            Columna de precio
          </label>
          <select
            value={config.priceColumn || ''}
            onChange={(e) => handleChange('priceColumn', e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="">Seleccionar columna...</option>
            {priceColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
            {/* Also allow picking any header as price column */}
            <optgroup label="Todas las columnas">
              {headers
                .filter((h) => !priceColumns.includes(h))
                .map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Margin input */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-secondary mb-1.5">
            <Percent className="w-4 h-4" />
            Margen (%)
          </label>
          <input
            type="number"
            min="0"
            max="500"
            step="1"
            value={config.margin ?? 0}
            onChange={(e) => handleChange('margin', Number(e.target.value))}
            placeholder="Ej: 30"
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        {/* Column mapping: Nombre */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-secondary mb-1.5">
            <Columns className="w-4 h-4" />
            Columna &quot;Nombre&quot;
          </label>
          <select
            value={config.columnMapping?.nombre || ''}
            onChange={(e) => handleMappingChange('nombre', e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="">Seleccionar columna...</option>
            {headers.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Column mapping: Categoría */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-secondary mb-1.5">
            <Columns className="w-4 h-4" />
            Columna &quot;Categor&iacute;a&quot;
          </label>
          <select
            value={config.columnMapping?.categoria || ''}
            onChange={(e) => handleMappingChange('categoria', e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="">Seleccionar columna...</option>
            {headers.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
