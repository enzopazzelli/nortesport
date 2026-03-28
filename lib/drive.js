/**
 * Converts a Google Drive sharing link to a direct image URL
 * Input:  https://drive.google.com/file/d/FILE_ID/view
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 */
export function getDriveImageUrl(driveUrl) {
  if (!driveUrl) return null

  // Already converted
  if (driveUrl.includes('lh3.googleusercontent.com')) return driveUrl

  // Extract FILE_ID from various Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = driveUrl.match(pattern)
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`
    }
  }

  // If it's already a direct URL or unrecognized format, return as-is
  return driveUrl
}

/**
 * Component-friendly image source
 * Returns the direct URL or null if not available
 */
export function getImageSrc(imagenUrl) {
  if (!imagenUrl) return null
  return getDriveImageUrl(imagenUrl)
}
