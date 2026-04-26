'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  FileDown,
  Loader2,
  CheckCircle,
  Search,
  AlertCircle,
  Eye,
} from 'lucide-react'
import {
  generateCatalogPDF,
  MODE_PUBLIC,
  MODE_WHOLESALE,
} from '@/lib/catalog-pdf'
import { adminConfig } from '@/lib/admin'

const BADGE_OPTIONS = ['NUEVO', 'SALE', 'ÚLTIMAS', 'Sin badge']

const DEFAULT_CONFIG = {
  mode: MODE_PUBLIC,
  title: '',
  includeCover: true,
  includeContact: true,
  mayoristaDescuento: adminConfig.catalog.mayoristaDescuentoDefault,
  estado: 'disponibles', // 'todos' | 'disponibles'
}

export default function CatalogBuilder() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [activeCategorias, setActiveCategorias] = useState([])
  const [activeBadges, setActiveBadges] = useState([...BADGE_OPTIONS])
  const [search, setSearch] = useState('')
  const [excludedIds, setExcludedIds] = useState(new Set())
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState({ step: '', current: 0, total: 0 })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Cargar productos desde Sheets
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.productos?.length) {
          setProducts(data.productos)
          // Default: título con la temporada actual
          if (data.config?.temporada?.nombre && !config.title) {
            setConfig((prev) => ({
              ...prev,
              title: `Catálogo ${data.config.temporada.nombre}`,
            }))
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categorias = useMemo(
    () => [...new Set(products.map((p) => p.categoria).filter(Boolean))].sort(),
    [products]
  )

  // Set categorias por defecto cuando se cargan los productos
  useEffect(() => {
    if (categorias.length > 0 && activeCategorias.length === 0) {
      setActiveCategorias([...categorias])
    }
  }, [categorias, activeCategorias.length])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((p) => {
      // Excluidos manualmente
      if (excludedIds.has(p.id)) return false
      // Categoría
      if (activeCategorias.length > 0 && !activeCategorias.includes(p.categoria)) return false
      // Estado
      if (config.estado === 'disponibles' && p.stock != null && p.stock <= 0) return false
      // Badge
      const badgeKey = p.badge || 'Sin badge'
      if (!activeBadges.includes(badgeKey)) return false
      // Búsqueda
      if (term) {
        const haystack = `${p.nombre || ''} ${p.categoria || ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [products, excludedIds, activeCategorias, activeBadges, config.estado, search])

  const previewProducts = useMemo(() => {
    // En el preview mostramos TODOS los del filtro (incluso excluidos manualmente)
    const term = search.trim().toLowerCase()
    return products.filter((p) => {
      if (activeCategorias.length > 0 && !activeCategorias.includes(p.categoria)) return false
      if (config.estado === 'disponibles' && p.stock != null && p.stock <= 0) return false
      const badgeKey = p.badge || 'Sin badge'
      if (!activeBadges.includes(badgeKey)) return false
      if (term) {
        const haystack = `${p.nombre || ''} ${p.categoria || ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [products, activeCategorias, activeBadges, config.estado, search])

  const toggleCategoria = (cat) => {
    setActiveCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const toggleBadge = (b) => {
    setActiveBadges((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    )
  }

  const toggleExcluded = (id) => {
    setExcludedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleGenerate = async () => {
    if (filtered.length === 0) {
      setError('No hay productos seleccionados para el catálogo.')
      return
    }
    setGenerating(true)
    setError(null)
    setSuccess(false)
    setProgress({ step: 'Iniciando...', current: 0, total: filtered.length + 2 })

    try {
      const doc = await generateCatalogPDF({
        products: filtered,
        options: {
          mode: config.mode,
          title: config.title || `Catálogo ${new Date().getFullYear()}`,
          includeCover: config.includeCover,
          includeContact: config.includeContact,
          mayoristaDescuento: Number(config.mayoristaDescuento) || 0,
        },
        onProgress: setProgress,
      })

      // Abrir en nueva pestaña como blob
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      // Limpieza del URL después de un rato
      setTimeout(() => URL.revokeObjectURL(url), 60000)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      console.error('Error generando catálogo:', err)
      setError(err?.message || 'Error desconocido al generar el PDF')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (filtered.length === 0) {
      setError('No hay productos seleccionados para el catálogo.')
      return
    }
    setGenerating(true)
    setError(null)
    setSuccess(false)
    setProgress({ step: 'Iniciando...', current: 0, total: filtered.length + 2 })

    try {
      const doc = await generateCatalogPDF({
        products: filtered,
        options: {
          mode: config.mode,
          title: config.title || `Catálogo ${new Date().getFullYear()}`,
          includeCover: config.includeCover,
          includeContact: config.includeContact,
          mayoristaDescuento: Number(config.mayoristaDescuento) || 0,
        },
        onProgress: setProgress,
      })
      const today = new Date().toISOString().split('T')[0]
      const suffix = config.mode === MODE_WHOLESALE ? '-mayorista' : ''
      doc.save(`catalogo-norte-sport${suffix}-${today}.pdf`)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      console.error('Error generando catálogo:', err)
      setError(err?.message || 'Error desconocido al generar el PDF')
    } finally {
      setGenerating(false)
    }
  }

  if (loadingProducts) {
    return (
      <div className="flex items-center gap-3 text-secondary">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando productos...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <section className="border border-border rounded-xl bg-white p-5 space-y-5">
        <h3 className="text-base font-semibold text-dark">Configuración del catálogo</h3>

        {/* Modo */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Modo</label>
          <div className="flex flex-wrap gap-2">
            <ModeOption
              checked={config.mode === MODE_PUBLIC}
              onClick={() => setConfig((c) => ({ ...c, mode: MODE_PUBLIC }))}
              title="Público"
              description="Para clientes finales. Precios de venta al público."
            />
            <ModeOption
              checked={config.mode === MODE_WHOLESALE}
              onClick={() => setConfig((c) => ({ ...c, mode: MODE_WHOLESALE }))}
              title="Mayorista"
              description="Para revendedores. Precios con descuento, stock y código."
            />
          </div>
        </div>

        {/* Título + descuento mayorista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Título</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
              placeholder="Catálogo Otoño 2026"
              className="input"
            />
          </div>
          {config.mode === MODE_WHOLESALE && (
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Descuento mayorista (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={config.mayoristaDescuento}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, mayoristaDescuento: e.target.value }))
                }
                className="input"
              />
            </div>
          )}
        </div>

        {/* Toggles portada/contacto */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-dark cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeCover}
              onChange={(e) => setConfig((c) => ({ ...c, includeCover: e.target.checked }))}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
            />
            Incluir página de portada
          </label>
          <label className="flex items-center gap-2 text-sm text-dark cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeContact}
              onChange={(e) =>
                setConfig((c) => ({ ...c, includeContact: e.target.checked }))
              }
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
            />
            Incluir página de contacto
          </label>
        </div>
      </section>

      {/* Filtros */}
      <section className="border border-border rounded-xl bg-white p-5 space-y-5">
        <h3 className="text-base font-semibold text-dark">Productos a incluir</h3>

        {/* Categorías */}
        {categorias.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => {
                const active = activeCategorias.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategoria(cat)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-secondary border-border hover:border-accent/40'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Estado</label>
          <div className="flex flex-wrap gap-2">
            {[
              { val: 'disponibles', label: 'Solo disponibles' },
              { val: 'todos', label: 'Todos' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setConfig((c) => ({ ...c, estado: opt.val }))}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  config.estado === opt.val
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-secondary border-border hover:border-accent/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badge */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Badge</label>
          <div className="flex flex-wrap gap-2">
            {BADGE_OPTIONS.map((b) => {
              const active = activeBadges.includes(b)
              return (
                <button
                  key={b}
                  onClick={() => toggleBadge(b)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-secondary border-border hover:border-accent/40'
                  }`}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Búsqueda</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="input pl-9"
            />
          </div>
        </div>

        <div className="text-sm text-secondary pt-1">
          <span className="font-semibold text-dark">{filtered.length}</span> producto
          {filtered.length !== 1 ? 's' : ''} seleccionado{filtered.length !== 1 ? 's' : ''}
          {excludedIds.size > 0 && (
            <span className="text-secondary/70">
              {' '}
              · {excludedIds.size} excluido{excludedIds.size !== 1 ? 's' : ''} manualmente
            </span>
          )}
        </div>
      </section>

      {/* Preview lista */}
      {previewProducts.length > 0 && (
        <section className="border border-border rounded-xl bg-white p-5 space-y-3">
          <h3 className="text-base font-semibold text-dark">
            Lista de productos ({previewProducts.length})
          </h3>
          <p className="text-xs text-secondary">
            Click en un producto para excluirlo/incluirlo del catálogo final.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
            {previewProducts.map((p) => {
              const excluded = excludedIds.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleExcluded(p.id)}
                  className={`text-left flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                    excluded
                      ? 'border-border bg-bg-alt opacity-50'
                      : 'border-border hover:border-accent/40 bg-white'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded shrink-0"
                    style={{
                      background: p.imagenes?.[0] ? '#F0F2F5' : p.placeholder || '#E5E7EB',
                      backgroundImage: p.imagenes?.[0] ? `url(${p.imagenes[0]})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-dark truncate">{p.nombre}</p>
                    <p className="text-xs text-secondary truncate">
                      {p.categoria} · ${(p.precio || 0).toLocaleString('es-AR')}
                      {excluded && ' · Excluido'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Generar */}
      <section className="border border-border rounded-xl bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating || filtered.length === 0}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Generar y previsualizar
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={generating || filtered.length === 0}
            className="flex items-center gap-2 border border-border text-dark hover:bg-bg-alt disabled:opacity-50 font-medium py-3 px-5 rounded-lg transition-colors"
          >
            <FileDown className="w-5 h-5" />
            Descargar directo
          </button>
          {success && !generating && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle className="w-5 h-5" />
              Catálogo listo
            </div>
          )}
        </div>

        {generating && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">{progress.step}</p>
              {progress.total > 0 && (
                <div className="mt-2 h-1.5 bg-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${progress.total > 0 ? Math.min(100, (progress.current / progress.total) * 100) : 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-sale/5 border border-sale/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sale shrink-0 mt-0.5" />
            <div className="text-sm text-sale">{error}</div>
          </div>
        )}
      </section>
    </div>
  )
}

function ModeOption({ checked, onClick, title, description }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[200px] text-left border-2 rounded-xl p-4 transition-colors ${
        checked
          ? 'border-accent bg-accent/5'
          : 'border-border bg-white hover:border-accent/40'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            checked ? 'border-accent bg-accent' : 'border-border bg-white'
          }`}
        >
          {checked && (
            <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[3px]" />
          )}
        </div>
        <span className="font-semibold text-dark">{title}</span>
      </div>
      <p className="text-xs text-secondary ml-6">{description}</p>
    </button>
  )
}
