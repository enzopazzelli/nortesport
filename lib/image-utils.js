// =============================================
// Helpers de imágenes para el admin
// - compressImage: redimensiona y comprime un File a JPEG
// - fileToBase64: convierte un File/Blob a string base64 sin el prefijo data:
// =============================================

const DEFAULT_MAX_DIMENSION = 1200
const DEFAULT_QUALITY = 0.85

export async function compressImage(
  file,
  { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {}
) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('El archivo no es una imagen')
  }

  const dataUrl = await readFileAsDataURL(file)
  const img = await loadImage(dataUrl)

  let { width, height } = img
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      height = Math.round((height / width) * maxDimension)
      width = maxDimension
    } else {
      width = Math.round((width / height) * maxDimension)
      height = maxDimension
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  )

  if (!blob) throw new Error('No se pudo comprimir la imagen')

  return {
    blob,
    name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    mimeType: 'image/jpeg',
    size: blob.size,
    width,
    height,
  }
}

export function fileToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const comma = typeof result === 'string' ? result.indexOf(',') : -1
      if (comma === -1) {
        reject(new Error('Formato base64 inesperado'))
        return
      }
      resolve(result.slice(comma + 1))
    }
    reader.onerror = () => reject(reader.error || new Error('Error leyendo archivo'))
    reader.readAsDataURL(blob)
  })
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Error leyendo imagen'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Error cargando imagen'))
    img.src = src
  })
}
