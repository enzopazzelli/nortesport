/**
 * Converts a Google Drive sharing link to a proxied direct image URL.
 *
 * Para evitar rate limits de Google sobre cada cliente, ruteamos las
 * imágenes a través de /api/proxy-image. Eso permite cachear vía Vercel
 * CDN en producción y aplicar Cache-Control en el browser en dev.
 *
 * Input:  https://drive.google.com/file/d/FILE_ID/view
 * Output: /api/proxy-image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2FFILE_ID
 */
export function getDriveImageUrl(driveUrl) {
  if (!driveUrl) return null

  // Ya está proxiada
  if (driveUrl.startsWith('/api/proxy-image')) return driveUrl

  let lh3Url = null

  if (driveUrl.includes('lh3.googleusercontent.com')) {
    lh3Url = driveUrl
  } else {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ]
    for (const pattern of patterns) {
      const match = driveUrl.match(pattern)
      if (match) {
        lh3Url = `https://lh3.googleusercontent.com/d/${match[1]}`
        break
      }
    }
  }

  if (!lh3Url) return driveUrl
  return `/api/proxy-image?url=${encodeURIComponent(lh3Url)}`
}

/**
 * Component-friendly image source
 * Returns the direct URL or null if not available
 */
export function getImageSrc(imagenUrl) {
  if (!imagenUrl) return null
  return getDriveImageUrl(imagenUrl)
}
