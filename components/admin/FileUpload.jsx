'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, X, Loader2 } from 'lucide-react'
import { parseExcelFile } from '@/lib/excel-parser'

export default function FileUpload({ onFileUploaded }) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const processFile = useCallback(
    async (file) => {
      if (!file) return

      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ]
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

      if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
        setError('Formato no soportado. Usá archivos .xlsx o .csv')
        return
      }

      setError('')
      setLoading(true)
      setFileName(file.name)

      try {
        const data = await parseExcelFile(file)
        onFileUploaded(data)
      } catch (err) {
        setError(err.message || 'Error al procesar el archivo')
        setFileName('')
      } finally {
        setLoading(false)
      }
    },
    [onFileUploaded]
  )

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0])
      }
    },
    [processFile]
  )

  const handleChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0])
      }
    },
    [processFile]
  )

  const handleClear = () => {
    setFileName('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full">
      {!fileName && !loading ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            dragActive
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50 hover:bg-bg-alt'
          }`}
        >
          <Upload className="w-10 h-10 text-secondary" />
          <div className="text-center">
            <p className="text-dark font-medium">
              Arrastr&aacute; tu archivo o hac&eacute; click
            </p>
            <p className="text-secondary text-sm mt-1">
              Formatos aceptados: .xlsx, .csv
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-3 p-10 border-2 border-dashed border-accent/30 rounded-xl bg-accent/5">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
          <p className="text-dark font-medium">Procesando {fileName}...</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-bg-alt">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-accent" />
            <div>
              <p className="text-dark font-medium text-sm">{fileName}</p>
              <p className="text-secondary text-xs">Archivo cargado correctamente</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-white text-secondary hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sale text-sm font-medium bg-sale/5 border border-sale/20 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}
    </div>
  )
}
