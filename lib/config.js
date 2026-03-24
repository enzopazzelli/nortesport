// =============================================
// NORTE SPORT — Datos del negocio
// Cosas que rara vez cambian
// =============================================

export const negocio = {
  nombre: 'Norte Sport',
  slogan: 'Tu norte, tu camino, tu estilo',
  descripcion: 'Tienda online de ropa deportiva femenina',
  whatsapp: '5493854788733',
  whatsappDisplay: '385-478-8733',
  instagram: '@nortesport.sgo',
  instagramUrl: 'https://www.instagram.com/nortesport.sgo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  horarios: 'Lun a Sáb 8:00-22:00',
  ubicacion: 'Santiago del Estero, Argentina',
  experiencia: '3+',
  clientas: '200+',
  productosVendidos: '1.000+',
}

export const waLink = (mensaje = '') => {
  const encoded = encodeURIComponent(mensaje)
  return `https://wa.me/${negocio.whatsapp}?text=${encoded}`
}

export const stats = [
  { numero: '3+', label: 'Años' },
  { numero: '200+', label: 'Clientas felices' },
  { numero: '1.000+', label: 'Prendas vendidas' },
  { numero: '100%', label: 'Online' },
]

export const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Nosotras', href: '#nosotras' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]
