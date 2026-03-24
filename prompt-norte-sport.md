# Prompt — Norte Sport: Tienda de Ropa Deportiva Femenina

---

```
Sos un desarrollador frontend senior especializado en Next.js 14+ (App Router), JavaScript y Tailwind CSS. Vas a crear un proyecto completo para "Norte Sport", una tienda online de ropa deportiva femenina. Este es un proyecto real.

NO me hagas preguntas. Toda la información está acá. Generá todo.

---

## DATOS DEL NEGOCIO

- **Nombre:** Norte Sport
- **Slogan:** "Tu norte, tu camino, tu estilo"
- **Rubro:** Venta de ropa deportiva femenina (reventa de marca por temporada)
- **Modelo de negocio:** Venta directa y pedidos. Se trabaja por temporada: cada temporada tiene un color dominante. Cuando se agota el stock o cambia la temporada, el color anterior deja de estar disponible y se renueva. El catálogo rota constantemente.
- **Público objetivo:** Mujeres jóvenes y adultas que buscan ropa deportiva cómoda, con estilo urbano-sport.
- **WhatsApp:** 5493815550000
- **Instagram:** @nortesport.sde
- **Horarios:** Lun a Sáb 8:00-22:00
- **Ubicación:** Santiago del Estero, Argentina (sin local físico — venta online)
- **Años de experiencia:** 3+
- **Clientes satisfechos:** 500+
- **Productos vendidos:** 2.000+

---

## DISEÑO — ESPECÍFICO DE ESTE PROYECTO

### Estilo: Moderno, urbano, deportivo-femenino
Estética limpia, con energía deportiva pero sin perder lo femenino. Inspirada en marcas de sportswear independientes. Mucho blanco, azul oscuro como acento de autoridad, grises para equilibrar. Fotos grandes de producto como protagonistas. Sensación de movimiento y dinamismo.

### Paleta
```
Primary:          #2B3A52  (azul oscuro/navy — extraído del logo)
Primary light:    #E8EDF3  (azul muy suave)
Primary dark:     #1A2535  (azul profundo)
Secondary:        #6B7B8D  (gris azulado — complemento neutro)
Secondary light:  #F0F2F5  (gris muy claro)
Background:       #FFFFFF  (blanco puro — limpio, moderno)
Background alt:   #F7F8FA  (gris casi blanco para alternar secciones)
Card:             #FFFFFF
Text primary:     #1A1A1A
Text secondary:   #6B7B8D
Text muted:       #9CA3AF
Border:           #E5E7EB
Accent:           #3B82F6  (azul eléctrico para CTAs y highlights)
Accent light:     #EFF6FF
Danger/Sale:      #EF4444  (rojo para descuentos y badges de oferta)
```

### Tipografía
- Display: "Inter" (sans-serif moderna, geométrica, ideal para sport/tech)
- Body: "Inter" (misma familia, diferentes weights — 400 body, 600 semi, 700 bold, 900 black para títulos hero)
- Alternativa display: Si se quiere más contraste, usar "Bebas Neue" para títulos hero y sección eyebrows (uppercase, condensada, muy deportiva)

### DIFERENCIADORES DE DISEÑO (lo que hace ÚNICO este proyecto)

- **Hero FULL-WIDTH con video o imagen de fondo** — imagen/video de modelo con ropa deportiva, overlay gradient de #1A2535 a transparent (de izquierda a derecha), texto bold a la izquierda. CTA grande con efecto hover que crece. Badge de temporada actual (ej: "Temporada Otoño 2026 🔥"). Por ahora placeholder con gradiente dark-to-light simulando la foto.
- **Barra superior de promos (marquee)** — franja con bg #2B3A52 y texto blanco con scroll infinito horizontal (CSS animation): "Envíos a todo el país 🚚 | 3 cuotas sin interés 💳 | 15% OFF con transferencia 💰". Se repite en loop.
- **Navbar STICKY minimalista** — fondo blanco, logo a la izquierda (imagen del logo nortesport.jpeg), links centrados, iconos a la derecha (búsqueda, carrito con badge). Border-bottom 1px sutil. Al scroll: shadow-sm aparece.
- **Productos en GRID DINÁMICO con filtros laterales** — layout tipo e-commerce real: sidebar izquierda con filtros (categoría, talle, precio, temporada), grid de productos a la derecha (3-4 columnas). Cada card: foto grande (aspect 3:4), hover zoom + overlay con "Ver producto" y "Agregar al carrito". Badge de "NUEVO", "SALE", "ÚLTIMAS UNIDADES". Talle visible como pills debajo del nombre. Precio actual + precio tachado si hay descuento.
- **Quick View modal** — click en "Ver producto" abre modal con foto grande, selector de talle (pills), precio, descripción, botón agregar al carrito, y botón "Comprar ahora" (checkout directo).
- **Carrito slide-in desde la derecha** — panel que se desliza, muestra items con foto thumbnail, nombre, talle, cantidad editable, precio. Subtotal. Dos opciones de checkout: "Pagar con MercadoPago" y "Continuar por WhatsApp". Badge en navbar.
- **Galería / Lookbook con MASONRY** — fotos de outfits completos en grid masonry. Hover: overlay con nombre del look + botón "Ver productos del look". Fotos gestionadas desde Google Drive + admin dashboard.
- **Testimonios en CAROUSEL** — carousel horizontal con autoplay. Cada testimonial: foto avatar (placeholder circle), nombre, texto, estrellas (1-5). Fondo alterno #F7F8FA. Dots de navegación en #2B3A52.
- **Sección About con TIMELINE o stats** — no solo texto. Stats animados (counter up al entrar en viewport): "3+ Años", "500+ Clientas", "2.000+ Prendas vendidas". Texto breve sobre la marca. Foto o ilustración decorativa.
- **FAQ en ACCORDION limpio** — columna única centrada, max-width 700px. Cada pregunta: click expande con animación smooth. Icono ChevronDown que rota. Bordes sutiles. Limpio y minimal.
- **Footer MODERNO de 4 columnas** — col1: logo + descripción + redes. col2: links navegación. col3: categorías de productos. col4: contacto + horarios. Background #1A2535, texto white/gray. Borde top con línea accent #3B82F6.
- **Efecto de temporada** — un componente visual que indica la temporada actual y su color dominante. En el hero o en una franja especial. Ejemplo: "🍂 Colección Otoño — Color de temporada: Borgoña" con un swatch del color.

### PROHIBICIONES
- NO usar hero centrado con texto solo (se usa en FerreMax/Esencial)
- NO usar hero asimétrico con blob orgánico (se usa en Tres Marías)
- NO usar navbar transparente con blur
- NO usar top bar de contacto (se usa en Tres Marías)
- NO usar cards masonry/staggered para servicios (se usa en Tres Marías)
- NO usar cards superpuestas/rotadas (se usa en Tres Marías)
- NO usar estética botánica, serif fonts, ni paletas cálidas/orgánicas
- NO usar FAQ en 2 columnas (se usa en Tres Marías)
- NO usar footer de 2 columnas (se usa en Tres Marías)
- NO usar footer minimal de 1 fila (se usa en FerreMax)

---

## SECCIONES

### Barra de Promos (Marquee)
- Franja angosta con bg #2B3A52, texto blanco, font-size 13px
- Contenido en scroll infinito (CSS marquee/animation translateX):
  - "Envíos a todo el país 🚚" | "3 cuotas sin interés 💳" | "15% OFF con transferencia 💰" | "Cambios sin costo 🔄"
- Se repite en loop continuo
- Se puede cerrar con una X (optional, recordar en sessionStorage)

### Navbar
- Fondo blanco, sticky top-0 z-50
- Al scroll: añade shadow-sm via IntersectionObserver o scroll listener
- Logo izquierda: imagen `nortesport.jpeg` (copiar a `/public/logo.jpeg`), height 40px
- Links centrados: "Inicio", "Productos", "Lookbook", "Nosotras", "FAQ", "Contacto"
- Cada link: font-weight 500, hover color #3B82F6, transición suave
- Derecha: icono Search (Lucide), icono ShoppingBag con badge rojo contador
- Click en ShoppingBag abre el carrito slide-in
- Hamburguesa en mobile: menú full-screen con backdrop blur, links grandes centrados
- En mobile: logo centrado, hamburguesa izquierda, carrito derecha

### Hero (FULL-WIDTH con overlay)
- Altura: min-h-[85vh] en desktop, min-h-[60vh] en mobile
- Background: gradiente placeholder de #1A2535 a #2B3A52 simulando foto de modelo (en producción se reemplaza por imagen real)
- Overlay: gradient de rgba(26,37,53,0.85) izquierda a rgba(26,37,53,0) derecha
- Contenido alineado a la izquierda, max-width 600px, padding generoso:
  - Badge: "🔥 Temporada Otoño 2026" — pill con bg rgba(59,130,246,0.2), border 1px #3B82F6, color white, backdrop-blur
  - H1: "Ropa deportiva con *actitud*" — Inter Black (900), clamp(2.5rem, 6vw, 4.5rem), color white. La palabra "actitud" en color #3B82F6 (accent)
  - Subtítulo: "Calzas, remeras, shorts y tops para entrenar, salir o vivir cómoda. Nuevos colores cada temporada." — color rgba(255,255,255,0.8), max-width 480px
  - 2 botones:
    - "Ver Colección" → bg #3B82F6, color white, border-radius 8px, padding generoso, hover scale(1.03)
    - "Ver en Instagram" → bg transparent, border 1px white, color white, border-radius 8px, hover bg white/10
  - Stats en fila debajo (solo desktop):
    - "3+" Años | "500+" Clientas | "2.000+" Prendas
    - Números en Inter Black, color white, tamaño 2rem
    - Labels en Inter 400, color rgba(255,255,255,0.6), uppercase, letter-spacing
- En mobile: contenido centrado, sin stats (se muestran en About)

### Productos (GRID E-COMMERCE con filtros)
- Background: #FFFFFF
- Eyebrow: "COLECCIÓN" — uppercase, letter-spacing 3px, color #3B82F6, font-weight 600
- Título: "Nuestros productos" — Inter Bold
- Subtítulo: "Encontrá tu próximo outfit favorito. Filtrá por categoría o talle."

**Layout desktop: sidebar + grid**
- Sidebar izquierda (width 250px, sticky):
  - **Categorías** (checkboxes): Calzas largas, Remeras, Shorts, Tops, Conjuntos
  - **Talles** (pills clickeables): XS, S, M, L, XL, XXL
  - **Precio** (range o botones): Hasta $15.000, $15.000-$25.000, $25.000+
  - **Estado** (pills): Todos, Nuevos, En oferta, Últimas unidades
  - Botón "Limpiar filtros"
  - En mobile: filtros en un drawer que se abre con botón "Filtrar" sticky bottom

**Grid de productos (3 cols desktop, 2 mobile):**
- 12 productos mock (datos desde config.js, en producción desde Google Sheets):
  1. Calza larga deportiva — $18.500 — Talles S, M, L, XL — Badge "NUEVO" — Categoría: Calzas largas
  2. Calza larga premium — $22.000 — Talles S, M, L — Badge "ÚLTIMAS" — Categoría: Calzas largas
  3. Remera dry-fit oversize — $12.000 — Talles S, M, L, XL — Categoría: Remeras
  4. Remera crop sport — $10.500 — Talles XS, S, M, L — Badge "NUEVO" — Categoría: Remeras
  5. Short con calza — $14.000 — Talles S, M, L, XL — Categoría: Shorts
  6. Short running — $11.500 (antes $14.000) — Talles S, M, L — Badge "SALE -18%" — Categoría: Shorts
  7. Top deportivo — $9.800 — Talles XS, S, M, L — Badge "NUEVO" — Categoría: Tops
  8. Top con sostén integrado — $11.000 — Talles S, M, L, XL — Categoría: Tops
  9. Conjunto calza + top — $26.000 (antes $30.300) — Talles S, M, L — Badge "SALE -14%" — Categoría: Conjuntos
  10. Conjunto short + remera — $21.000 — Talles S, M, L, XL — Badge "NUEVO" — Categoría: Conjuntos
  11. Calza biker (corta) — $13.500 — Talles S, M, L — Categoría: Calzas largas
  12. Remera manga larga térmica — $15.000 — Talles S, M, L, XL — Categoría: Remeras

- **Cada card de producto:**
  - Foto placeholder: rectángulo aspect-ratio 3/4 con gradiente (#2B3A52 a #6B7B8D) simulando foto
  - Hover: zoom suave en la imagen + overlay semi-transparente con 2 botones: "👁 Ver" y "🛒 Agregar"
  - Debajo de la foto:
    - Categoría en texto muted uppercase 11px
    - Nombre del producto — Inter SemiBold, color #1A1A1A
    - Talles disponibles como mini-pills grises (font-size 11px)
    - Precio: si tiene descuento → precio original tachado en #9CA3AF + precio actual en #1A1A1A bold. Si no, solo precio actual.
  - Badge posición absolute top-left: "NUEVO" en bg #2B3A52, "SALE -X%" en bg #EF4444, "ÚLTIMAS" en bg #F59E0B. Color white, font-size 11px, uppercase.

**Quick View Modal:**
- Se abre al hacer click en "👁 Ver" en una card
- Modal centrado con backdrop oscuro, max-width 800px
- 2 columnas: izquierda foto grande (aspect 3:4 placeholder) | derecha info
- Info: nombre, precio (con descuento si aplica), descripción corta, selector de talle (pills, click selecciona, borde #3B82F6 cuando activo), cantidad (+/-), 2 botones: "Agregar al carrito" (bg #2B3A52) y "Comprar ahora" (bg #3B82F6)
- "Comprar ahora" agrega al carrito y abre checkout directo
- Botón X para cerrar, click fuera cierra

### Carrito (SLIDE-IN PANEL)
- Panel que se desliza desde la derecha, width 400px (full en mobile)
- Header: "Tu carrito (X)" con botón X para cerrar
- Lista de items:
  - Thumbnail 60x60 (placeholder gradiente)
  - Nombre + talle seleccionado
  - Precio unitario
  - Cantidad editable (+/-)
  - Botón eliminar (trash icon)
  - Subtotal por item
- Divider
- Total del carrito en bold grande
- **2 opciones de checkout:**
  1. **"Pagar con MercadoPago"** → botón bg #3B82F6, color white. Por ahora, al hacer click muestra un toast/alert: "Integración con MercadoPago próximamente. Por ahora, usá WhatsApp." En producción se conecta con la SDK de MercadoPago.
  2. **"Continuar por WhatsApp"** → botón bg #25D366 (verde WhatsApp), color white, icono WhatsApp. Abre WhatsApp con mensaje formateado:
  ```
  🏋️ *Nuevo pedido — Norte Sport*

  👤 Nombre: [input nombre]

  📋 Productos:
  • 1x Calza larga deportiva (Talle M) — $18.500
  • 2x Remera dry-fit oversize (Talle L) — $24.000

  💰 Total: $42.500

  📝 Notas: [input notas]
  ```
- Input nombre y notas aparecen en el carrito antes de los botones de checkout
- Carrito persistido en localStorage
- Si el carrito está vacío: ilustración/texto "Tu carrito está vacío" + botón "Ver productos"

### Lookbook / Galería (MASONRY)
- Background: #F7F8FA
- Eyebrow: "LOOKBOOK"
- Título: "Inspirate con los looks"
- Subtítulo: "Combiná prendas y armá tu outfit perfecto."
- Grid masonry de 8 fotos placeholder (gradientes simulando fotos de outfits):
  1. Grande (2x2): Gradiente navy → gris — "Look Gym Day" — badge "4 prendas"
  2. Normal: Gradiente azul → blanco — "Look Running"
  3. Normal: Gradiente gris → navy — "Look Casual Sport"
  4. Grande (2x1 horizontal): Gradiente accent → navy — "Look Training" — badge "Más vendido"
  5. Normal: Gradiente navy → accent — "Look Yoga"
  6. Normal: Gradiente gris claro → blanco — "Look Streetwear"
  7. Grande (2x2): Gradiente dark → accent — "Look Full Set" — badge "Nuevo"
  8. Normal: Gradiente navy → gris — "Look Weekend"
- Cada foto: border-radius 12px, hover → overlay #2B3A52 opacity 0.7, texto blanco con nombre del look
- En mobile: grid de 2 columnas simétrico
- Lightbox al click con navegación entre fotos
- Las fotos se gestionan desde Google Drive (carpeta de imágenes) + admin dashboard para ordenar y configurar metadata (título, badge, tamaño en grid)

### Nosotras (About)
- Background: #FFFFFF
- 2 columnas:
  - Izquierda: foto placeholder (gradiente navy simulando foto del equipo/marca)
  - Derecha: contenido
- Eyebrow: "NOSOTRAS"
- Título: "Somos Norte Sport"
- Texto: "Arrancamos con la idea de que la ropa deportiva no tiene que ser aburrida. Cada temporada elegimos un color, seleccionamos las mejores prendas y las traemos para vos. No somos una marca más: somos tu norte para encontrar tu estilo."
- Stats animados (counter up con IntersectionObserver):
  - 3+ Años
  - 500+ Clientas felices
  - 2.000+ Prendas vendidas
  - 100% Online
- Cada stat: número en Inter Black color #2B3A52, label en Inter 400 color #6B7B8D
- Stats en fila de 4 en desktop, grid 2x2 en mobile

### Testimonios (CAROUSEL)
- Background: #F7F8FA
- Eyebrow: "TESTIMONIOS"
- Título: "Lo que dicen nuestras clientas"
- Carousel horizontal con autoplay (5s), pausable en hover:
  1. "Las calzas son increíbles, no se transparentan y son súper cómodas. Ya pedí 3 veces." — María L. — ⭐⭐⭐⭐⭐
  2. "Me encanta que cada temporada traen colores nuevos. Siempre hay algo lindo." — Valentina R. — ⭐⭐⭐⭐⭐
  3. "Compré un conjunto y me llegó al día siguiente. Excelente atención." — Camila S. — ⭐⭐⭐⭐⭐
  4. "La calidad es muy buena para el precio. Las remeras dry-fit son mi favorito." — Lucía M. — ⭐⭐⭐⭐⭐
  5. "Pedí por WhatsApp y fue súper fácil. Me asesoraron con el talle perfecto." — Florencia G. — ⭐⭐⭐⭐⭐
  6. "El short con calza es lo mejor que compré este año. Lo uso para todo." — Sol P. — ⭐⭐⭐⭐⭐
- Cada testimonial: card blanca con shadow-sm, avatar circle placeholder (iniciales), nombre, texto, estrellas
- Dots de navegación en #2B3A52
- En mobile: 1 card visible, swipeable

### FAQ (ACCORDION LIMPIO)
- Background: #FFFFFF
- Título centrado: "Preguntas frecuentes"
- Subtítulo: "Resolvé tus dudas antes de comprar"
- Accordion centrado, max-width 700px, mx-auto:
  1. ¿Cómo compro? → Podés agregar productos al carrito y pagar con MercadoPago, o enviarnos tu pedido por WhatsApp. Te confirmamos stock y coordinamos el envío o retiro.
  2. ¿Cómo elijo el talle correcto? → En cada producto vas a encontrar los talles disponibles. Si tenés dudas, escribinos por WhatsApp y te ayudamos con la guía de talles.
  3. ¿Hacen envíos a todo el país? → Sí, enviamos a todo Argentina por correo o transporte. En Santiago del Estero capital, entrega en el día o al día siguiente.
  4. ¿Puedo cambiar o devolver? → Sí, tenés 7 días para cambiar tu prenda por otro talle o producto. Solo tiene que estar sin uso y con etiqueta.
  5. ¿Qué medios de pago aceptan? → Efectivo, transferencia bancaria (15% OFF), MercadoPago (hasta 3 cuotas sin interés) y tarjetas de crédito/débito.
  6. ¿Por qué cambian los colores cada temporada? → Trabajamos con una marca que renueva su paleta de colores cada temporada. Eso significa que cada colección es limitada — cuando se agotan, no vuelven. ¡Aprovechá los que te gusten!
  7. ¿Tienen local físico? → No, somos 100% online. Vendemos por WhatsApp, Instagram y nuestra web. Pero podés retirar tu pedido en Santiago del Estero capital.
- Cada pregunta: border-bottom 1px #E5E7EB, padding 16px 0, click expande con animación height, icono ChevronDown que rota 180deg, texto respuesta en color #6B7B8D

### Contacto
- Background: #F7F8FA
- Título: "¿Querés saber más?"
- Subtítulo: "Escribinos y te respondemos en minutos"
- 2 columnas:

**Izquierda — Info de contacto:**
  - Card WhatsApp: icono + "385-555-0000" + "Respondemos en menos de 1 hora" (link directo)
  - Card Instagram: icono + "@nortesport.sde" + "Seguinos para ver las novedades" (link)
  - Card Horarios: icono Clock + "Lun a Sáb 8:00-22:00"
  - Card Envíos: icono Truck + "Envíos a todo el país"
  - Cards con bg white, border 1px #E5E7EB, border-radius 12px, hover shadow-md

**Derecha — Formulario:**
  - Inputs: Nombre, WhatsApp, Consulta (textarea)
  - Inputs con bg #F7F8FA, border 1px #E5E7EB, border-radius 8px, focus border #3B82F6
  - Select: "¿Sobre qué querés consultar?" (Productos, Talles, Envíos, Pagos, Otro)
  - Botón "Enviar por WhatsApp" → bg #25D366, color white, abre WhatsApp con datos formateados
  - Texto chico: "Te respondemos en menos de 1 hora durante horario comercial"

### Footer (4 COLUMNAS MODERNO)
- Background: #1A2535, texto blanco
- Borde top: línea de 3px bg #3B82F6
- 4 columnas:

**Col 1 — Marca:**
  - Logo (imagen) + "Norte Sport" en Inter Bold, blanco
  - "Tu norte, tu camino, tu estilo" en gris claro
  - Íconos de redes: Instagram, WhatsApp

**Col 2 — Navegación:**
  - Título "Navegación" en uppercase, letter-spacing, color gris
  - Links: Inicio, Productos, Lookbook, Nosotras, FAQ, Contacto

**Col 3 — Categorías:**
  - Título "Categorías"
  - Links: Calzas, Remeras, Shorts, Tops, Conjuntos

**Col 4 — Contacto:**
  - Título "Contacto"
  - WhatsApp: 385-555-0000
  - Instagram: @nortesport.sde
  - Horario: Lun a Sáb 8:00-22:00
  - Ubicación: Santiago del Estero, Argentina

- Copyright: "© 2026 Norte Sport · Santiago del Estero, Argentina"
- "Hecho con 💪 en Santiago del Estero"

---

## FUNCIONALIDADES

### 1. Catálogo de productos (Google Sheets CMS)
- Hoja "Productos" con columnas: ID, Nombre, Categoria, Descripcion, Precio, PrecioAnterior, Talles (comma-separated: "S,M,L,XL"), ColorTemporada, Badge, ImagenURL, Destacado, Disponible, Orden
- Hoja "Ofertas" con columnas: ID, Nombre, PrecioOferta, PrecioAnterior, Descuento, Descripcion, Vigencia, Activa
- Hoja "Testimonios" con columnas: ID, Nombre, Texto, Estrellas, Orden
- Hoja "Config" con columnas: Clave, Valor (para temporada actual, color de temporada, textos del hero, promos del marquee, etc.)
- Hoja "Lookbook" con columnas: ID, Titulo, Badge, Tamaño (Normal/Grande/Horizontal), ImagenURL, Orden, Destacado
- lib/sheets.js con fetch + revalidate 300
- Fallback a config.js si Google Sheets no responde
- Sheet ID placeholder en config.js

### 2. Google Drive como almacenamiento de imágenes
- Las imágenes de productos y del lookbook se almacenan en una carpeta de Google Drive
- En la hoja de Sheets, la columna ImagenURL contiene el link público de la imagen en Drive
- Helper function en lib/drive.js para convertir links de Drive a URLs directas de imagen:
  - Input: `https://drive.google.com/file/d/FILE_ID/view`
  - Output: `https://drive.google.com/uc?export=view&id=FILE_ID`
