'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  FileSpreadsheet,
  Image,
  Package,
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-dark px-3 py-2 rounded-lg hover:bg-bg-alt"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesi&oacute;n
          </button>
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
                Generador de cat&aacute;logos
              </h2>
              <p className="text-secondary text-sm">
                Sub&iacute; un archivo Excel o CSV con tus productos, configur&aacute; los m&aacute;rgenes y gener&aacute; un PDF listo para compartir.
              </p>
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
        {activeTab === 'lookbook' && <LookbookManager />}

        {/* Productos tab */}
        {activeTab === 'productos' && <ProductosTable />}
      </main>
    </div>
  )
}
