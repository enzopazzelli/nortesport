// =============================================
// NORTE SPORT — Configuración principal
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
  clientas: '500+',
  productosVendidos: '2.000+',
}

export const waLink = (mensaje = '') => {
  const encoded = encodeURIComponent(mensaje)
  return `https://wa.me/${negocio.whatsapp}?text=${encoded}`
}

export const temporadaActual = {
  nombre: 'Otoño 2026',
  color: '#8B1A2B',
  colorNombre: 'Borgoña',
  emoji: '🍂',
}

export const categorias = ['Calzas largas', 'Remeras', 'Shorts', 'Tops', 'Conjuntos']

export const tallesDisponibles = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const productos = [
  {
    id: 1,
    nombre: 'Calza larga deportiva',
    categoria: 'Calzas largas',
    descripcion: 'Calza larga con cintura alta y tela suplex de alta compresión. Ideal para entrenar o usar todos los días.',
    precio: 18500,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: 'NUEVO',
    imagenUrl: '/productos/calza-larga-deportiva.jpg',
    placeholder: 'linear-gradient(135deg, #2B3A52, #6B7B8D)',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Calza larga premium',
    categoria: 'Calzas largas',
    descripcion: 'Calza premium con doble capa y bolsillo lateral. Tela respirable y suave al tacto.',
    precio: 22000,
    precioAnterior: null,
    talles: ['S', 'M', 'L'],
    badge: 'ÚLTIMAS',
    imagenUrl: '/productos/calza-larga-premium.jpg',
    placeholder: 'linear-gradient(135deg, #1A2535, #2B3A52)',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Remera dry-fit oversize',
    categoria: 'Remeras',
    descripcion: 'Remera oversize de tela dry-fit. Secado rápido y máxima comodidad para entrenar.',
    precio: 12000,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: null,
    imagenUrl: '/productos/remera-dryfit-oversize.jpg',
    placeholder: 'linear-gradient(135deg, #6B7B8D, #2B3A52)',
    disponible: true,
  },
  {
    id: 4,
    nombre: 'Remera crop sport',
    categoria: 'Remeras',
    descripcion: 'Remera crop ideal para combinar con calzas de cintura alta. Algodón y lycra.',
    precio: 10500,
    precioAnterior: null,
    talles: ['XS', 'S', 'M', 'L'],
    badge: 'NUEVO',
    imagenUrl: '/productos/remera-crop-sport.jpg',
    placeholder: 'linear-gradient(135deg, #3B82F6, #2B3A52)',
    disponible: true,
  },
  {
    id: 5,
    nombre: 'Short con calza',
    categoria: 'Shorts',
    descripcion: 'Short 2 en 1 con calza integrada. Perfecto para correr o entrenar sin preocuparte.',
    precio: 14000,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: null,
    imagenUrl: '/productos/short-con-calza.jpeg',
    placeholder: 'linear-gradient(135deg, #2B3A52, #3B82F6)',
    disponible: true,
  },
  {
    id: 6,
    nombre: 'Short running',
    categoria: 'Shorts',
    descripcion: 'Short liviano con tela respirable. Cintura elástica con cordón ajustable.',
    precio: 11500,
    precioAnterior: 14000,
    talles: ['S', 'M', 'L'],
    badge: 'SALE',
    imagenUrl: '/productos/short-running.jpg',
    placeholder: 'linear-gradient(135deg, #EF4444, #2B3A52)',
    disponible: true,
  },
  {
    id: 7,
    nombre: 'Top deportivo',
    categoria: 'Tops',
    descripcion: 'Top con breteles ajustables y excelente sujeción. Tela suave y cómoda.',
    precio: 9800,
    precioAnterior: null,
    talles: ['XS', 'S', 'M', 'L'],
    badge: 'NUEVO',
    imagenUrl: '/productos/top-deportivo.jpg',
    placeholder: 'linear-gradient(135deg, #1A2535, #6B7B8D)',
    disponible: true,
  },
  {
    id: 8,
    nombre: 'Top con sostén integrado',
    categoria: 'Tops',
    descripcion: 'Top con sostén deportivo integrado. Máximo soporte para entrenamientos de alto impacto.',
    precio: 11000,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: null,
    imagenUrl: '/productos/top-sosten-integrado.jpeg',
    placeholder: 'linear-gradient(135deg, #6B7B8D, #1A2535)',
    disponible: true,
  },
  {
    id: 9,
    nombre: 'Conjunto calza + top',
    categoria: 'Conjuntos',
    descripcion: 'Conjunto combinado de calza larga y top deportivo. Mismo color y tela, look completo.',
    precio: 26000,
    precioAnterior: 30300,
    talles: ['S', 'M', 'L'],
    badge: 'SALE',
    imagenUrl: '/productos/conjunto-calza-top.jpg',
    placeholder: 'linear-gradient(135deg, #2B3A52, #1A2535)',
    disponible: true,
  },
  {
    id: 10,
    nombre: 'Conjunto short + remera',
    categoria: 'Conjuntos',
    descripcion: 'Conjunto de short y remera oversize. Ideal para entrenar o salir cómoda y con estilo.',
    precio: 21000,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: 'NUEVO',
    imagenUrl: '/productos/conjunto-short-remera.jpeg',
    placeholder: 'linear-gradient(135deg, #3B82F6, #1A2535)',
    disponible: true,
  },
  {
    id: 11,
    nombre: 'Calza biker (corta)',
    categoria: 'Calzas largas',
    descripcion: 'Calza corta estilo biker, cintura alta. Ideal para combinar con remeras oversize.',
    precio: 13500,
    precioAnterior: null,
    talles: ['S', 'M', 'L'],
    badge: null,
    imagenUrl: '/productos/calza-biker.jpeg',
    placeholder: 'linear-gradient(135deg, #1A2535, #3B82F6)',
    disponible: true,
  },
  {
    id: 12,
    nombre: 'Remera manga larga térmica',
    categoria: 'Remeras',
    descripcion: 'Remera térmica de manga larga. Perfecta para entrenar en días fríos. Tela dry-fit.',
    precio: 15000,
    precioAnterior: null,
    talles: ['S', 'M', 'L', 'XL'],
    badge: null,
    imagenUrl: '/productos/remera-manga-larga.jpg',
    placeholder: 'linear-gradient(135deg, #2B3A52, #6B7B8D)',
    disponible: true,
  },
]