- Las imágenes se renderizan con `<Image>` de Next.js usando la URL directa
- Fallback: si la imagen falla, mostrar placeholder con gradiente + icono de imagen

### 3. Generador de catálogos PDF (/admin/dashboard)
- Login con contraseña: "nortesport2026"
- Upload Excel (.xlsx, .csv) con productos
- Detecta columnas con "precio"
- Dropdown para elegir lista de precios
- Input de margen %
- Mapeo de columnas flexible
- Filtro por categoría
- PDF con fotos (thumbnail desde ImagenURL o placeholder)
- Header PDF: "Norte Sport" con datos de contacto
- Footer PDF: "Lista de precios — [fecha]"
- Colores del PDF: header #2B3A52, bordes tabla #E5E7EB, accent #3B82F6

### 4. Carrito de compras
- Persistido en localStorage
- Agregar desde cards de producto o desde Quick View
- Selección de talle obligatoria antes de agregar
- Cantidad editable en el carrito
- Doble checkout:
  - MercadoPago: placeholder con toast "Próximamente" (se integra en producción con SDK MP)
  - WhatsApp: mensaje formateado con todos los items, talles, cantidades, total y datos del cliente
- Badge contador en la navbar

### 5. Gestión de Lookbook / Galería (/admin/dashboard)
- Tab "Lookbook" en el dashboard admin
- Fuente primaria: Google Drive (las fotos se cargan a una carpeta de Drive y se referencian en Sheets)
- Panel admin para:
  - Ver todas las fotos del lookbook (cargadas desde Sheets/Drive)
  - Reordenar con drag & drop
  - Editar metadata: título, badge, tamaño en grid (Normal, Grande, Horizontal)
  - Marcar como destacado
  - Agregar manualmente (URL de imagen + metadata) para fotos que no están en Sheets
