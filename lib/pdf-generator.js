import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { negocio, adminConfig } from './config'
import { formatPrice } from './excel-parser'

/**
 * Generate a product catalog PDF
 */
export function generateCatalogPDF({ products, priceColumn, margin, columnMapping, title }) {
  const doc = new jsPDF()
  const { pdfColors } = adminConfig
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(pdfColors.header)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(negocio.nombre, 14, 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`WhatsApp: ${negocio.whatsappDisplay} | Instagram: ${negocio.instagram}`, 14, 27)
  doc.text(negocio.ubicacion, 14, 32)

  // Title
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(title || 'Lista de Precios', 14, 48)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(107, 123, 141)
  doc.text(`Generada el ${new Date().toLocaleDateString('es-AR')}`, 14, 55)

  // Table
  const headers = []
  const body = []

  if (columnMapping.nombre) headers.push('Producto')
  if (columnMapping.categoria) headers.push('Categoría')
  if (priceColumn) headers.push('Precio')

  products.forEach((product) => {
    const row = []
    if (columnMapping.nombre) row.push(product[columnMapping.nombre] || '')
    if (columnMapping.categoria) row.push(product[columnMapping.categoria] || '')
    if (priceColumn) {
      const rawPrice = Number(product[priceColumn]) || 0
      const finalPrice = margin > 0 ? Math.round(rawPrice * (1 + margin / 100)) : rawPrice
      row.push(formatPrice(finalPrice))
    }
    body.push(row)
  })

  autoTable(doc, {
    startY: 62,
    head: [headers],
    body,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: pdfColors.header,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [247, 248, 250],
    },
    tableLineColor: pdfColors.border,
    tableLineWidth: 0.1,
  })

  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.setDrawColor(pdfColors.accent)
    doc.setLineWidth(0.5)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

    doc.setFontSize(8)
    doc.setTextColor(107, 123, 141)
    doc.text(
      `${negocio.nombre} — Lista de precios — ${new Date().toLocaleDateString('es-AR')}`,
      14,
      pageHeight - 10
    )
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' })
  }

  return doc
}