export const testimonios = [
  { id: 1, nombre: 'María L.', texto: 'Las calzas son increíbles, no se transparentan y son súper cómodas. Ya pedí 3 veces.', estrellas: 5 },
  { id: 2, nombre: 'Valentina R.', texto: 'Me encanta que cada temporada traen colores nuevos. Siempre hay algo lindo.', estrellas: 5 },
  { id: 3, nombre: 'Camila S.', texto: 'Compré un conjunto y me llegó al día siguiente. Excelente atención.', estrellas: 5 },
  { id: 4, nombre: 'Lucía M.', texto: 'La calidad es muy buena para el precio. Las remeras dry-fit son mi favorito.', estrellas: 5 },
  { id: 5, nombre: 'Florencia G.', texto: 'Pedí por WhatsApp y fue súper fácil. Me asesoraron con el talle perfecto.', estrellas: 5 },
  { id: 6, nombre: 'Sol P.', texto: 'El short con calza es lo mejor que compré este año. Lo uso para todo.', estrellas: 5 },
]

export const faqs = [
  {
    pregunta: '¿Cómo compro?',
    respuesta: 'Podés agregar productos al carrito y pagar con MercadoPago, o enviarnos tu pedido por WhatsApp. Te confirmamos stock y coordinamos el envío o retiro.',
  },
  {
    pregunta: '¿Cómo elijo el talle correcto?',
    respuesta: 'En cada producto vas a encontrar los talles disponibles. Si tenés dudas, escribinos por WhatsApp y te ayudamos con la guía de talles.',
  },
  {
    pregunta: '¿Hacen envíos a todo el país?',
    respuesta: 'Sí, enviamos a todo Argentina por correo o transporte. En Santiago del Estero capital, entrega en el día o al día siguiente.',
  },
  {
    pregunta: '¿Puedo cambiar o devolver?',
    respuesta: 'Sí, tenés 7 días para cambiar tu prenda por otro talle o producto. Solo tiene que estar sin uso y con etiqueta.',
  },
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta: 'Efectivo, transferencia bancaria (15% OFF), MercadoPago (hasta 3 cuotas sin interés) y tarjetas de crédito/débito.',
  },
  {
    pregunta: '¿Por qué cambian los colores cada temporada?',
    respuesta: 'Trabajamos con una marca que renueva su paleta de colores cada temporada. Eso significa que cada colección es limitada — cuando se agotan, no vuelven. ¡Aprovechá los que te gusten!',
  },
  {
    pregunta: '¿Tienen local físico?',
    respuesta: 'No, somos 100% online. Vendemos por WhatsApp, Instagram y nuestra web. Pero podés retirar tu pedido en Santiago del Estero capital.',
  },
]

