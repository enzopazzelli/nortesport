// =============================================
// Generador de catálogo PDF de productos con imágenes
// (modo Público y modo Mayorista)
// =============================================

import jsPDF from 'jspdf'
import { negocio } from './config'
import { adminConfig } from './admin'
import { imageToDataURL, fetchInBatches } from './image-fetch'

// --- Constantes de layout (mm) ---
const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const HEADER_H = 18
const FOOTER_H = 14
const COLS = 2
const ROWS = 2
const GAP = 8

export const MODE_PUBLIC = 'publico'
export const MODE_WHOLESALE = 'mayorista'

// --- Helpers ---
function hexToRgb(hex) {
  const cleaned = hex.replace('#', '')
  return [
    parseInt(cleaned.substring(0, 2), 16),
    parseInt(cleaned.substring(2, 4), 16),
    parseInt(cleaned.substring(4, 6), 16),
  ]
}

function formatARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

function applyMayoristaPrice(price, discount) {
  return Math.round(price * (1 - discount / 100))
}

// --- Main ---
export async function generateCatalogPDF({ products, options = {}, onProgress }) {
  const {
    mode = MODE_PUBLIC,
    title = 'Catálogo',
    includeCover = true,
    includeContact = true,
    mayoristaDescuento = adminConfig.catalog.mayoristaDescuentoDefault,
  } = options

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const colors = adminConfig.pdfColors
  const headerRgb = hexToRgb(colors.header)
  const accentRgb = hexToRgb(colors.accent)
  const saleRgb = [239, 68, 68] // tailwind red-500

  // --- Paso 1: cargar logo
  onProgress?.({ step: 'Cargando logo...', current: 0, total: products.length + 2 })
  let logoData = null
  try {
    logoData = await imageToDataURL(adminConfig.catalog.logoPath, {
      maxDimension: 400,
      quality: 0.9,
    })
  } catch (err) {
    console.warn('No se pudo cargar el logo:', err)
  }

  // --- Paso 2: pre-fetch primera imagen de cada producto
  const imageResults = await fetchInBatches(
    products,
    async (product) => {
      const url = product.imagenes?.[0]
      if (!url) return null
      return await imageToDataURL(url, {
        maxDimension: 700,
        quality: 0.82,
        // sin targetAspect → no se recorta, se usa contain en jsPDF
      })
    },
    {
      batchSize: 2,
      batchDelay: 200,
      onProgress: (current, total) => {
        onProgress?.({
          step: `Cargando imágenes (${current} de ${total})...`,
          current: current + 1,
          total: total + 2,
        })
      },
    }
  )
  const imageMap = {}
  imageResults.forEach((r) => {
    if (r.ok && r.result) imageMap[r.item.id] = r.result
  })

  onProgress?.({ step: 'Armando PDF...', current: products.length + 1, total: products.length + 2 })

  // --- Paso 3: portada
  if (includeCover) {
    drawCover(doc, { logoData, title, mode, headerRgb })
    doc.addPage()
  }

  // --- Paso 4: páginas de productos en grilla
  const cardsPerPage = COLS * ROWS
  for (let i = 0; i < products.length; i += cardsPerPage) {
    if (i > 0) doc.addPage()
    drawHeader(doc, { logoData, title, mode, headerRgb })
    const chunk = products.slice(i, i + cardsPerPage)
    drawProductGrid(doc, chunk, {
      mode,
      mayoristaDescuento,
      imageMap,
      headerRgb,
      accentRgb,
      saleRgb,
    })
  }

  // --- Paso 5: página de contacto
  if (includeContact) {
    doc.addPage()
    drawContactPage(doc, { logoData, mode, headerRgb, accentRgb })
  }

  // --- Paso 6: footers en todas las páginas
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawFooter(doc, { pageNum: p, totalPages, mode, headerRgb })
  }

  onProgress?.({ step: 'Listo', current: products.length + 2, total: products.length + 2 })
  return doc
}

// --- Drawers ---