- Vista previa del grid masonry
- Datos de orden/configuración se guardan en localStorage (en producción: Sheets o Supabase)

### 6. Dashboard Admin (/admin/dashboard)
- Acceso: /admin → login → /admin/dashboard
- Tabs/sidebar: "Catálogos" | "Lookbook" | "Productos" (vista rápida de Sheets)
- Tab activa con indicator en #3B82F6
- Tab "Productos": tabla con los productos de Sheets, edición inline de precio/disponibilidad (guarda en localStorage como override, en producción se sincroniza con Sheets API)

### 7. SEO
- Metadata en layout.jsx:
  - title: "Norte Sport | Ropa deportiva femenina — Santiago del Estero"
  - description: "Tienda online de ropa deportiva para mujeres. Calzas, remeras, shorts y tops. Nuevos colores cada temporada. Envíos a todo el país."
- JSON-LD LocalBusiness con todos los datos
- Sitemap básico
- robots.txt
- Open Graph tags con imagen placeholder

---

## STACK

- Next.js 14+ App Router
- JavaScript (NO TypeScript)
- Tailwind CSS 3+
- Lucide React (iconos)
- SheetJS (xlsx) para parsing Excel en admin
- jsPDF + jspdf-autotable para PDFs
- Google Fonts: Inter (+ opcionalmente Bebas Neue)
- CSS puro para animaciones (IntersectionObserver para scroll reveal, counter up, marquee)
- Deploy-ready Vercel