export const lookbookItems = [
  { id: 1, titulo: 'Look Gym Day', badge: '4 prendas', tamano: 'grande', imagenUrl: '/lookbook/look-gym-day.jpg', placeholder: 'linear-gradient(135deg, #1A2535, #6B7B8D)' },
  { id: 2, titulo: 'Look Running', badge: null, tamano: 'normal', imagenUrl: '/lookbook/look-running.jpg', placeholder: 'linear-gradient(135deg, #3B82F6, #FFFFFF)' },
  { id: 3, titulo: 'Look Casual Sport', badge: null, tamano: 'normal', imagenUrl: '/lookbook/look-casual-sport.jpeg', placeholder: 'linear-gradient(135deg, #6B7B8D, #1A2535)' },
  { id: 4, titulo: 'Look Training', badge: 'Más vendido', tamano: 'horizontal', imagenUrl: '/lookbook/look-training.jpg', placeholder: 'linear-gradient(135deg, #3B82F6, #1A2535)' },
  { id: 5, titulo: 'Look Yoga', badge: null, tamano: 'normal', imagenUrl: '/lookbook/look-yoga.jpg', placeholder: 'linear-gradient(135deg, #1A2535, #3B82F6)' },
  { id: 6, titulo: 'Look Streetwear', badge: null, tamano: 'normal', imagenUrl: '/lookbook/look-streetwear.jpeg', placeholder: 'linear-gradient(135deg, #E8EDF3, #FFFFFF)' },
  { id: 7, titulo: 'Look Full Set', badge: 'Nuevo', tamano: 'grande', imagenUrl: '/lookbook/look-full-set.jpg', placeholder: 'linear-gradient(135deg, #1A2535, #3B82F6)' },
  { id: 8, titulo: 'Look Weekend', badge: null, tamano: 'normal', imagenUrl: '/lookbook/look-weekend.jpeg', placeholder: 'linear-gradient(135deg, #2B3A52, #6B7B8D)' },
]

export const stats = [
  { numero: '3+', label: 'Años' },
  { numero: '500+', label: 'Clientas felices' },
  { numero: '2.000+', label: 'Prendas vendidas' },
  { numero: '100%', label: 'Online' },
]

export const promos = [
  'Envíos a todo el país 🚚',
  '3 cuotas sin interés 💳',
  '15% OFF con transferencia 💰',
  'Cambios sin costo 🔄',
]

export const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Nosotras', href: '#nosotras' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

export const adminConfig = {
  password: 'nortesport2026',
  pdfColors: {
    header: '#2B3A52',
    border: '#E5E7EB',
    accent: '#3B82F6',
  },
  empresa: 'Norte Sport',
}

export const SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI'
