# Norte Sport — Documentacion Completa del Proyecto

> Tienda online de ropa deportiva femenina desarrollada con Next.js 14, Tailwind CSS y React.

---

## Tabla de Contenidos

1. [Descripcion General](#1-descripcion-general)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Requisitos Previos](#3-requisitos-previos)
4. [Instalacion y Ejecucion](#4-instalacion-y-ejecucion)
5. [Estructura del Proyecto](#5-estructura-del-proyecto)
6. [Paginas y Rutas](#6-paginas-y-rutas)
7. [Componentes del Landing](#7-componentes-del-landing)
8. [Panel de Administracion](#8-panel-de-administracion)
9. [Carrito de Compras](#9-carrito-de-compras)
10. [Sistema de Filtros](#10-sistema-de-filtros)
11. [SEO](#11-seo)
12. [Paleta de Colores](#12-paleta-de-colores)
13. [Tipografia](#13-tipografia)
14. [Animaciones y Efectos](#14-animaciones-y-efectos)
15. [Personalizacion](#15-personalizacion)
16. [Deploy en Vercel](#16-deploy-en-vercel)
17. [Variables y Configuracion Importante](#17-variables-y-configuracion-importante)

---

## 1. Descripcion General

**Norte Sport** es una tienda online (e-commerce) de ropa deportiva femenina con sede en Santiago del Estero, Argentina. El proyecto consiste en un sitio web tipo single-page landing con carrito de compras, sistema de filtros, galeria lookbook y un panel de administracion privado.

### Que hace

- Muestra un catalogo de productos deportivos (calzas, remeras, shorts, tops y conjuntos) con precios, talles y badges de estado.
- Permite a las clientas agregar productos al carrito, seleccionar talle y cantidad, y finalizar la compra via WhatsApp o MercadoPago (placeholder).
- Ofrece un panel administrativo protegido con contrasena para gestionar catalogos PDF, lookbook y productos.
- Integra datos desde Google Sheets como fuente de datos remota (configurable), con fallback a datos locales en `config.js`.

### Publico objetivo

Mujeres que buscan ropa deportiva comoda, accesible y con estilo. El negocio es 100% online, con ventas a traves de WhatsApp, Instagram y la web. Los envios cubren todo el territorio argentino.

### Datos del negocio

| Campo | Valor |
|---|---|
| Nombre | Norte Sport |
| Slogan | "Tu norte, tu camino, tu estilo" |
| Ubicacion | Santiago del Estero, Argentina |
| WhatsApp | 385-478-8733 |
| Instagram | @nortesport.sgo |
| Horarios | Lun a Sab 8:00-22:00 |
| Experiencia | 3+ anos |
| Clientas | 500+ |
| Productos vendidos | 2.000+ |

---

## 2. Stack Tecnologico

| Tecnologia | Version | Descripcion |
|---|---|---|
| **Next.js** | 14.1.x | Framework de React para produccion. Proporciona App Router, renderizado del lado del servidor, optimizacion automatica y generacion de sitemap/robots. |
| **React** | 18.2.x | Biblioteca para construir interfaces de usuario con componentes reutilizables. |
| **JavaScript (ES6+)** | — | Lenguaje principal del proyecto. No se usa TypeScript. |
| **Tailwind CSS** | 3.4.x | Framework de utilidades CSS para estilizado rapido y responsivo. Configuracion personalizada con colores de marca. |
| **Lucide React** | 0.344.x | Biblioteca de iconos SVG ligera y consistente. Se usa en toda la interfaz para iconografia. |
| **jsPDF** | 2.5.x | Generacion de documentos PDF en el navegador. Se usa en el panel admin para crear catalogos de precios. |
| **jsPDF-AutoTable** | 3.8.x | Plugin de jsPDF para generar tablas formateadas automaticamente dentro de los PDF. |
| **SheetJS (xlsx)** | 0.18.x | Lectura y parseo de archivos Excel (.xlsx) y CSV en el navegador. Se usa en el generador de catalogos. |
| **PostCSS** | 8.4.x | Procesador CSS utilizado por Tailwind para transformar y optimizar estilos. |
| **Autoprefixer** | 10.4.x | Plugin de PostCSS que agrega prefijos de navegador automaticamente. |
| **ESLint** | 8.56.x | Herramienta de analisis estatico de codigo con la configuracion estandar de Next.js. |

---

## 3. Requisitos Previos

Antes de instalar y ejecutar el proyecto, se necesita tener instalado:

- **Node.js** version 18.0 o superior (recomendado: ultima version LTS)
- **npm** version 9.0 o superior (incluido con Node.js)
- **Editor de codigo** (recomendado: Visual Studio Code con las extensiones Tailwind CSS IntelliSense y ES7+ React Snippets)
- **Git** (opcional, para clonar el repositorio)
- **Navegador moderno** (Chrome, Firefox, Edge o Safari actualizado)

Para verificar las versiones instaladas:

```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
```

---

## 4. Instalacion y Ejecucion

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/norte-sport.git
cd norte-sport
```

O si ya tenemos la carpeta del proyecto, simplemente navegar a ella:

```bash
cd norte-sport
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalara todas las dependencias listadas en `package.json` (Next.js, React, Tailwind CSS, Lucide, jsPDF, SheetJS, etc.).

### Paso 3: Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor de desarrollo se levantara en `http://localhost:3000`. Los cambios en el codigo se reflejan automaticamente gracias al Hot Module Replacement de Next.js.

### Paso 4: Compilar para produccion

```bash
npm run build
```

Genera una version optimizada del proyecto en la carpeta `.next/`. Para servir la version compilada:

```bash
npm start
```

### Paso 5: Ejecutar linter

```bash
npm run lint
```

Ejecuta ESLint con la configuracion de Next.js para verificar la calidad del codigo.

### Resumen de scripts

| Script | Comando | Descripcion |
|---|---|---|
| `dev` | `next dev` | Inicia el servidor de desarrollo con hot-reload |
| `build` | `next build` | Compila el proyecto para produccion |
| `start` | `next start` | Sirve la version compilada |
| `lint` | `next lint` | Ejecuta ESLint para analisis de codigo |

---

## 5. Estructura del Proyecto

```
norte-sport/
|-- app/                              # App Router de Next.js 14
|   |-- globals.css                   # Estilos globales, animaciones CSS, fuente Inter
|   |-- layout.jsx                    # Layout raiz con metadata SEO y JSON-LD
|   |-- page.jsx                      # Pagina principal (landing page)
|   |-- robots.js                     # Configuracion de robots.txt dinamico
|   |-- sitemap.js                    # Sitemap XML dinamico
|   |-- admin/
|       |-- page.jsx                  # Pagina de login del panel admin
|       |-- dashboard/
|           |-- page.jsx              # Dashboard administrativo con tabs
|
|-- components/
|   |-- landing/                      # 14 componentes de la landing page
|   |   |-- PromoBar.jsx             # Barra de promociones con marquee
|   |   |-- Navbar.jsx               # Barra de navegacion sticky
|   |   |-- Hero.jsx                 # Seccion hero principal
|   |   |-- Productos.jsx            # Grilla de productos con filtros
|   |   |-- ProductCard.jsx          # Tarjeta individual de producto
|   |   |-- QuickViewModal.jsx       # Modal de vista rapida de producto
|   |   |-- CarritoPanel.jsx         # Panel lateral del carrito de compras
|   |   |-- Lookbook.jsx             # Galeria masonry con lightbox
|   |   |-- AboutUs.jsx              # Seccion "Nosotras" con stats animados
|   |   |-- Testimonios.jsx          # Carrusel de testimonios con autoplay
|   |   |-- FAQ.jsx                  # Preguntas frecuentes con acordeon
|   |   |-- Contacto.jsx             # Formulario de contacto via WhatsApp
|   |   |-- Footer.jsx               # Pie de pagina con 4 columnas
|   |   |-- FilterSidebar.jsx        # Sidebar de filtros (desktop + drawer mobile)
|   |
|   |-- admin/                        # 8 componentes del panel admin
|   |   |-- LoginForm.jsx            # Formulario de login con visibilidad de password
|   |   |-- FileUpload.jsx           # Zona de carga de archivos Excel/CSV (drag & drop)
|   |   |-- ConfigPanel.jsx          # Panel de configuracion de catalogo
|   |   |-- PreviewTable.jsx         # Tabla de preview con margenes aplicados
|   |   |-- CategoryFilter.jsx       # Filtro de categorias para el catalogo
|   |   |-- PDFGenerator.jsx         # Boton y logica de generacion de PDF
|   |   |-- LookbookManager.jsx      # Gestor del lookbook (reordenar, editar, agregar)
|   |   |-- ProductosTable.jsx       # Tabla de edicion inline de productos
|   |
|   |-- ui/                           # 4 componentes UI reutilizables
|       |-- Button.jsx               # Boton con variantes (primary, secondary, whatsapp, etc.)
|       |-- Card.jsx                  # Contenedor tipo tarjeta con borde y sombra opcional
|       |-- Badge.jsx                 # Etiqueta/badge con variantes de color
|       |-- Modal.jsx                 # Modal reutilizable con overlay y animaciones
|
|-- lib/                              # Utilidades y configuracion
|   |-- config.js                     # Configuracion central del negocio, productos, FAQs, etc.
|   |-- excel-parser.js              # Parseador de archivos Excel/CSV con SheetJS
|   |-- pdf-generator.js             # Generador de catalogos PDF con jsPDF
|   |-- sheets.js                     # Integracion con Google Sheets como fuente de datos
|   |-- drive.js                      # Utilidad para convertir URLs de Google Drive a URLs directas
|
|-- public/                           # Archivos estaticos
|   |-- logo.jpeg                     # Logo de Norte Sport
|   |-- hero/
|   |   |-- hero-bg.jpg              # Foto real de fondo del hero
|   |-- productos/                    # Fotos reales de productos (colecciones BASICS y NAVY & GREY)
|   |   |-- [nombre-limpio].jpg      # Una imagen por producto
|   |-- lookbook/                     # Fotos reales del lookbook
|       |-- [nombre-look].jpg        # Una imagen por look
|
|-- tailwind.config.js                # Configuracion de Tailwind CSS con paleta personalizada
|-- package.json                      # Dependencias y scripts del proyecto
|-- postcss.config.js                 # Configuracion de PostCSS
```

### Descripcion de carpetas clave

#### `/app` — Paginas y rutas

Utiliza el App Router de Next.js 14. Cada carpeta dentro de `app/` define una ruta. Los archivos `page.jsx` son los puntos de entrada de cada ruta. El archivo `layout.jsx` en la raiz define el layout global con la etiqueta `<html>`, metadata SEO y JSON-LD estructurado.

#### `/components/landing` — Componentes del landing (14 archivos)

Todos los componentes visuales de la pagina principal. Estan marcados como `'use client'` porque utilizan hooks de React (useState, useEffect, useRef, useCallback) y APIs del navegador (IntersectionObserver, localStorage, sessionStorage).

#### `/components/admin` — Componentes del panel admin (8 archivos)

Componentes del dashboard administrativo. Incluyen formularios, tablas, gestores de archivos y generadores de PDF. Todos son componentes cliente.

#### `/components/ui` — Componentes UI reutilizables (4 archivos)

Componentes genericos de interfaz: Button, Card, Badge y Modal. Estan desacoplados de la logica de negocio y pueden reutilizarse en cualquier parte del proyecto.

#### `/lib` — Utilidades y configuracion (5 archivos)

Modulos de JavaScript con la logica de negocio, configuracion del sitio, parseo de archivos, generacion de PDFs e integracion con servicios de Google.

#### `/public` — Archivos estaticos

Contiene el logo del negocio (`logo.jpeg`), la foto de fondo del hero (`hero/hero-bg.jpg`), fotos reales de productos organizadas en dos colecciones BASICS y NAVY & GREY (`productos/[nombre-limpio].jpg`) y fotos reales del lookbook (`lookbook/[nombre-look].jpg`). Los componentes muestran estas imagenes reales con fallback a gradientes CSS como placeholders si la imagen no carga.

---

## 6. Paginas y Rutas

El proyecto define tres rutas principales:

### `/` — Landing Page

**Archivo:** `app/page.jsx`

La pagina principal del sitio. Es una single-page application que muestra todas las secciones del negocio en un flujo vertical. Gestiona el estado global del carrito (con persistencia en localStorage) y los modales de vista rapida.

**Secciones en orden:**
1. PromoBar (barra de promociones)
2. Navbar (navegacion)
3. Hero (seccion principal)
4. Productos (catalogo con filtros)
5. Lookbook (galeria de looks)
6. AboutUs (nosotras)
7. Testimonios (carrusel)
8. FAQ (preguntas frecuentes)
9. Contacto (formulario WhatsApp)
10. Footer (pie de pagina)
11. CarritoPanel (panel lateral, siempre montado)
12. QuickViewModal (modal, se muestra al hacer click en un producto)

### `/admin` — Login Administrativo

**Archivo:** `app/admin/page.jsx`

Pagina de acceso al panel de administracion. Muestra un formulario de contrasena centrado en pantalla. Al ingresar la contrasena correcta, guarda `authenticated: true` en `sessionStorage` y redirige a `/admin/dashboard`.

### `/admin/dashboard` — Panel de Administracion

**Archivo:** `app/admin/dashboard/page.jsx`

Dashboard protegido con tres tabs: Catalogos, Lookbook y Productos. Verifica la autenticacion en `sessionStorage` al montar el componente; si no esta autenticado, redirige a `/admin`.

---

## 7. Componentes del Landing

### 7.1 PromoBar

**Archivo:** `components/landing/PromoBar.jsx`

Barra fija en la parte superior del sitio que muestra las promociones activas con una animacion de marquee (texto desplazandose de derecha a izquierda de forma continua e infinita).

**Caracteristicas:**
- **Animacion marquee:** El texto se duplica 4 veces y se desplaza con CSS `animation: marquee 30s linear infinite`.
- **Cierre con sessionStorage:** Cuando la usuaria cierra la barra con el boton X, se guarda la clave `norte-promo-bar-closed` en `sessionStorage` con valor `"1"`. Al recargar la pagina (dentro de la misma sesion), la barra permanece oculta. Al cerrar el navegador y volver a entrar, la barra reaparece.
- **Promociones configurables:** Lee el array `promos` desde `lib/config.js`. Las promociones por defecto son: envios, cuotas, descuento por transferencia y cambios sin costo.

### 7.2 Navbar

**Archivo:** `components/landing/Navbar.jsx`

Barra de navegacion fija (sticky) en la parte superior.

**Caracteristicas:**
- **Sticky con sombra al scroll:** Usa `position: sticky` y detecta el evento `scroll` para agregar `shadow-sm` cuando `window.scrollY > 10`.
- **Desktop:** Muestra logo a la izquierda, links de navegacion en el centro (Inicio, Productos, Lookbook, Nosotras, FAQ, Contacto) e iconos de busqueda y carrito a la derecha.
- **Mobile:** Logo centrado, hamburguesa a la izquierda, carrito a la derecha.
- **Menu mobile:** Overlay fullscreen con backdrop blur. Los links aparecen centrados con animacion escalonada (`animationDelay` incrementandose 50ms por link). Al abrirse, el body scroll se bloquea con `overflow: hidden`.
- **Badge del carrito:** Muestra el conteo total de items como un circulo rojo sobre el icono `ShoppingBag`.

### 7.3 Hero

**Archivo:** `components/landing/Hero.jsx`

Seccion principal tipo hero con foto real de fondo (`/public/hero/hero-bg.jpg`), texto grande y botones de accion.

**Caracteristicas:**
- **Full-width:** Ocupa el 100% del ancho con altura minima de 60vh en mobile y 85vh en desktop.
- **Overlay gradient:** Gradiente de izquierda (oscuro) a derecha (transparente) sobre el fondo para asegurar legibilidad del texto.
- **Badge de temporada:** Pill que indica la temporada actual (ej. "Temporada Otono 2026") leida desde `temporadaActual` en config.
- **CTAs:** Dos botones: "Ver Coleccion" (ancla a #productos) y "Ver en Instagram" (link externo).
- **Stats:** En desktop, muestra 3 estadisticas (anos, clientas, prendas vendidas) debajo de los botones. En mobile estas se ocultan.
- **Tipografia responsive:** Usa `clamp(2.5rem, 6vw, 4.5rem)` para que el titulo se adapte al viewport.

### 7.4 Productos

**Archivo:** `components/landing/Productos.jsx`

Seccion principal del catalogo de productos con grilla y sistema de filtros.

**Caracteristicas:**
- **Layout:** Sidebar de filtros a la izquierda (desktop) + grilla de productos a la derecha.
- **Grilla responsive:** 2 columnas en mobile, 3 en desktop, con gap de 4 (mobile) o 6 (desktop).
- **Integracion con FilterSidebar:** Gestiona el estado de filtros (categorias, talles, precios, estado) y los pasa como props.
- **Logica de filtrado:** Filtra los productos por: categoria (inclusion), talle (interseccion con talles del producto), rango de precio (min/max) y badge de estado (NUEVO, SALE, ULTIMAS).
- **Contador de resultados:** Muestra "X productos (filtrado)" cuando hay filtros activos.
- **Estado vacio:** Si no hay resultados, muestra un mensaje con boton "Limpiar filtros".
- **Boton flotante mobile:** Boton fijo en la parte inferior centrado para abrir los filtros en dispositivos moviles.

### 7.5 ProductCard

**Archivo:** `components/landing/ProductCard.jsx`

Tarjeta individual de producto dentro de la grilla.

**Caracteristicas:**
- **Imagen real con fallback:** Muestra la foto real del producto desde `/public/productos/[nombre-limpio].jpg` (configurada via `imagenUrl` en el producto). Si la imagen no carga, usa un gradiente CSS como placeholder.
- **Hover effects:** Al pasar el cursor, la imagen hace zoom sutil (`scale(1.05)` con transicion de 400ms) y aparece un overlay oscuro con botones "Ver" y "Agregar".
- **Badges:** Muestra badges de estado con diferentes colores:
  - NUEVO: fondo `primary` (#2B3A52)
  - SALE: fondo `sale` (#EF4444) mostrando el porcentaje de descuento
  - ULTIMAS: fondo amarillo
- **Precios:** Si el producto tiene `precioAnterior`, muestra el precio anterior tachado y el precio actual en rojo (sale). Formateado con `toLocaleString('es-AR')`.
- **Pills de talle:** Muestra los talles disponibles como pequenas etiquetas grises debajo del nombre.

### 7.6 QuickViewModal

**Archivo:** `components/landing/QuickViewModal.jsx`

Modal de vista rapida que se abre al hacer click en "Ver" en una ProductCard.

**Caracteristicas:**
- **Layout split:** Grid de 2 columnas en desktop (foto real del producto a la izquierda con fallback a gradiente, informacion a la derecha). En mobile se apilan verticalmente.
- **Selector de talle:** Botones de talle que se resaltan con borde azul al seleccionarse. Si se intenta agregar al carrito sin seleccionar talle, muestra un mensaje de error en rojo.
- **Selector de cantidad:** Controles +/- con un minimo de 1 unidad.
- **Botones de accion:**
  - "Agregar al carrito": agrega el producto y cierra el modal.
  - "Comprar ahora": misma funcionalidad (agrega y cierra).
- **Precio con descuento:** Muestra precio anterior tachado, porcentaje de descuento y precio actual.
- **Usa el componente Modal** (`components/ui/Modal.jsx`) como wrapper.

### 7.7 CarritoPanel

**Archivo:** `components/landing/CarritoPanel.jsx`

Panel lateral (drawer) que se desliza desde la derecha al abrir el carrito.

**Caracteristicas:**
- **Slide-in desde la derecha:** Animacion CSS `translateX` con transicion de 300ms. Ancho completo en mobile, 400px en desktop (sm).
- **Backdrop:** Overlay negro semitransparente que cierra el panel al hacer click.
- **Persistencia en localStorage:** El estado del carrito se guarda como JSON en `localStorage` con la clave `norte-sport-carrito`. Se carga al montar el componente y se actualiza en cada cambio.
- **Items del carrito:** Cada item muestra miniatura (foto real del producto con fallback a gradiente), nombre, talle, precio unitario, controles de cantidad (+/-) y subtotal. Boton de eliminar (icono papelera).
- **Estado vacio:** Muestra icono de bolsa, mensaje "Tu carrito esta vacio" y boton "Ver productos" que scrollea suavemente a la seccion de productos.
- **Campos del comprador:** Inputs de nombre y notas opcionales.
- **Checkout WhatsApp:** Genera un mensaje formateado con emojis que incluye nombre del comprador, lista de productos con cantidad, talle y precio, total y notas. Abre WhatsApp Web/App con el mensaje pre-cargado usando `wa.me`.
- **Checkout MercadoPago:** Boton placeholder que muestra un alert indicando que la integracion esta proximamente.

**Formato del mensaje de WhatsApp:**
```
Nuevo pedido -- Norte Sport

Nombre: [nombre del comprador]

Productos:
- 1x Calza larga deportiva (Talle M) -- $18.500
- 2x Remera dry-fit oversize (Talle L) -- $24.000

Total: $42.500

Notas: [notas del comprador]
```

### 7.8 Lookbook

**Archivo:** `components/landing/Lookbook.jsx`

Galeria de looks/outfits en formato masonry grid con lightbox. Muestra fotos reales desde `/public/lookbook/[nombre-look].jpg` con fallback a gradientes CSS.

**Caracteristicas:**
- **Masonry grid:** CSS Grid con 4 columnas y auto-rows de 180px en desktop; 2 columnas simetricas en mobile. Los items pueden ser de tres tamanos:
  - `normal`: 1 columna x 1 fila
  - `grande`: 2 columnas x 2 filas
  - `horizontal`: 2 columnas x 1 fila
- **Hover overlay:** Al pasar el cursor, aparece un overlay azul oscuro con el titulo del look centrado.
- **Badges:** Algunos looks tienen badges como "4 prendas", "Mas vendido" o "Nuevo".
- **Lightbox:** Al hacer click en un item, se abre un visor a pantalla completa con:
  - Flechas de navegacion (anterior/siguiente) con navegacion circular.
  - Boton de cierre.
  - Titulo del look y contador de posicion (ej. "3 / 8").
  - Click en el backdrop cierra el lightbox.

### 7.9 AboutUs

**Archivo:** `components/landing/AboutUs.jsx`

Seccion "Nosotras" con historia del negocio y estadisticas animadas.

**Caracteristicas:**
- **Layout 2 columnas:** Imagen placeholder a la izquierda, contenido textual a la derecha. En mobile se apilan.
- **IntersectionObserver:** Un observer observa la seccion de estadisticas y, cuando entra en viewport (threshold 0.2), dispara la animacion de entrada.
- **Stats con animacion escalonada:** Las 4 estadisticas (anos, clientas, prendas, 100% online) aparecen secuencialmente con:
  - Transicion de `opacity: 0` y `translateY(4px)` a visible.
  - Delay escalonado: 0ms, 150ms, 300ms, 450ms.
  - Duracion de 700ms cada una.
- El observer se desconecta despues de la primera activacion (la animacion ocurre una sola vez).

### 7.10 Testimonios

**Archivo:** `components/landing/Testimonios.jsx`

Carrusel de resenas de clientas con autoplay.

**Caracteristicas:**
- **Carrusel horizontal:** Muestra 3 cards en desktop y 1 en mobile. La cantidad visible se ajusta dinamicamente con `resize` listener.
- **Autoplay:** Avanza automaticamente cada 5 segundos. Se pausa al pasar el cursor (`onMouseEnter`) y se reanuda al salir (`onMouseLeave`).
- **Navegacion:**
  - Flechas laterales (ocultas en mobile) para avanzar/retroceder.
  - Navegacion circular: del ultimo slide vuelve al primero y viceversa.
  - Dots de navegacion debajo del carrusel, clickeables para ir a un slide especifico.
- **Cada card muestra:** Avatar con iniciales del nombre sobre fondo oscuro, nombre, texto del testimonio entre comillas y estrellas (iconos Star de Lucide en color ambar).
- **Transicion suave:** `transform: translateX()` con `transition-duration: 500ms` y `ease-in-out`.

### 7.11 FAQ

**Archivo:** `components/landing/FAQ.jsx`

Seccion de preguntas frecuentes con patron acordeon.

**Caracteristicas:**
- **Acordeon single-open:** Solo una pregunta puede estar abierta a la vez. Al abrir una nueva, la anterior se cierra automaticamente. El estado se gestiona con un solo `openIndex` (null o el indice de la pregunta abierta).
- **Animacion del chevron:** El icono ChevronDown rota 180 grados cuando la pregunta esta abierta, con transicion de 300ms.
- **Animacion de la respuesta:** Se expande/colapsa con `maxHeight` (0px a 300px) y `opacity` (0 a 1), ambas con transicion de 300ms.
- **Contenido:** 7 preguntas frecuentes sobre compras, talles, envios, devoluciones, medios de pago, temporadas y local fisico.

### 7.12 Contacto

**Archivo:** `components/landing/Contacto.jsx`

Seccion de contacto con tarjetas de informacion y formulario de consulta via WhatsApp.

**Caracteristicas:**
- **Layout 2 columnas:** Tarjetas de info a la izquierda, formulario a la derecha.
- **4 tarjetas de contacto:**
  - WhatsApp (numero + "Respondemos en menos de 1 hora")
  - Instagram (handle + "Seguinos para ver las novedades")
  - Horarios (Lun a Sab 8:00-22:00)
  - Envios a todo el pais
- Las tarjetas con link (WhatsApp e Instagram) son clicables y abren en nueva pestana.
- **Formulario de consulta:** Campos para nombre, WhatsApp, asunto (select con opciones: Productos, Talles, Envios, Pagos, Otro) y mensaje. Al enviar, genera un mensaje formateado y abre WhatsApp.
- **Boton verde WhatsApp:** Estilizado con el color oficial de WhatsApp (#25D366).

### 7.13 Footer

**Archivo:** `components/landing/Footer.jsx`

Pie de pagina con fondo oscuro y 4 columnas.

**Caracteristicas:**
- **Fondo:** Usa `primary-dark` (#1A2535) con borde superior de 3px en color `accent` (#3B82F6).
- **4 columnas:**
  1. **Marca:** Logo, slogan e iconos de redes sociales (Instagram y WhatsApp).
  2. **Navegacion:** Links a todas las secciones del sitio (Inicio, Productos, Lookbook, Nosotras, FAQ, Contacto).
  3. **Categorias:** Links a las 5 categorias de productos (Calzas largas, Remeras, Shorts, Tops, Conjuntos).
  4. **Contacto:** Telefono, Instagram, horarios y ubicacion con iconos.
- **Barra inferior:** Copyright y frase "Hecho con fuerza en Santiago del Estero".
- **Responsive:** En mobile se apila en 1 columna, en tablet en 2 columnas.

### 7.14 FilterSidebar

**Archivo:** `components/landing/FilterSidebar.jsx`

Panel lateral de filtros para la seccion de productos.

**Caracteristicas:**
- **Desktop:** Sidebar fijo de 250px de ancho con `position: sticky` (top: 96px) a la izquierda de la grilla.
- **Mobile:** Drawer que se desliza desde la parte inferior con fondo oscuro semitransparente. Altura maxima 80vh con scroll interno.
- **4 tipos de filtros:**
  1. **Categorias:** Checkboxes para cada categoria (Calzas largas, Remeras, Shorts, Tops, Conjuntos).
  2. **Talles:** Botones tipo pill para cada talle (XS, S, M, L, XL, XXL).
  3. **Precio:** 3 rangos predefinidos: Hasta $15.000, $15.000-$25.000, $25.000+.
  4. **Estado:** Botones para filtrar por badge: Todos, Nuevos, En oferta, Ultimas unidades.
- **Deseleccion:** Todos los filtros son toggle (click para activar, click de nuevo para desactivar).
- **Boton "Limpiar filtros":** Resetea todos los filtros a su estado inicial.

---

## 8. Panel de Administracion

### 8.1 Flujo de Login

1. La usuaria accede a `/admin`.
2. Se muestra un formulario minimalista con campo de contrasena (con toggle de visibilidad eye/eye-off).
3. Al ingresar la contrasena correcta (definida en `adminConfig.password` de `config.js`), se guarda `authenticated: true` en `sessionStorage`.
4. Se redirige a `/admin/dashboard`.
5. Si la contrasena es incorrecta, se muestra un error "Contrasena incorrecta" con fondo rojo claro.
6. El dashboard verifica la autenticacion al montar. Si no esta autenticada, redirige de vuelta a `/admin`.
7. Al cerrar sesion, se elimina la clave de `sessionStorage` y se redirige a `/admin`.

**Componentes involucrados:**
- `app/admin/page.jsx` — Pagina de login
- `components/admin/LoginForm.jsx` — Formulario reutilizable

### 8.2 Dashboard — Tab Catalogos

El tab "Catalogos" permite generar catalogos PDF a partir de archivos Excel o CSV.

**Flujo paso a paso:**

1. **Subir archivo (FileUpload):** Zona de drag & drop o click para seleccionar. Acepta .xlsx, .xls y .csv. El archivo se procesa con SheetJS (`excel-parser.js`), extrayendo headers y filas.

2. **Configurar catalogo (ConfigPanel):** Aparece despues de subir el archivo. Opciones:
   - Columna de precio: Selector que autodetecta columnas con nombres como "precio", "costo", "valor", etc.
   - Margen (%): Porcentaje a aplicar sobre el precio base (ej: 30% = precio * 1.30).
   - Columna "Nombre": Mapeo de que columna del Excel corresponde al nombre del producto.
   - Columna "Categoria": Mapeo de la columna de categorias.

3. **Filtrar categorias (CategoryFilter):** Si se configuro la columna de categorias, aparecen las categorias unicas extraidas del archivo como chips seleccionables. Se pueden seleccionar/deseleccionar individualmente o todas a la vez.

4. **Vista previa (PreviewTable):** Tabla con los datos filtrados mostrando hasta 20 filas. Los precios se muestran con el margen ya aplicado y formateados en ARS. Las columnas de precio se resaltan en color accent.

5. **Generar PDF (PDFGenerator):** Boton que genera un documento PDF con:
   - Header con fondo `#2B3A52`, nombre del negocio, WhatsApp, Instagram y ubicacion.
   - Titulo configurable (por defecto "Lista de Precios") con fecha de generacion.
   - Tabla con columnas Producto, Categoria y Precio.
   - Footer con linea accent, nombre del negocio, fecha y numero de pagina.
   - Se descarga automaticamente como `catalogo-norte-sport-YYYY-MM-DD.pdf`.

### 8.3 Dashboard — Tab Lookbook

**Componente:** `components/admin/LookbookManager.jsx`

Permite gestionar los items del lookbook.

**Funcionalidades:**
- **Lista de items:** Cada item muestra thumbnail, titulo, badge y tamano.
- **Reordenar:** Botones de flecha arriba/abajo para cambiar la posicion de cada item.
- **Editar metadata:** Click en el icono lapiz para editar titulo, badge y tamano (Normal, Grande, Horizontal) inline.
- **Agregar manualmente:** Formulario para agregar nuevos items con URL de imagen, titulo, badge y tamano.
- **Preview:** Boton "Ver preview" que muestra como se vera el masonry grid.
- **Restaurar:** Boton para volver a los valores originales de `config.js`.
- **Persistencia:** Todos los cambios se guardan en `localStorage` con las claves `norte_lookbook_overrides` (datos modificados) y `norte_lookbook_order` (orden personalizado).

### 8.4 Dashboard — Tab Productos

**Componente:** `components/admin/ProductosTable.jsx`

Tabla de edicion rapida de los productos del sitio.

**Funcionalidades:**
- **Tabla completa:** Muestra ID, nombre, categoria, precio, badge y disponibilidad de todos los productos.
- **Edicion inline de precio:** Click en el precio para editarlo directamente en la tabla. Soporte para Enter (guardar) y Escape (cancelar).
- **Toggle de disponibilidad:** Interruptor visual para activar/desactivar productos (verde = disponible, rojo = no disponible).
- **Indicador de cambios:** Las filas con cambios tienen un leve fondo azul. Aparece un texto explicativo sobre la persistencia en el navegador.
- **Restaurar originales:** Boton que limpia todos los overrides y restaura los valores de `config.js`.
- **Persistencia:** Los cambios se guardan en `localStorage` con la clave `norte_productos_overrides`.

---

## 9. Carrito de Compras

### Como funciona

El carrito de compras se gestiona enteramente en el cliente (front-end) con React state y localStorage.

#### Estado

El carrito es un array de objetos con la siguiente estructura:

```javascript
{
  id: 1,                  // ID del producto
  nombre: 'Calza larga deportiva',
  precio: 18500,          // Precio unitario
  talle: 'M',             // Talle seleccionado
  cantidad: 1,            // Cantidad
  imagenUrl: '/productos/calza-larga-deportiva.jpg', // URL de la imagen real
  placeholder: 'linear-gradient(...)' // Gradiente de fallback
}
```

#### Persistencia en localStorage

- **Clave:** `norte-sport-carrito`
- **Formato:** JSON serializado del array de items.
- **Carga:** Al montar el componente `Home` (`page.jsx`), se intenta leer el carrito de localStorage.
- **Guardado:** Cada vez que el state `carrito` cambia, se actualiza localStorage via un `useEffect`.

#### Operaciones

| Operacion | Funcion | Comportamiento |
|---|---|---|
| Agregar | `addToCart(product, talle, cantidad)` | Si el producto+talle ya existe, incrementa la cantidad. Si no, agrega un nuevo item. Abre el panel automaticamente. |
| Actualizar cantidad | `updateQuantity(id, talle, newCantidad)` | Cambia la cantidad de un item. No permite valores menores a 1. |
| Eliminar | `removeFromCart(id, talle)` | Elimina el item del array filtrando por ID y talle. |
| Conteo total | `cartCount` | Calculado con `reduce` sumando las cantidades de todos los items. |

#### Checkout por WhatsApp

Al presionar "Continuar por WhatsApp", se genera un mensaje formateado con:
- Nombre del comprador
- Lista de productos con cantidad, nombre, talle y subtotal
- Total general
- Notas adicionales

Se abre `https://wa.me/5493854788733?text=[mensaje codificado]` en una nueva pestana.

#### MercadoPago (Placeholder)

El boton "Pagar con MercadoPago" muestra un alert informando que la integracion esta en desarrollo. Esta preparado para ser conectado con la API de MercadoPago en el futuro.

---

## 10. Sistema de Filtros

### Arquitectura

El sistema de filtros se implementa en dos componentes:
- **`Productos.jsx`**: Gestiona el estado de filtros y aplica la logica de filtrado.
- **`FilterSidebar.jsx`**: Renderiza los controles de filtro (checkboxes, pills, rangos).

### Estado de filtros

```javascript
{
  categories: [],    // Array de strings: categorias seleccionadas
  sizes: [],         // Array de strings: talles seleccionados
  price: null,       // Objeto { min, max } o null
  status: null       // String (badge) o null
}
```

### Logica de filtrado

Los filtros se aplican de forma secuencial (AND logico):

1. **Categorias:** Si hay categorias seleccionadas, el producto debe pertenecer a alguna de ellas.
2. **Talles:** Si hay talles seleccionados, el producto debe tener al menos uno de esos talles en su array `talles`.
3. **Precio:** Si hay un rango seleccionado, el precio del producto debe estar entre `min` y `max`.
4. **Estado/Badge:** Si hay un estado seleccionado, el badge del producto debe coincidir exactamente.

### Rangos de precio predefinidos

| Etiqueta | Min | Max |
|---|---|---|
| Hasta $15.000 | 0 | 15.000 |
| $15.000-$25.000 | 15.000 | 25.000 |
| $25.000+ | 25.000 | Infinity |

### Opciones de estado

| Etiqueta | Valor interno |
|---|---|
| Todos | `null` |
| Nuevos | `'NUEVO'` |
| En oferta | `'SALE'` |
| Ultimas unidades | `'ULTIMAS'` |

### Indicador de filtros activos

El componente `Productos` calcula `hasActiveFilters` verificando si alguno de los 4 filtros tiene un valor no vacio. Cuando hay filtros activos:
- El contador de resultados muestra "(filtrado)".
- En mobile, el boton flotante muestra un badge con el numero total de filtros activos.

---

## 11. SEO

### Metadata estatica

Definida en `app/layout.jsx`:

```javascript
{
  title: 'Norte Sport | Ropa deportiva femenina -- Santiago del Estero',
  description: 'Tienda online de ropa deportiva para mujeres...',
  keywords: ['ropa deportiva femenina', 'calzas deportivas', ...],
  authors: [{ name: 'Norte Sport' }],
  openGraph: {
    title: 'Norte Sport | Ropa deportiva femenina',
    description: '...',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Norte Sport',
  },
  robots: { index: true, follow: true },
}
```

### JSON-LD (Datos estructurados)

Se inyecta un schema `LocalBusiness` en el `<head>` del layout:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Norte Sport",
  "description": "Tienda online de ropa deportiva femenina...",
  "url": "https://nortesport.com.ar",
  "telephone": "+5493854788733",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santiago del Estero",
    "addressCountry": "AR"
  },
  "openingHoursSpecification": {
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "22:00"
  },
  "sameAs": ["https://www.instagram.com/nortesport.sgo"]
}
```

### Sitemap

**Archivo:** `app/sitemap.js`

Genera un sitemap XML dinamico con las siguientes URLs:

| URL | Prioridad | Frecuencia |
|---|---|---|
| `https://nortesport.com.ar` | 1.0 | weekly |
| `https://nortesport.com.ar/#productos` | 0.8 | weekly |
| `https://nortesport.com.ar/#lookbook` | 0.6 | monthly |
| `https://nortesport.com.ar/#contacto` | 0.5 | monthly |

### Robots.txt

**Archivo:** `app/robots.js`

```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://nortesport.com.ar/sitemap.xml
```

La ruta `/admin/` se bloquea para motores de busqueda.

### Otras optimizaciones SEO

- `<html lang="es">` para indicar el idioma del contenido.
- Fuente web optimizada con `display=swap` para evitar FOIT.
- Texto alternativo en el logo: `alt="Norte Sport"`.
- Aria-labels en todos los botones interactivos (cerrar, carrito, navegacion, etc.).

---

## 12. Paleta de Colores

La paleta esta definida en `tailwind.config.js` y se usa a traves de clases utilitarias de Tailwind.

| Nombre | Hex | Clase Tailwind | Uso |
|---|---|---|---|
| **Primary** | `#2B3A52` | `text-primary`, `bg-primary` | Color principal de marca. Textos, headers, fondos de navbar/hero, badges. |
| **Primary Light** | `#E8EDF3` | `bg-primary-light` | Fondos claros, hovers suaves. |
| **Primary Dark** | `#1A2535` | `bg-primary-dark` | Footer, fondos oscuros del hero. |
| **Secondary** | `#6B7B8D` | `text-secondary` | Textos secundarios, descripciones, labels. |
| **Secondary Light** | `#F0F2F5` | `bg-secondary-light` | Fondos alternativos claros. |
| **Background** | `#FFFFFF` | `bg-bg` | Fondo principal del sitio. |
| **Background Alt** | `#F7F8FA` | `bg-bg-alt` | Fondo alternativo para secciones (lookbook, testimonios, contacto, admin). |
| **Accent** | `#3B82F6` | `text-accent`, `bg-accent` | Color de acento (azul). Botones primarios, links activos, filtros seleccionados, tabs activos. |
| **Accent Light** | `#EFF6FF` | `bg-accent-light` | Fondos de badges de acento. |
| **Border** | `#E5E7EB` | `border-border` | Bordes de tarjetas, separadores, inputs. |
| **Dark** | `#1A1A1A` | `text-dark` | Textos de maxima prominencia (titulos, nombres). |
| **Sale** | `#EF4444` | `text-sale`, `bg-sale` | Precios en oferta, badge SALE, errores. |
| **WhatsApp** | `#25D366` | `bg-whatsapp` | Botones de WhatsApp. |

### Colores del PDF (admin)

Definidos en `adminConfig.pdfColors`:

| Nombre | Hex | Uso |
|---|---|---|
| Header | `#2B3A52` | Fondo del header y encabezado de tabla |
| Border | `#E5E7EB` | Lineas de la tabla |
| Accent | `#3B82F6` | Linea del footer |

### Colores de la temporada

Definidos en `temporadaActual`:

| Campo | Valor | Uso |
|---|---|---|
| color | `#8B1A2B` | Color tematico de la temporada (borgona) |
| colorNombre | `Borgona` | Nombre descriptivo del color |

---

## 13. Tipografia

### Fuente principal: Inter

La fuente **Inter** se carga desde Google Fonts en `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
```

### Configuracion en Tailwind

```javascript
fontFamily: {
  display: ['"Inter"', 'sans-serif'],
  body: ['"Inter"', 'sans-serif'],
}
```

Ambas familias (`font-display` y `font-body`) usan Inter, permitiendo diferenciarlas en el futuro si se desea cambiar alguna.

### Pesos utilizados

| Peso | Clase Tailwind | Uso |
|---|---|---|
| 400 (Regular) | `font-normal` | Texto base, descripciones, respuestas FAQ |
| 500 (Medium) | `font-medium` | Links de navegacion, labels, texto intermedio |
| 600 (Semibold) | `font-semibold` | Subtitulos, nombres de productos, botones |
| 700 (Bold) | `font-bold` | Titulos de secciones, precios, headers |
| 900 (Black) | `font-black` | Titulo del hero, estadisticas grandes |

### Aplicacion global

```html
<body className="font-body text-dark antialiased">
```

El body usa `font-body` (Inter), color de texto `dark` (#1A1A1A) y `antialiased` para mejor renderizado de fuentes.

---

## 14. Animaciones y Efectos

Todas las animaciones estan definidas en `app/globals.css` y se aplican mediante clases CSS.

### 14.1 Marquee (PromoBar)

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

El texto se duplica y se desplaza continuamente hacia la izquierda. Al llegar al 50% del recorrido, el ciclo se repite creando la ilusion de scroll infinito.

### 14.2 Scroll Reveal

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Se activa con un `IntersectionObserver` configurado en `page.jsx` (threshold: 0.1). Cuando una seccion entra en viewport, se le agrega la clase `visible` y aparece con un desplazamiento suave de abajo hacia arriba.

### 14.3 Counter Up (AboutUs)

Las estadisticas de la seccion "Nosotras" usan una combinacion de:
- `opacity: 0` a `opacity: 1`
- `translateY(4px)` a `translateY(0)`
- `transition-duration: 700ms`
- `transitionDelay` escalonado: 0ms, 150ms, 300ms, 450ms

Se activa cuando el contenedor entra en viewport (IntersectionObserver con threshold: 0.2).

### 14.4 Slide-in (CarritoPanel, FilterSidebar mobile)

```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.slide-in-right {
  animation: slideInRight 0.3s ease forwards;
}
```

El CarritoPanel usa `transform: translateX` con transiciones CSS (no animaciones keyframe) para un control mas preciso del estado abierto/cerrado.

### 14.5 Rotacion del Chevron (FAQ)

```css
.chevron-rotate {
  transition: transform 0.3s ease;
}
.chevron-rotate.open {
  transform: rotate(180deg);
}
```

El icono ChevronDown rota 180 grados cuando el acordeon esta abierto. En el componente FAQ se usa directamente con clases de Tailwind: `transition-transform duration-300` y `rotate-180`.

### 14.6 Image Zoom (ProductCard)

```css
.img-zoom {
  transition: transform 0.4s ease;
}
.img-zoom:hover {
  transform: scale(1.05);
}
```

En los ProductCard se aplica via Tailwind: `transition-transform duration-400 group-hover:scale-105`.

### 14.7 Modal (Fade + Scale)

```css
.animate-fade-in {
  animation: fadeIn 0.2s ease forwards;
}
.animate-scale-in {
  animation: scaleIn 0.3s ease forwards;
}
```

Los modales aparecen con un fade del overlay (200ms) y un scale del contenido de 0.95 a 1.0 (300ms).

### 14.8 Menu Mobile (Slide-in)

```css
@keyframes menuSlideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.menu-slide-in {
  animation: menuSlideIn 0.3s ease forwards;
}
```

El menu mobile aparece con un desplazamiento sutil de arriba hacia abajo.

### 14.9 Transicion global

```css
* {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease;
}
```

Todos los elementos tienen una transicion global de 150ms para cambios de color, borde y sombra, lo que genera una sensacion suave y consistente en toda la interfaz. Las clases de animacion (marquee, slide-in, fade, scale) sobreescriben esto con `transition: none` para evitar conflictos.

---

## 15. Personalizacion

### 15.1 Cambiar datos del negocio

Editar el objeto `negocio` en `lib/config.js`:

```javascript
export const negocio = {
  nombre: 'Tu Marca',
  slogan: 'Tu slogan aqui',
  descripcion: 'Descripcion de tu negocio',
  whatsapp: '5493854788733',        // Numero con codigo de pais sin +
  whatsappDisplay: '385-478-8733',  // Formato para mostrar
  instagram: '@nortesport.sgo',
  instagramUrl: 'https://www.instagram.com/nortesport.sgo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  horarios: 'Lun a Vie 9:00-18:00',
  ubicacion: 'Tu Ciudad, Argentina',
  experiencia: '5+',
  clientas: '1000+',
  productosVendidos: '5.000+',
}
```

### 15.2 Cambiar productos

Editar el array `productos` en `lib/config.js`. Cada producto tiene la siguiente estructura:

```javascript
{
  id: 1,                        // ID unico (numero)
  nombre: 'Nombre del producto',
  categoria: 'Categoria',       // Debe coincidir con una de las categorias
  descripcion: 'Descripcion...',
  precio: 18500,                // Precio en pesos (sin decimales)
  precioAnterior: null,         // null o precio anterior para mostrar descuento
  talles: ['S', 'M', 'L'],     // Array de talles disponibles
  badge: 'NUEVO',               // 'NUEVO', 'SALE', 'ULTIMAS' o null
  imagenUrl: '/productos/calza-larga-deportiva.jpg', // Ruta a la imagen real en /public/productos/
  placeholder: 'linear-gradient(135deg, #2B3A52, #6B7B8D)', // Gradiente CSS de fallback
  disponible: true,             // true o false
}
```

### 15.3 Cambiar categorias y talles

```javascript
export const categorias = ['Calzas largas', 'Remeras', 'Shorts', 'Tops', 'Conjuntos']
export const tallesDisponibles = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
```

### 15.4 Cambiar testimonios

Editar el array `testimonios`. Cada testimonio:

```javascript
{ id: 1, nombre: 'Nombre', texto: 'Texto del testimonio', estrellas: 5 }
```

### 15.5 Cambiar FAQs

Editar el array `faqs`. Cada FAQ:

```javascript
{ pregunta: 'Pregunta?', respuesta: 'Respuesta completa.' }
```

### 15.6 Cambiar items del Lookbook

Editar el array `lookbookItems`. Cada item tiene `imagenUrl` apuntando a `/lookbook/[nombre-look].jpg`. Opciones de tamano: `'normal'`, `'grande'`, `'horizontal'`.

### 15.7 Cambiar promociones

Editar el array `promos`:

```javascript
export const promos = [
  'Envios a todo el pais',
  '3 cuotas sin interes',
  '15% OFF con transferencia',
  'Cambios sin costo',
]
```

### 15.8 Cambiar la temporada

```javascript
export const temporadaActual = {
  nombre: 'Primavera 2026',
  color: '#8B1A2B',
  colorNombre: 'Borgona',
  emoji: '🌸',
}
```

### 15.9 Cambiar colores de marca

Editar `tailwind.config.js`:

```javascript
colors: {
  primary: { DEFAULT: '#TU_COLOR', light: '#TU_LIGHT', dark: '#TU_DARK' },
  accent: { DEFAULT: '#TU_ACCENT', light: '#TU_ACCENT_LIGHT' },
  // ... etc.
}
```

Despues de cambiar los colores, reiniciar el servidor de desarrollo para que Tailwind regenere las clases.

### 15.10 Cambiar links de navegacion

```javascript
export const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  // Agregar, quitar o renombrar secciones
]
```

---

## 16. Deploy en Vercel

Norte Sport esta optimizado para deploy en Vercel, la plataforma nativa de Next.js.

### Paso 1: Cuenta en Vercel

Crear una cuenta en [vercel.com](https://vercel.com) (se puede vincular con GitHub, GitLab o Bitbucket).

### Paso 2: Subir el repositorio a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/norte-sport.git
git push -u origin main
```

### Paso 3: Importar en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new).
2. Seleccionar el repositorio `norte-sport`.
3. Vercel detecta automaticamente que es un proyecto Next.js.
4. Click en **Deploy**.

### Paso 4: Configurar dominio personalizado (opcional)

1. En el dashboard de Vercel, ir a Settings > Domains.
2. Agregar el dominio personalizado (ej: `nortesport.com.ar`).
3. Configurar los DNS del dominio para apuntar a Vercel.

### Paso 5: Variables de entorno (si se necesitan)

Si se configura la integracion con Google Sheets u otro servicio externo, se pueden agregar variables de entorno en Settings > Environment Variables del proyecto en Vercel.

### Actualizaciones automaticas

Cada vez que se haga push a la rama `main`, Vercel automaticamente compilara y desplegara la nueva version.

---

## 17. Variables y Configuracion Importante

### Constantes criticas en `lib/config.js`

| Variable | Valor por defecto | Descripcion |
|---|---|---|
| `SHEET_ID` | `'TU_GOOGLE_SHEET_ID_AQUI'` | ID de la Google Sheet para cargar datos remotos. Se debe reemplazar con el ID real o dejar el valor por defecto para usar datos locales. |
| `adminConfig.password` | `'nortesport2026'` | Contrasena de acceso al panel administrativo. Cambiar antes de poner en produccion. |
| `negocio.whatsapp` | `'5493854788733'` | Numero de WhatsApp con codigo de pais (sin +). Se usa para generar links de `wa.me`. |
| `negocio.instagram` | `'@nortesport.sgo'` | Handle de Instagram mostrado en el sitio. |
| `negocio.instagramUrl` | `'https://www.instagram.com/nortesport.sgo?utm_source=...'` | URL completa del perfil de Instagram (con parametros UTM). |

### Claves de localStorage

| Clave | Componente | Contenido |
|---|---|---|
| `norte-sport-carrito` | CarritoPanel / page.jsx | Array JSON del carrito de compras |
| `norte_productos_overrides` | ProductosTable | Objeto JSON con overrides de productos del admin |
| `norte_lookbook_overrides` | LookbookManager | Objeto JSON con overrides del lookbook del admin |
| `norte_lookbook_order` | LookbookManager | Array JSON con el orden personalizado de items del lookbook |

### Claves de sessionStorage

| Clave | Componente | Contenido |
|---|---|---|
| `authenticated` | Admin login/dashboard | `'true'` cuando el admin esta autenticado |
| `norte-promo-bar-closed` | PromoBar | `'1'` cuando la barra de promos fue cerrada |

### URLs importantes

| URL | Descripcion |
|---|---|
| `https://nortesport.com.ar` | Dominio de produccion (configurado en sitemap y JSON-LD) |
| `https://wa.me/5493854788733` | Link directo a WhatsApp del negocio |
| `https://www.instagram.com/nortesport.sgo` | Perfil de Instagram |
| `https://docs.google.com/spreadsheets/d/{SHEET_ID}/...` | Google Sheet como fuente de datos (requiere SHEET_ID configurado) |

### Google Sheets como fuente de datos

El archivo `lib/sheets.js` permite cargar productos, testimonios, lookbook y configuracion desde una Google Sheet publica. Las hojas esperadas son:

| Hoja | Columnas esperadas |
|---|---|
| `Productos` | ID, Nombre, Categoria, Descripcion, Precio, PrecioAnterior, Talles (separados por coma), Badge, ImagenURL, Disponible |
| `Testimonios` | ID, Nombre, Texto, Estrellas |
| `Lookbook` | ID, Titulo, Badge, Tamano, ImagenURL |
| `Config` | Clave, Valor (pares clave-valor para temporada, promos, etc.) |

Si la Google Sheet no esta disponible o el `SHEET_ID` no esta configurado, el sistema usa los datos locales de `lib/config.js` como fallback.

### Google Drive para imagenes

El archivo `lib/drive.js` contiene una utilidad para convertir URLs de comparticion de Google Drive al formato de URL directa:

```
Entrada:  https://drive.google.com/file/d/FILE_ID/view
Salida:   https://drive.google.com/uc?export=view&id=FILE_ID
```

Esto permite usar imagenes almacenadas en Google Drive directamente en los productos y el lookbook.

### Colores del PDF

Definidos en `adminConfig.pdfColors`, controlan la apariencia de los catalogos generados:

```javascript
pdfColors: {
  header: '#2B3A52',  // Fondo del encabezado
  border: '#E5E7EB',  // Color de bordes de tabla
  accent: '#3B82F6',  // Linea decorativa del footer
}
```

---

> **Norte Sport** -- Documentacion generada para el proyecto completo. Para consultas sobre el codigo o la configuracion, revisar los archivos fuente referenciados en cada seccion.