### Estructura
```
/app
  page.jsx
  /admin
    page.jsx
    /dashboard
      page.jsx
  layout.jsx
  globals.css
/components
  /landing
    PromoBar.jsx, Navbar.jsx, Hero.jsx, Productos.jsx,
    ProductCard.jsx, QuickViewModal.jsx, FilterSidebar.jsx,
    Lookbook.jsx, CarritoPanel.jsx, AboutUs.jsx,
    Testimonios.jsx, FAQ.jsx, Contacto.jsx, Footer.jsx
  /admin
    LoginForm.jsx, FileUpload.jsx, ConfigPanel.jsx,
    PreviewTable.jsx, CategoryFilter.jsx, PDFGenerator.jsx,
    LookbookManager.jsx, LookbookForm.jsx, LookbookGrid.jsx,
    ProductosTable.jsx
  /ui
    Button.jsx, Card.jsx, Badge.jsx, Modal.jsx
/lib
  config.js, sheets.js, drive.js, excel-parser.js, pdf-generator.js
/public
  logo.jpeg
tailwind.config.js
```

### config.js incluir:
- Todos los datos del negocio (nombre, slogan, contacto, redes, horarios)
- waLink helper function
- temporadaActual: { nombre: "Otoño 2026", color: "#8B1A2B", colorNombre: "Borgoña" }
- Array de productos mock (los 12 detallados) con: id, nombre, categoria, descripcion, precio, precioAnterior, talles[], badge, placeholder (gradiente CSS), disponible
- Array de categorías: ["Calzas largas", "Remeras", "Shorts", "Tops", "Conjuntos"]
- Array de talles: ["XS", "S", "M", "L", "XL", "XXL"]
- Array de testimonios mock (los 6 detallados)
- Array de FAQs (las 7 detalladas)
- Array de lookbook mock (los 8 detallados con: id, titulo, badge, tamaño, placeholder)
- Array de stats (los 4 del About)
- Array de promos del marquee
- Configuración admin y PDF (contraseña, colores del PDF, nombre de empresa)