function drawCover(doc, { logoData, title, mode, headerRgb }) {
  // Logo bien grande y centrado en la mitad superior
  if (logoData) {
    const maxLogoW = 130
    const maxLogoH = 90
    const logoAspect = logoData.width / logoData.height
    let logoW, logoH
    if (maxLogoW / logoAspect <= maxLogoH) {
      logoW = maxLogoW
      logoH = maxLogoW / logoAspect
    } else {
      logoH = maxLogoH
      logoW = maxLogoH * logoAspect
    }
    doc.addImage(
      logoData.dataUrl,
      'JPEG',
      (PAGE_W - logoW) / 2,
      90 - logoH / 2,
      logoW,
      logoH
    )
  }

  // Línea decorativa debajo del logo
  doc.setDrawColor(headerRgb[0], headerRgb[1], headerRgb[2])
  doc.setLineWidth(0.6)
  doc.line(PAGE_W / 2 - 30, 145, PAGE_W / 2 + 30, 145)

  // Título del catálogo (no repite la marca, ya está en el logo)
  doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(title, PAGE_W / 2, 165, { align: 'center' })

  // Badge mayorista
  if (mode === MODE_WHOLESALE) {
    doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2])
    doc.roundedRect(PAGE_W / 2 - 38, 180, 76, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('EDICIÓN MAYORISTA', PAGE_W / 2, 188, { align: 'center' })
  } else if (negocio.slogan) {
    doc.setTextColor(107, 123, 141)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'italic')
    doc.text(negocio.slogan, PAGE_W / 2, 180, { align: 'center' })
  }

  // Datos de contacto al pie
  doc.setTextColor(107, 123, 141)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  doc.text(date, PAGE_W / 2, 250, { align: 'center' })

  doc.setFontSize(9)
  doc.text(
    `WhatsApp ${negocio.whatsappDisplay}  ·  ${negocio.instagram}`,
    PAGE_W / 2,
    260,
    { align: 'center' }
  )
  doc.text(negocio.ubicacion, PAGE_W / 2, 266, { align: 'center' })
}

function drawHeader(doc, { logoData, title, mode, headerRgb }) {
  // Logo a la izquierda — calculamos su ancho real para no superponernos
  let logoEndX = MARGIN
  if (logoData) {
    const h = 10
    const w = (logoData.width / logoData.height) * h
    doc.addImage(logoData.dataUrl, 'JPEG', MARGIN, 3, w, h)
    logoEndX = MARGIN + w
  }

  // Badge mayorista a la derecha (lo dibujamos primero para reservar el espacio)
  let titleEndX = PAGE_W - MARGIN
  if (mode === MODE_WHOLESALE) {
    const badgeW = 26
    doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2])
    doc.roundedRect(PAGE_W - MARGIN - badgeW, 4, badgeW, 6, 1, 1, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('MAYORISTA', PAGE_W - MARGIN - badgeW / 2, 8, { align: 'center' })
    titleEndX = PAGE_W - MARGIN - badgeW - 3
  }

  // Título del catálogo a la derecha del logo (el logo ya tiene la marca)
  doc.setTextColor(107, 123, 141)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  // Se trunca si no entra
  const availableForTitle = titleEndX - logoEndX - 5
  const titleLines = doc.splitTextToSize(title || '', Math.max(20, availableForTitle))
  doc.text(titleLines[0] || '', titleEndX, 10, { align: 'right' })

  // Línea divisoria
  doc.setDrawColor(headerRgb[0], headerRgb[1], headerRgb[2])
  doc.setLineWidth(0.3)
  doc.line(MARGIN, HEADER_H - 1, PAGE_W - MARGIN, HEADER_H - 1)
}

function drawFooter(doc, { pageNum, totalPages, mode, headerRgb }) {
  const y = PAGE_H - 7
  doc.setDrawColor(headerRgb[0], headerRgb[1], headerRgb[2])
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y - 5, PAGE_W - MARGIN, y - 5)

  doc.setTextColor(107, 123, 141)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toLocaleDateString('es-AR')
  doc.text(`${negocio.nombre} · Generado el ${today}`, MARGIN, y)

  if (mode === MODE_WHOLESALE) {
    doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
    doc.setFont('helvetica', 'bold')
    doc.text('MAYORISTA', PAGE_W / 2, y, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 123, 141)
  }

  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_W - MARGIN, y, { align: 'right' })
}

