'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  FileSpreadsheet,
  Image,
  Package,
  Info,
  Home,
} from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import ConfigPanel from '@/components/admin/ConfigPanel'
import PreviewTable from '@/components/admin/PreviewTable'
import CategoryFilter from '@/components/admin/CategoryFilter'
import PDFGenerator from '@/components/admin/PDFGenerator'
import LookbookManager from '@/components/admin/LookbookManager'
import ProductosTable from '@/components/admin/ProductosTable'
import { detectPriceColumns } from '@/lib/excel-parser'

const TABS = [
  { id: 'catalogos', label: 'Catálogos', icon: FileSpreadsheet },
  { id: 'lookbook', label: 'Lookbook', icon: Image },
  { id: 'productos', label: 'Productos', icon: Package },
]

export default function DashboardPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('catalogos')

  // Catalog state
  const [fileData, setFileData] = useState(null) // { headers, rows, sheetName }
  const [priceColumns, setPriceColumns] = useState([])
  const [config, setConfig] = useState({
    priceColumn: '',
    margin: 0,
    columnMapping: { nombre: '', categoria: '' },
    title: 'Lista de Precios',
  })
  const [categories, setCategories] = useState([])
  const [activeCategories, setActiveCategories] = useState([])

  // Auth check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('authenticated') === 'true'
      if (!isAuth) {
        router.push('/admin')
      } else {
        setAuthenticated(true)
      }
    }
  }, [router])

  // When file is uploaded, detect price columns
  const handleFileUploaded = useCallback((data) => {
    setFileData(data)
    const detected = detectPriceColumns(data.headers)
    setPriceColumns(detected)

    // Auto-select first price column if detected
    setConfig((prev) => ({
      ...prev,
      priceColumn: detected[0] || '',
    }))
  }, [])

  // Extract categories when column mapping changes
  useEffect(() => {
    if (!fileData || !config.columnMapping.categoria) {
      setCategories([])
      setActiveCategories([])
      return
    }

    const catIndex = fileData.headers.indexOf(config.columnMapping.categoria)
    if (catIndex === -1) {
      setCategories([])
      setActiveCategories([])
      return
    }

    const uniqueCats = [
      ...new Set(
        fileData.rows
          .map((row) => String(row[catIndex] || '').trim())
          .filter(Boolean)
      ),
    ].sort()

    setCategories(uniqueCats)
    setActiveCategories(uniqueCats)
  }, [fileData, config.columnMapping.categoria])

  // Build products for PDF
  const getFilteredProducts = useCallback(() => {
    if (!fileData) return []

    const { headers, rows } = fileData
    const catIndex = config.columnMapping.categoria
      ? headers.indexOf(config.columnMapping.categoria)
      : -1

    return rows
      .filter((row) => {
        if (activeCategories.length === 0 || catIndex === -1) return true
        const cat = String(row[catIndex] || '').trim()
        return activeCategories.includes(cat)
      })
      .map((row) => {
        const obj = {}
        headers.forEach((h, i) => {
          obj[h] = row[i] ?? ''
        })
        return obj
      })
  }, [fileData, config.columnMapping.categoria, activeCategories])

  // Get filtered rows for preview
  const getFilteredRows = useCallback(() => {
    if (!fileData) return []

    const { headers, rows } = fileData
    const catIndex = config.columnMapping.categoria
      ? headers.indexOf(config.columnMapping.categoria)
      : -1

    return rows.filter((row) => {
      if (activeCategories.length === 0 || catIndex === -1) return true
      const cat = String(row[catIndex] || '').trim()
      return activeCategories.includes(cat)
    })
  }, [fileData, config.columnMapping.categoria, activeCategories])

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated')
    router.push('/admin')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-alt">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-accent" />
            <h1 className="text-lg font-bold text-dark">
              Norte Sport &mdash; Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-dark px-3 py-2 rounded-lg hover:bg-bg-alt"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Ver tienda</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-dark px-3 py-2 rounded-lg hover:bg-bg-alt"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesi&oacute;n
            </button>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-0">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-secondary hover:text-dark hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Catálogos tab */}
        {activeTab === 'catalogos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-dark mb-1">
                Generador de cat&aacute;logos PDF
              </h2>
              <p className="text-secondary text-sm">
                Sub&iacute; un archivo Excel o CSV con tus productos, configur&aacute; los m&aacute;rgenes y gener&aacute; un PDF listo para compartir.
              </p>
            </div>

            {/* Help guide */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-secondary space-y-2">
                  <p className="font-semibold text-dark">C&oacute;mo usar el generador:</p>
                  <ol className="list-decimal list-inside space-y-1.5 ml-1">
                    <li><strong>Sub&iacute; tu archivo</strong> &mdash; Arrastr&aacute; o seleccion&aacute; un archivo Excel (.xlsx) o CSV con tus productos. El archivo debe tener una fila de encabezados y al menos una columna con precios.</li>
                    <li><strong>Configur&aacute; la lista</strong> &mdash; Eleg&iacute; qu&eacute; columna tiene los precios (se detecta autom&aacute;ticamente). Pod&eacute;s agregar un margen en % que se suma a los precios. Tambi&eacute;n pod&eacute;s mapear las columnas de Nombre y Categor&iacute;a.</li>
                    <li><strong>Filtr&aacute; por categor&iacute;a</strong> &mdash; Si mapeaste la columna de categor&iacute;a, pod&eacute;s elegir qu&eacute; categor&iacute;as incluir en el PDF.</li>
                    <li><strong>Revis&aacute; la preview</strong> &mdash; Verific&aacute; que los datos y precios se vean correctos antes de generar.</li>
                    <li><strong>Gener&aacute; el PDF</strong> &mdash; Click en &quot;Generar PDF&quot; y se descarga autom&aacute;ticamente con el nombre &quot;catalogo-norte-sport-[fecha].pdf&quot;.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step 1: Upload */}
            <FileUpload onFileUploaded={handleFileUploaded} />

            {/* Step 2: Config (only after upload) */}
            {fileData && (
              <>
                <ConfigPanel
                  headers={fileData.headers}
                  priceColumns={priceColumns}
                  config={config}
                  onConfigChange={setConfig}
                />

                {/* Step 3: Category filter */}
                {categories.length > 0 && (
                  <CategoryFilter
                    categories={categories}
                    activeCategories={activeCategories}
                    onChange={setActiveCategories}
                  />
                )}

                {/* Step 4: Preview */}
                <PreviewTable
                  headers={fileData.headers}
                  rows={getFilteredRows()}
                  config={config}
                />

                {/* Step 5: Generate PDF */}
                <div className="border border-border rounded-xl bg-white p-5">
                  <PDFGenerator
                    products={getFilteredProducts()}
                    config={config}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Lookbook tab */}
        {activeTab === 'lookbook' && (
          <div className="space-y-6">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-secondary space-y-2">
                  <p className="font-semibold text-dark">C&oacute;mo gestionar el Lookbook:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li><strong>Reordenar</strong> &mdash; Us&aacute; las flechas arriba/abajo a la izquierda de cada item para cambiar el orden en que aparecen en la p&aacute;gina.</li>
                    <li><strong>Editar</strong> &mdash; Pas&aacute; el mouse sobre un item y hac&eacute; click en el l&aacute;piz para cambiar el t&iacute;tulo, badge o tama&ntilde;o en el grid.</li>
                    <li><strong>Tama&ntilde;os disponibles</strong> &mdash; <em>Normal</em> (1x1), <em>Grande</em> (2x2, ideal para fotos destacadas), <em>Horizontal</em> (2x1, para fotos panor&aacute;micas).</li>
                    <li><strong>Agregar manualmente</strong> &mdash; Pod&eacute;s agregar nuevos looks con una URL de imagen, t&iacute;tulo y badge opcional.</li>
                    <li><strong>Preview</strong> &mdash; Click en &quot;Ver preview&quot; para ver c&oacute;mo queda el grid masonry antes de guardarlo.</li>
                    <li><strong>Restaurar</strong> &mdash; Si quer&eacute;s volver a los valores originales, click en &quot;Restaurar&quot;. Los cambios se guardan en el navegador.</li>
                  </ul>
                </div>
              </div>
            </div>
            <LookbookManager />
          </div>
        )}

        {/* Productos tab */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-secondary space-y-2">
                  <p className="font-semibold text-dark">C&oacute;mo gestionar los productos:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li><strong>Editar precio</strong> &mdash; Hac&eacute; click sobre el precio de cualquier producto para editarlo. Presion&aacute; <em>Enter</em> para guardar o <em>Escape</em> para cancelar.</li>
                    <li><strong>Disponibilidad</strong> &mdash; Hac&eacute; click en el bot&oacute;n &quot;S&iacute;/No&quot; para activar o desactivar un producto. Los desactivados no se muestran en la tienda.</li>
                    <li><strong>Cambios locales</strong> &mdash; Los cambios se guardan en el navegador (localStorage). Cuando conectes Google Sheets, los datos se sincronizar&aacute;n desde la hoja de c&aacute;lculo.</li>
                    <li><strong>Restaurar</strong> &mdash; Si aparece el bot&oacute;n &quot;Restaurar originales&quot;, significa que hay cambios guardados. Click para volver a los valores por defecto.</li>
                  </ul>
                </div>
              </div>
            </div>
            <ProductosTable />
          </div>
        )}
      </main>
    </div>
  )
}