### tailwind.config.js extender:
```javascript
colors: {
  primary: { DEFAULT: '#2B3A52', light: '#E8EDF3', dark: '#1A2535' },
  secondary: { DEFAULT: '#6B7B8D', light: '#F0F2F5' },
  bg: { DEFAULT: '#FFFFFF', alt: '#F7F8FA' },
  accent: { DEFAULT: '#3B82F6', light: '#EFF6FF' },
  border: { DEFAULT: '#E5E7EB' },
  dark: { DEFAULT: '#1A1A1A' },
  sale: { DEFAULT: '#EF4444' },
  whatsapp: { DEFAULT: '#25D366' },
},
fontFamily: {
  display: ['"Inter"', 'sans-serif'],
  body: ['"Inter"', 'sans-serif'],
}
```

### globals.css incluir:
- Import de Google Fonts (Inter 400, 500, 600, 700, 900)
- Selection: bg #3B82F6, color white
- Scroll-behavior smooth
- Animaciones CSS para scroll reveal (fade-in + translateY)
- Animación marquee para la barra de promos
- Counter-up animation para stats
- Transiciones suaves globales
- Scrollbar custom estilizada (thin, colores navy)

Verificar `npm run build` y `npm run dev` sin errores.
```

---

## RESUMEN DE DIFERENCIAS VS OTROS PROYECTOS

| Elemento | FerreMax (Esencial) | ElectroNorte (Profesional) | Tres Marías | Norte Sport |
|----------|-------------------|--------------------------|-------------|-------------|
| Hero | Centrado, sin carrusel | 2 columnas + carrusel | Asimétrico + blob orgánico | Full-width + overlay gradient |
| Navbar | Transparente → sólida | Fija con blur | Top bar + navbar elegante | Sticky minimalista + search + carrito |
| Color | Verde bosque #2D6A4F | Azul corporativo #1E40AF | Rosa terracota #A0616D | Navy #2B3A52 + accent blue |
| Tipografía | DM Serif + DM Sans | Playfair + Source Sans 3 | Cormorant Garamond + Jost | Inter (single family, multi-weight) |
| Productos | Grid simple | Grid con filtros básicos | Masonry staggered | Grid e-commerce + sidebar filtros + quick view |
| FAQ | Tabs por categoría | Accordion columna única | 2 columnas expandibles | Accordion limpio centrado |
| Footer | Minimal 1 fila | Completo 4 columnas | 2 columnas + botánico | 4 columnas moderno |
| Contacto | Solo WhatsApp | Formulario completo | Cards + formulario elegante | Cards info + formulario WhatsApp |
| Galería | No | No | Portfolio con categorías | Lookbook masonry |
| Carrito | No | No | Pedido → WhatsApp | Carrito completo + MercadoPago + WhatsApp |
| Estética | Limpio, cálido | Corporativo, serio | Botánico, femenino, elegante | Moderno, urbano, deportivo |
| CMS | Sheets | Sheets | Sheets | Sheets + Drive (imágenes) |
| Barra superior | No | Banner closeable | Top bar contacto | Marquee de promos |
