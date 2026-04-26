// =============================================
// Carga imágenes (incluso cross-origin como las de
// lh3.googleusercontent.com) y las convierte a data URL
// vía un <canvas>, así jsPDF las puede embedear.
//
// Las URLs de Google (lh3/drive) NO devuelven headers CORS
// para permitir tainted canvas. Las ruteamos por /api/proxy-image
// para que el browser las vea como same-origin.
// =============================================

const DEFAULT_MAX_DIMENSION = 1000
const DEFAULT_QUALITY = 0.8

const PROXY_HOST_SUFFIXES = [
  'googleusercontent.com',
  'drive.google.com',
  'lh3.google.com',
]

function maybeProxy(src) {
  if (typeof window === 'undefined') return src
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src
  // Paths relativos (ej: /logo.jpeg) van directo
  if (src.startsWith('/')) return src
  try {
    const url = new URL(src, window.location.href)
    // Si ya es same-origin no hace falta proxy
    if (url.origin === window.location.origin) return src
    if (PROXY_HOST_SUFFIXES.some((h) => url.hostname.endsWith(h))) {
      return `/api/proxy-image?url=${encodeURIComponent(src)}`
    }
  } catch {}
  return src
}

export function loadImage(src, { crossOrigin = 'anonymous' } = {}) {
  const finalSrc = maybeProxy(src)
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = crossOrigin
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Error cargando imagen: ' + src))
    img.src = finalSrc
  })
}

export async function imageToDataURL(
  src,
  {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
    crossOrigin = 'anonymous',
    targetAspect = null, // si se pasa (width/height), recorta la imagen tipo "cover"
  } = {}
) {
  const img = await loadImage(src, { crossOrigin })

  // 1. Si hay targetAspect, calcular crop "cover" sobre la imagen fuente
  let srcX = 0
  let srcY = 0
  let srcW = img.width
  let srcH = img.height

  if (targetAspect) {
    const imgAspect = img.width / img.height
    if (imgAspect > targetAspect) {
      // imagen más ancha que el target → recortar lados
      srcW = Math.round(img.height * targetAspect)
      srcX = Math.round((img.width - srcW) / 2)
    } else if (imgAspect < targetAspect) {
      // imagen más alta que el target → recortar arriba/abajo
      srcH = Math.round(img.width / targetAspect)
      srcY = Math.round((img.height - srcH) / 2)
    }
  }

  // 2. Calcular tamaño final del canvas respetando maxDimension
  let outW = srcW
  let outH = srcH
  if (outW > maxDimension || outH > maxDimension) {
    if (outW >= outH) {
      outH = Math.round((outH / outW) * maxDimension)
      outW = maxDimension
    } else {
      outW = Math.round((outW / outH) * maxDimension)
      outH = maxDimension
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH)

  return {
    dataUrl: canvas.toDataURL('image/jpeg', quality),
    width: outW,
    height: outH,
  }
}

// Procesa items en batches para no saturar la red.
// batchSize bajo + delay entre batches evita 429 de Google.
export async function fetchInBatches(items, fn, { batchSize = 2, batchDelay = 150, onProgress } = {}) {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async (item, idx) => {
        try {
          const result = await fn(item)
          return { ok: true, item, result, index: i + idx }
        } catch (err) {
          return { ok: false, item, error: err, index: i + idx }
        }
      })
    )
    results.push(...batchResults)
    onProgress?.(Math.min(i + batchSize, items.length), items.length)
    if (batchDelay > 0 && i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, batchDelay))
    }
  }
  return results
}