function drawProductGrid(doc, products, ctx) {
  const contentTop = HEADER_H + 4
  const contentLeft = MARGIN
  const cardW = (PAGE_W - 2 * MARGIN - GAP * (COLS - 1)) / COLS
  const availableH = PAGE_H - HEADER_H - FOOTER_H - 8
  const cardH = (availableH - GAP * (ROWS - 1)) / ROWS

  products.forEach((product, idx) => {
    const col = idx % COLS
    const row = Math.floor(idx / COLS)
    const x = contentLeft + col * (cardW + GAP)
    const y = contentTop + row * (cardH + GAP)
    drawCard(doc, product, x, y, cardW, cardH, ctx)
  })
}

function drawCard(doc, product, x, y, w, h, ctx) {
  const { mode, mayoristaDescuento, imageMap, headerRgb, accentRgb, saleRgb } = ctx
  const imageData = imageMap[product.id]

  // Área de imagen (frame vertical 4:5, ocupa la mayor parte del card)
  // Reservamos espacio inferior para el texto según el modo
  const textBlockH = mode === MODE_WHOLESALE ? 36 : 28
  const imgFrameH = h - textBlockH
  const imgFrameW = w

  // Background del frame (gris muy claro para letterbox cuando la foto no encaja exacto)
  doc.setFillColor(247, 248, 250)
  doc.rect(x, y, imgFrameW, imgFrameH, 'F')

  if (imageData) {
    // CONTAIN: la imagen entera entra en el frame, sin recortar.
    // Si la aspect ratio no coincide queda con bandas grises.
    const imgAspect = imageData.width / imageData.height
    const frameAspect = imgFrameW / imgFrameH
    let drawW, drawH
    if (imgAspect > frameAspect) {
      // foto más ancha que el frame → ajustar por ancho
      drawW = imgFrameW
      drawH = imgFrameW / imgAspect
    } else {
      // foto más alta o igual → ajustar por alto
      drawH = imgFrameH
      drawW = imgFrameH * imgAspect
    }
    const drawX = x + (imgFrameW - drawW) / 2
    const drawY = y + (imgFrameH - drawH) / 2
    doc.addImage(imageData.dataUrl, 'JPEG', drawX, drawY, drawW, drawH, undefined, 'FAST')
  } else {
    doc.setTextColor(160, 170, 180)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Sin imagen', x + imgFrameW / 2, y + imgFrameH / 2, { align: 'center' })
  }

  // Badge sobre la imagen (esquina sup-izq)
  if (product.badge && (product.stock == null || product.stock > 0)) {
    drawBadge(doc, product, x + 3, y + 3, { headerRgb, accentRgb, saleRgb })
  }

  // Marca "Sin stock" sobre imagen
  if (product.stock != null && product.stock <= 0) {
    doc.setFillColor(0, 0, 0)
    doc.rect(x, y + imgFrameH / 2 - 6, imgFrameW, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('SIN STOCK', x + imgFrameW / 2, y + imgFrameH / 2 + 2, { align: 'center' })
  }

  // Área de texto debajo de la imagen
  const textX = x + 1
  const textW = w - 2
  let textY = y + imgFrameH + 5

  // Categoría
  doc.setTextColor(107, 123, 141)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text((product.categoria || '').toUpperCase(), textX, textY)
  textY += 4.5

  // Nombre (max 1 línea — si no entra, se trunca)
  doc.setTextColor(26, 32, 45)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  const nameLines = doc.splitTextToSize(product.nombre || '', textW)
  doc.text(nameLines[0] || '', textX, textY)
  textY += 5

  // Talles
  if (product.talles && product.talles.length > 0) {
    doc.setTextColor(107, 123, 141)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const talles = (Array.isArray(product.talles) ? product.talles : [product.talles])
      .join(' · ')
    const talleLines = doc.splitTextToSize(talles, textW)
    doc.text(talleLines[0] || '', textX, textY)
    textY += 4.5
  }

  // Precio
  textY += 1
  if (mode === MODE_WHOLESALE) {
    const priceWholesale = applyMayoristaPrice(product.precio, mayoristaDescuento)
    // Precio mayorista (línea 1)
    doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(formatARS(priceWholesale), textX, textY)

    // PVP debajo (línea 2)
    textY += 4.5
    doc.setTextColor(160, 170, 180)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`PVP ${formatARS(product.precio)}`, textX, textY)

    // Stock + ID (línea 3)
    textY += 4.5
    doc.setTextColor(107, 123, 141)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const stockTxt = product.stock != null ? `Stock: ${product.stock}` : 'Stock: —'
    doc.text(`${stockTxt}   ·   Cód. ${product.id}`, textX, textY)
  } else {
    // Modo público
    const hasDiscount = product.badge === 'SALE' && product.precioAnterior
    if (hasDiscount) {
      // Precio actual en rojo
      doc.setTextColor(saleRgb[0], saleRgb[1], saleRgb[2])
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text(formatARS(product.precio), textX, textY)
      // Precio anterior tachado al lado
      const newPriceW = doc.getTextWidth(formatARS(product.precio))
      doc.setTextColor(160, 170, 180)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const oldText = formatARS(product.precioAnterior)
      const oldX = textX + newPriceW + 3
      doc.text(oldText, oldX, textY)
      const oldW = doc.getTextWidth(oldText)
      doc.setDrawColor(160, 170, 180)
      doc.setLineWidth(0.4)
      doc.line(oldX, textY - 1.4, oldX + oldW, textY - 1.4)
    } else {
      doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text(formatARS(product.precio), textX, textY)
    }
  }
}

