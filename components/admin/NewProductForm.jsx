'use client'

import { useState, useRef } from 'react'
import { Plus, X, Upload, Loader2, AlertCircle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { syncImageUpload, syncProductAdd } from '@/lib/sync'

const MAX_IMAGES = 6

const BADGE_OPTIONS = [
  { value: '', label: 'Sin badge' },
  { value: 'NUEVO', label: 'NUEVO' },
  { value: 'SALE', label: 'SALE' },
  { value: 'ÚLTIMAS', label: 'ÚLTIMAS' },
]

const EMPTY_FORM = {
  nombre: '',
  categoria: '',
  descripcion: '',
  precio: '',
  precioAnterior: '',
  talles: '',
  badge: '',
  stock: '',
  disponible: true,
}

export default function NewProductForm({ isOpen, onClose, categorias = [], onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([]) // [{ file, previewUrl }]
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ step: '', current: 0, total: 0 })
  const [submitError, setSubmitError] = useState(null)
  const fileInputRef = useRef(null)

  const reset = () => {
    setForm(EMPTY_FORM)
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.previewUrl))
      return []
    })
    setErrors({})
    setSubmitError(null)
    setProgress({ step: '', current: 0, total: 0 })
  }

  const handleClose = () => {
    if (submitting) return
    reset()
    onClose()
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const handleFiles = (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (list.length === 0) return

    const remainingSlots = MAX_IMAGES - images.length
    const toAdd = list.slice(0, remainingSlots).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...toAdd])
  }

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const validate = () => {
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'Requerido'
    if (!form.categoria.trim()) next.categoria = 'Requerido'
    if (!form.precio || Number(form.precio) <= 0) next.precio = 'Precio inválido'
    if (form.precioAnterior && Number(form.precioAnterior) <= Number(form.precio)) {
      next.precioAnterior = 'Debe ser mayor al precio actual'
    }
    if (form.stock !== '' && Number(form.stock) < 0) next.stock = 'No puede ser negativo'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)
    setProgress({ step: 'preparando', current: 0, total: images.length })

    try {
      // 1. Upload images sequentially
      const imageUrls = []
      for (let i = 0; i < images.length; i++) {
        setProgress({
          step: `Subiendo imagen ${i + 1} de ${images.length}...`,
          current: i,
          total: images.length,
        })
        const result = await syncImageUpload(images[i].file)
        if (!result?.ok || !result.url) {
          throw new Error(
            `Falló la subida de la imagen ${i + 1}: ${result?.error || 'error desconocido'}`
          )
        }
        imageUrls.push(result.url)
      }

      // 2. Create product
      setProgress({
        step: 'Creando producto...',
        current: images.length,
        total: images.length,
      })
      const product = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : '',
        talles: form.talles.trim(),
        badge: form.badge,
        stock: form.stock !== '' ? Number(form.stock) : '',
        disponible: form.disponible,
        imagenes: imageUrls,
      }
      const result = await syncProductAdd(product)
      if (!result?.ok) {
        throw new Error(result?.error || 'No se pudo crear el producto')
      }

      // 3. Notify parent and close
      onCreated?.({ ...product, id: result.id })
      reset()
      onClose()
    } catch (err) {
      setSubmitError(err.message || String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-dark mb-1">Crear nuevo producto</h2>
          <p className="text-sm text-secondary">
            Las imágenes se suben a Drive automáticamente y el producto se agrega a la planilla.
          </p>
        </div>

        {/* Imagenes */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Imágenes ({images.length}/{MAX_IMAGES})
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {images.map((img, i) => (
              <div
                key={img.previewUrl}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-bg-alt group"
              >
                <img
                  src={img.previewUrl}
                  alt={`Imagen ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={submitting}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 flex flex-col items-center justify-center text-secondary hover:text-accent transition-colors"
              >
                <Upload size={20} />
                <span className="text-[10px] mt-1">Agregar</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <p className="text-xs text-secondary mt-2">
            Formatos: JPG, PNG, WEBP. Las imágenes se redimensionan a 1200px máximo.
          </p>
        </div>

        {/* Nombre + Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.nombre} required>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setField('nombre', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="Top deportivo strap"
            />
          </Field>
          <Field label="Categoría" error={errors.categoria} required>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setField('categoria', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="Tops"
              list="categorias-existentes"
            />
            {categorias.length > 0 && (
              <datalist id="categorias-existentes">
                {categorias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
          </Field>
        </div>

        {/* Descripcion */}
        <Field label="Descripción">
          <textarea
            value={form.descripcion}
            onChange={(e) => setField('descripcion', e.target.value)}
            disabled={submitting}
            rows={3}
            className="input resize-none"
            placeholder="Detalles del producto, materiales, ajuste, etc."
          />
        </Field>

        {/* Precio + Precio anterior + Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Precio" error={errors.precio} required>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setField('precio', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="15000"
              min="0"
            />
          </Field>
          <Field label="Precio anterior" error={errors.precioAnterior} hint="Sólo para badge SALE">
            <input
              type="number"
              value={form.precioAnterior}
              onChange={(e) => setField('precioAnterior', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="20000"
              min="0"
            />
          </Field>
          <Field label="Stock" error={errors.stock}>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setField('stock', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="10"
              min="0"
            />
          </Field>
        </div>

        {/* Talles + Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Talles" hint="Separados por coma. Ej: S, M, L, XL">
            <input
              type="text"
              value={form.talles}
              onChange={(e) => setField('talles', e.target.value)}
              disabled={submitting}
              className="input"
              placeholder="S, M, L"
            />
          </Field>
          <Field label="Badge">
            <select
              value={form.badge}
              onChange={(e) => setField('badge', e.target.value)}
              disabled={submitting}
              className="input"
            >
              {BADGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Disponible */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.disponible}
            onChange={(e) => setField('disponible', e.target.checked)}
            disabled={submitting}
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
          />
          <span className="text-sm text-dark">Mostrar en la tienda</span>
        </label>

        {/* Progress */}
        {submitting && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">{progress.step}</p>
              {progress.total > 0 && (
                <div className="mt-2 h-1.5 bg-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-sale/5 border border-sale/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sale shrink-0 mt-0.5" />
            <div className="text-sm text-sale">{submitError}</div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-secondary hover:text-dark rounded-lg hover:bg-bg-alt disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-medium text-sm py-2 px-5 rounded-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Crear producto
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-dark mb-1.5">
        {label}
        {required && <span className="text-sale ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-sale mt-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-secondary mt-1">{hint}</p>
      ) : null}
    </div>
  )
}