function drawBadge(doc, product, x, y, { headerRgb, accentRgb, saleRgb }) {
  let label = product.badge
  let bgColor = accentRgb
  if (product.badge === 'SALE' && product.precioAnterior) {
    const pct = Math.round((1 - product.precio / product.precioAnterior) * 100)
    label = `-${pct}%`
    bgColor = saleRgb
  } else if (product.badge === 'NUEVO') {
    bgColor = headerRgb
  } else if (product.badge === 'ÚLTIMAS') {
    bgColor = [234, 179, 8] // yellow-500
  }

  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  const labelW = doc.getTextWidth(label) + 3
  doc.roundedRect(x, y, labelW, 4.5, 0.5, 0.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text(label, x + labelW / 2, y + 3.2, { align: 'center' })
}

function drawContactPage(doc, { logoData, mode, headerRgb, accentRgb }) {
  // Header sin contenido (drawFooter se aplica luego)
  drawHeader(doc, { logoData, title: 'Contacto', mode, headerRgb })

  let y = HEADER_H + 20

  doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Contactanos', MARGIN, y)
  y += 12

  doc.setTextColor(107, 123, 141)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const intro = mode === MODE_WHOLESALE
    ? 'Para consultas mayoristas y armar tu pedido:'
    : 'Para hacer tu pedido o consultar por algún producto:'
  doc.text(intro, MARGIN, y)
  y += 12

  doc.setTextColor(26, 32, 45)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('WhatsApp:', MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.text(negocio.whatsappDisplay, MARGIN + 30, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Instagram:', MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.text(negocio.instagram, MARGIN + 30, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Ubicación:', MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.text(negocio.ubicacion, MARGIN + 30, y)
  y += 8

  if (negocio.horarios) {
    doc.setFont('helvetica', 'bold')
    doc.text('Horarios:', MARGIN, y)
    doc.setFont('helvetica', 'normal')
    doc.text(negocio.horarios, MARGIN + 30, y)
    y += 8
  }

  // Condiciones mayoristas
  if (mode === MODE_WHOLESALE) {
    y += 12
    doc.setTextColor(headerRgb[0], headerRgb[1], headerRgb[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Condiciones de venta mayorista', MARGIN, y)
    y += 8

    doc.setTextColor(60, 70, 85)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    adminConfig.catalog.condicionesMayorista.forEach((line) => {
      const wrapped = doc.splitTextToSize(`•  ${line}`, PAGE_W - 2 * MARGIN)
      wrapped.forEach((l) => {
        doc.text(l, MARGIN, y)
        y += 5
      })
    })
  }

  // Footer extra
  doc.setTextColor(107, 123, 141)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(
    '¡Gracias por elegir ' + negocio.nombre + '!',
    PAGE_W / 2,
    PAGE_H - 30,
    { align: 'center' }
  )
}
