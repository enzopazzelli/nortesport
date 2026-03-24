# Norte Sport -- Guia de Integracion Completa

> **Version:** 1.0
> **Ultima actualizacion:** Marzo 2026
> **Dirigida a:** Personas que administran el contenido del sitio (no requiere conocimientos de programacion)

---

## Indice

1. [Google Sheets como CMS](#1-google-sheets-como-cms)
2. [Google Drive para Imagenes](#2-google-drive-para-imagenes)
3. [Generador de Catalogos PDF (Admin)](#3-generador-de-catalogos-pdf-admin)
4. [Integracion con WhatsApp](#4-integracion-con-whatsapp)
5. [MercadoPago (Proximamente)](#5-mercadopago-proximamente)
6. [Gestion del Lookbook (Admin)](#6-gestion-del-lookbook-admin)
7. [Gestion de Productos (Admin)](#7-gestion-de-productos-admin)
8. [Datos Mock vs Datos Reales](#8-datos-mock-vs-datos-reales)
9. [Configuracion para Produccion](#9-configuracion-para-produccion)
10. [Preguntas Frecuentes (FAQ tecnica)](#10-preguntas-frecuentes-faq-tecnica)

---

## 1. Google Sheets como CMS

Google Sheets funciona como el "panel de administracion" de contenidos del sitio. En lugar de usar una base de datos tradicional, el sitio lee los datos directamente de una hoja de calculo de Google. Esto significa que para agregar, editar o eliminar productos, testimonios u otros contenidos, solo tenes que modificar la hoja de calculo.

### 1.1 Crear la hoja de calculo

**Paso a paso:**

1. Ingresa a [Google Sheets](https://sheets.google.com) con tu cuenta de Google.
2. Hace clic en **"+ En blanco"** (o **"Hoja de calculo en blanco"**) para crear una nueva hoja.
3. En la parte superior izquierda, donde dice "Hoja de calculo sin titulo", escribi un nombre descriptivo, por ejemplo: **"Norte Sport - CMS"**.
4. En la parte inferior vas a ver una pestana que dice "Hoja 1". Necesitas crear **5 pestanas** (hojas) con los siguientes nombres exactos:
   - `Productos`
   - `Ofertas`
   - `Testimonios`
   - `Config`
   - `Lookbook`

**Como crear las pestanas:**

1. Hace clic derecho en la pestana "Hoja 1" en la parte inferior.
2. Selecciona **"Cambiar nombre"** y escribi `Productos`.
3. Hace clic en el icono **"+"** (a la izquierda de las pestanas) para agregar una nueva hoja.
4. Renombrala como `Ofertas`.
5. Repeti el proceso para `Testimonios`, `Config` y `Lookbook`.

> **IMPORTANTE:** Los nombres de las pestanas deben ser exactamente como se indican arriba, respetando mayusculas y sin espacios extra. Si el nombre no coincide, el sitio no podra leer los datos.

---

### 1.2 Hoja "Productos"

Esta es la hoja principal. Cada fila representa un producto que se muestra en la tienda.

**Columnas requeridas (primera fila = encabezados):**

| Columna | Descripcion | Tipo de dato | Ejemplo |
|---------|-------------|--------------|---------|
| `ID` | Numero unico del producto | Numero entero | `1` |
| `Nombre` | Nombre del producto que ve el cliente | Texto | `Calza larga deportiva` |
| `Categoria` | Categoria a la que pertenece | Texto | `Calzas largas` |
| `Descripcion` | Descripcion detallada del producto | Texto | `Calza larga con cintura alta y tela suplex...` |
| `Precio` | Precio actual en pesos (sin signo $) | Numero | `18500` |
| `PrecioAnterior` | Precio anterior (para mostrar descuento). Dejar vacio si no hay descuento | Numero o vacio | `22000` |
| `Talles` | Talles disponibles separados por coma | Texto con comas | `S,M,L,XL` |
| `ColorTemporada` | Color representativo de la temporada | Texto | `Borgona` |
| `Badge` | Etiqueta especial del producto. Valores posibles: `NUEVO`, `SALE`, `ULTIMAS`, o dejar vacio | Texto o vacio | `NUEVO` |
| `ImagenURL` | Links de las imagenes del producto separados por `\|`. La primera imagen es la principal. Se pueden agregar varias para que el producto tenga un carrusel de fotos (ver seccion de Google Drive) | URLs separadas por `\|` | `https://drive.google.com/.../foto1 \| https://drive.google.com/.../foto2 \| https://drive.google.com/.../foto3` |
| `Stock` | Cantidad disponible del producto. Cuando es `0`, el producto se muestra como "Sin stock" (visible pero no se puede comprar). Dejar vacio para stock ilimitado | Numero o vacio | `10` |
| `Destacado` | Si el producto aparece en la seccion destacados | `TRUE` o `FALSE` | `TRUE` |
| `Disponible` | Si el producto esta visible en la tienda | `TRUE` o `FALSE` | `TRUE` |
| `Orden` | Numero para ordenar los productos (menor = primero) | Numero | `1` |

**Ejemplo de filas completas:**

| ID | Nombre | Categoria | Descripcion | Precio | PrecioAnterior | Talles | ColorTemporada | Badge | ImagenURL | Destacado | Disponible | Orden |
|----|--------|-----------|-------------|--------|----------------|--------|----------------|-------|-----------|-----------|------------|-------|
| 1 | Calza larga deportiva | Calzas largas | Calza larga con cintura alta y tela suplex de alta compresion. | 18500 | | S,M,L,XL | Borgona | NUEVO | https://drive.google.com/.../foto1 \| https://drive.google.com/.../foto2 \| https://drive.google.com/.../foto3 | TRUE | TRUE | 1 |
| 2 | Short running | Shorts | Short liviano con tela respirable. Cintura elastica con cordon. | 11500 | 14000 | S,M,L | Borgona | SALE | https://drive.google.com/.../fotoA \| https://drive.google.com/.../fotoB | FALSE | TRUE | 2 |
| 3 | Remera dry-fit oversize | Remeras | Remera oversize de tela dry-fit. Secado rapido. | 12000 | | S,M,L,XL | Borgona | | https://drive.google.com/.../fotoX | FALSE | TRUE | 3 |

**Notas importantes sobre la hoja Productos:**

- **Los talles van separados por coma sin espacios**, por ejemplo: `S,M,L,XL`. Si pones espacios (`S, M, L, XL`) tambien funciona, el sistema los limpia automaticamente.
- **El Badge puede quedar vacio.** Si no queres mostrar ninguna etiqueta, simplemente deja la celda sin contenido.
- **PrecioAnterior vacio** significa que el producto no tiene descuento. Si pones un valor, el sitio mostrara el precio tachado y el nuevo precio.
- **Disponible en FALSE** oculta el producto del sitio sin eliminarlo. Util para productos temporalmente sin stock.
- **Stock en 0** no oculta el producto — lo muestra con un cartel de "Sin stock", la imagen en gris, y sin boton de agregar al carrito. En la vista rapida (Quick View) aparece un boton para consultar por WhatsApp. Esto es util para que las clientas vean que el producto existe aunque no este disponible.
- **Stock vacio (sin valor)** se interpreta como stock ilimitado — el producto se muestra normalmente.
- **Diferencia entre Disponible y Stock:** `Disponible = FALSE` oculta completamente el producto. `Stock = 0` lo muestra como "Sin stock". Usa `Disponible` para productos que ya no vendes y `Stock` para productos temporalmente agotados.

#### Multiples fotos por producto (Carrusel)

Cada producto puede tener **varias fotos** que se muestran como un carrusel. Para esto, en la columna `ImagenURL` se ponen todos los links separados por el caracter `|` (barra vertical):

```
https://drive.google.com/.../foto-frente | https://drive.google.com/.../foto-espalda | https://drive.google.com/.../foto-detalle
```

**Como funciona en la tienda:**

- **En la grilla de productos:** se muestran flechas izquierda/derecha al pasar el mouse, y puntos indicadores debajo de la imagen para cambiar entre fotos.
- **En la vista rapida (Quick View):** se muestra un carrusel con flechas, un contador (ej: "1/3") y una fila de miniaturas (thumbnails) clicables debajo de la foto principal.
- **En el carrito:** se usa la primera foto como miniatura.

**Recomendaciones:**

- La **primera URL** es la foto principal (la que se ve al cargar la pagina).
- Se recomienda entre **2 y 5 fotos** por producto: frente, espalda, detalle, puesta, etc.
- Si solo pones una URL (sin `|`), funciona igual — simplemente no se muestra el carrusel.
- Si la celda esta vacia, se muestra un gradiente placeholder.
- **La columna Orden** determina el orden de aparicion. Si dos productos tienen el mismo numero, se muestran en el orden en que estan en la hoja.

**Categorias utilizadas actualmente:**

- `Calzas largas`
- `Remeras`
- `Shorts`
- `Tops`
- `Conjuntos`

> Podes crear nuevas categorias simplemente escribiendolas en la columna Categoria. El sitio las detecta automaticamente.

---

### 1.3 Hoja "Ofertas"

Esta hoja contiene las ofertas especiales o promociones activas.

**Columnas requeridas:**

| Columna | Descripcion | Tipo de dato | Ejemplo |
|---------|-------------|--------------|---------|
| `ID` | Numero unico de la oferta | Numero | `1` |
| `Nombre` | Nombre de la oferta | Texto | `Promo Verano 2x1` |
| `PrecioOferta` | Precio con descuento | Numero | `15000` |
| `PrecioAnterior` | Precio original sin descuento | Numero | `22000` |
| `Descuento` | Porcentaje de descuento a mostrar | Texto | `30%` |
| `Descripcion` | Detalle de la oferta | Texto | `Lleva 2 calzas al precio de 1` |
| `Vigencia` | Hasta cuando es valida la oferta | Texto | `Hasta 31/03/2026` |
| `Activa` | Si la oferta esta activa y visible | `TRUE` o `FALSE` | `TRUE` |

**Ejemplo:**

| ID | Nombre | PrecioOferta | PrecioAnterior | Descuento | Descripcion | Vigencia | Activa |
|----|--------|-------------|----------------|-----------|-------------|----------|--------|
| 1 | Promo Verano 2x1 | 15000 | 22000 | 30% | Lleva 2 calzas al precio de 1 | Hasta 31/03/2026 | TRUE |
| 2 | Liquidacion Shorts | 8500 | 14000 | 40% | Todos los shorts con 40% OFF | Hasta 15/04/2026 | TRUE |
| 3 | Promo ya finalizada | 10000 | 15000 | 33% | Esta promo ya no esta activa | Vencida | FALSE |

---

### 1.4 Hoja "Testimonios"

Los testimonios que aparecen en la seccion de opiniones de clientas.

**Columnas requeridas:**

| Columna | Descripcion | Tipo de dato | Ejemplo |
|---------|-------------|--------------|---------|
| `ID` | Numero unico del testimonio | Numero | `1` |
| `Nombre` | Nombre de la clienta (puede ser solo iniciales) | Texto | `Maria L.` |
| `Texto` | El testimonio completo | Texto | `Las calzas son increibles, no se transparentan...` |
| `Estrellas` | Calificacion de 1 a 5 | Numero | `5` |
| `Orden` | Orden de aparicion | Numero | `1` |

**Ejemplo:**

| ID | Nombre | Texto | Estrellas | Orden |
|----|--------|-------|-----------|-------|
| 1 | Maria L. | Las calzas son increibles, no se transparentan y son super comodas. Ya pedi 3 veces. | 5 | 1 |
| 2 | Valentina R. | Me encanta que cada temporada traen colores nuevos. Siempre hay algo lindo. | 5 | 2 |
| 3 | Camila S. | Compre un conjunto y me llego al dia siguiente. Excelente atencion. | 5 | 3 |
| 4 | Lucia M. | La calidad es muy buena para el precio. Las remeras dry-fit son mi favorito. | 5 | 4 |
| 5 | Florencia G. | Pedi por WhatsApp y fue super facil. Me asesoraron con el talle perfecto. | 5 | 5 |
| 6 | Sol P. | El short con calza es lo mejor que compre este anio. Lo uso para todo. | 5 | 6 |

> **Consejo:** Si no queres mostrar el nombre completo de la clienta por privacidad, usa iniciales: "Maria L.", "Valentina R.", etc.

---

### 1.5 Hoja "Config"

Esta hoja controla la configuracion general del sitio: temporada, colores y textos promocionales.

**Columnas requeridas:**

| Columna | Descripcion |
|---------|-------------|
| `Clave` | Nombre de la configuracion (debe ser exacto) |
| `Valor` | El valor de esa configuracion |

**Claves disponibles:**

| Clave | Descripcion | Ejemplo de Valor |
|-------|-------------|------------------|
| `temporadaNombre` | Nombre de la temporada actual | `Otonio 2026` |
| `temporadaColor` | Color de la temporada en formato hexadecimal | `#8B1A2B` |
| `temporadaColorNombre` | Nombre del color de la temporada | `Borgona` |
| `temporadaEmoji` | Emoji representativo de la temporada | (emoji de hoja de otonio) |
| `promos` | Textos de la barra promocional separados por `\|` (barra vertical) | `Envios a todo el pais\|3 cuotas sin interes\|15% OFF con transferencia` |

**Ejemplo completo de la hoja Config:**

| Clave | Valor |
|-------|-------|
| temporadaNombre | Otonio 2026 |
| temporadaColor | #8B1A2B |
| temporadaColorNombre | Borgona |
| temporadaEmoji | (emoji de hoja de otonio) |
| promos | Envios a todo el pais\|3 cuotas sin interes\|15% OFF con transferencia\|Cambios sin costo |

**Como funcionan las promos:**

Los textos de la barra promocional (la que se desliza en la parte superior del sitio) se escriben todos en una sola celda, separados por el caracter `|` (barra vertical, se escribe con `AltGr + 1` o `Shift + \` segun tu teclado). Por ejemplo:

```
Envios a todo el pais|3 cuotas sin interes|15% OFF con transferencia|Cambios sin costo
```

El sitio los separa automaticamente y los muestra rotando en la barra superior.

**Como obtener un color hexadecimal:**

1. Visita [htmlcolorcodes.com](https://htmlcolorcodes.com/es/) o busca "selector de color" en Google.
2. Elegi el color que quieras.
3. Copia el codigo que empieza con `#`, por ejemplo `#8B1A2B`.
4. Pega ese codigo en la celda Valor junto a la clave `temporadaColor`.

---

### 1.6 Hoja "Lookbook"

El lookbook es la galeria de imagenes/looks que aparece en el sitio. Muestra combinaciones de productos en formato de grilla visual.

**Columnas requeridas:**

| Columna | Descripcion | Tipo de dato | Ejemplo |
|---------|-------------|--------------|---------|
| `ID` | Numero unico del item | Numero | `1` |
| `Titulo` | Titulo del look | Texto | `Look Gym Day` |
| `Badge` | Etiqueta opcional (texto libre) | Texto o vacio | `4 prendas` |
| `Tamano` | Tamano de la tarjeta en la grilla | `Normal`, `Grande` o `Horizontal` | `Grande` |
| `ImagenURL` | Link de la imagen del look | URL | `https://drive.google.com/file/d/XYZ789/view` |
| `Orden` | Orden de aparicion | Numero | `1` |
| `Destacado` | Si aparece primero o resaltado | `TRUE` o `FALSE` | `TRUE` |

**Tamanos disponibles y que significan:**

| Tamano | Que hace | Uso recomendado |
|--------|----------|-----------------|
| `Normal` | Tarjeta de 1x1 (cuadrada, tamano estandar) | La mayoria de los looks |
| `Grande` | Tarjeta de 1 columna x 2 filas (ocupa el doble de alto) | Looks destacados, imagenes verticales |
| `Horizontal` | Tarjeta de 2 columnas x 1 fila (ocupa el doble de ancho) | Imagenes panoramicas, banners |

**Ejemplo:**

| ID | Titulo | Badge | Tamano | ImagenURL | Orden | Destacado |
|----|--------|-------|--------|-----------|-------|-----------|
| 1 | Look Gym Day | 4 prendas | Grande | https://drive.google.com/file/d/ABC/view | 1 | TRUE |
| 2 | Look Running | | Normal | https://drive.google.com/file/d/DEF/view | 2 | FALSE |
| 3 | Look Casual Sport | | Normal | https://drive.google.com/file/d/GHI/view | 3 | FALSE |
| 4 | Look Training | Mas vendido | Horizontal | https://drive.google.com/file/d/JKL/view | 4 | FALSE |
| 5 | Look Yoga | | Normal | https://drive.google.com/file/d/MNO/view | 5 | FALSE |

---

### 1.7 Publicar la hoja de calculo

Para que el sitio web pueda leer los datos de la hoja, necesitas hacerla publica. **Sin este paso, el sitio no podra acceder a la informacion.**

**Paso a paso:**

1. Abri tu hoja de calculo en Google Sheets.
2. Hace clic en el boton **"Compartir"** (arriba a la derecha, boton verde/azul).
3. En la ventana que aparece, busca la seccion **"Acceso general"** (abajo).
4. Donde dice "Restringido", cambialo a **"Cualquier persona con el enlace"**.
5. Asegurate de que el permiso sea **"Lector"** (solo lectura). NO le des permiso de "Editor".
6. Hace clic en **"Listo"**.

**Verificacion:** Si todo esta bien, debajo del nombre de la hoja deberia aparecer un icono de compartido/mundo indicando que es publica.

> **IMPORTANTE sobre seguridad:** Al hacer la hoja publica, cualquier persona con el link podra VER los datos (pero no editarlos). No pongas informacion sensible en la hoja (contrasenas, datos personales de clientes, etc.). Los datos de la hoja son solo para contenido publico del sitio.

---

### 1.8 Obtener el Sheet ID

El Sheet ID es un codigo unico que identifica tu hoja de calculo. Lo necesitas para configurar el sitio.

**Como encontrarlo:**

1. Abri tu hoja de calculo en el navegador.
2. Mira la barra de direcciones (URL). Va a tener un formato asi:

```
https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789/edit#gid=0
```

3. El Sheet ID es la parte que esta **entre `/d/` y `/edit`**. En este ejemplo seria:

```
1aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789
```

4. Copia ese texto completo (solo esa parte, sin las barras).

> **Consejo visual:** En la URL, busca `/d/` y despues busca `/edit`. Todo lo que esta en el medio es tu Sheet ID. Suele ser una cadena larga de letras, numeros, guiones y guiones bajos.

---

### 1.9 Configurar en el proyecto

Una vez que tenes el Sheet ID, necesitas ponerlo en el archivo de configuracion del proyecto.

**Paso a paso:**

1. Abri el archivo `lib/admin.js` en el editor de codigo.
2. Busca la linea que dice:

```javascript
export const SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI'
```

3. Reemplaza `TU_GOOGLE_SHEET_ID_AQUI` con tu Sheet ID real:

```javascript
export const SHEET_ID = '1aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789'
```

4. Guarda el archivo.
5. Si el sitio esta corriendo localmente, los cambios se aplican automaticamente. Si esta en produccion (Vercel), necesitas hacer deploy nuevamente.

> **Archivo:** `lib/admin.js`

---

### 1.10 Como funciona la conexion (tecnico)

Para quienes quieran entender que pasa "detras de escena":

**Endpoint utilizado:**

El sitio usa la API publica de Google Sheets llamada **gviz/tq** (Google Visualization Query). No requiere API key ni autenticacion -- solo necesita que la hoja sea publica.

La URL que se construye es:

```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={NombreDeLaPestana}
```

**Flujo de datos:**

1. Cuando alguien visita el sitio, Next.js hace una solicitud a Google Sheets.
2. Google responde con los datos en formato JSON.
3. El sitio lee los encabezados (primera fila) y las filas de datos.
4. Convierte cada fila en un objeto con las propiedades correspondientes.
5. El resultado se cachea durante **5 minutos** (`revalidate: 300` segundos).

**Que significa el cache de 5 minutos:**

- Si modificas la hoja de Sheets, los cambios no aparecen inmediatamente en el sitio.
- El sitio guarda una copia de los datos durante 5 minutos.
- Despues de 5 minutos, la proxima visita obtiene los datos actualizados.
- Esto es para evitar hacer demasiadas solicitudes a Google y que el sitio cargue mas rapido.

**Fallback a datos de respaldo:**

Si por cualquier razon el sitio no puede conectarse a Google Sheets (hoja no disponible, error de red, Sheet ID incorrecto), automaticamente usa los **datos de respaldo** que estan dentro del archivo `lib/defaults.js`. Esto garantiza que el sitio nunca quede "en blanco".

---

### 1.11 Solucion de problemas (Troubleshooting)

**Problema: Los datos no se actualizan en el sitio**

- Espera al menos 5 minutos (cache).
- Verifica que la hoja sea publica (seccion 1.7).
- Verifica que el Sheet ID sea correcto (seccion 1.8).

**Problema: El sitio muestra datos de ejemplo en lugar de los reales**

- El Sheet ID no esta configurado o es incorrecto.
- La hoja no es publica.
- Los nombres de las pestanas no coinciden exactamente (`Productos`, `Testimonios`, `Lookbook`, `Config`).

**Problema: Algunos productos no aparecen**

- Verifica que la columna `Disponible` sea `TRUE`.
- Verifica que las columnas se llamen exactamente como se indica (mayusculas incluidas).
- Revisa que no haya espacios extra en los nombres de las columnas.

**Problema: Los precios aparecen como $0 o NaN**

- La columna `Precio` debe contener solo numeros, sin signo `$`, sin puntos de miles, sin comas. Ejemplo correcto: `18500`. Ejemplo incorrecto: `$18.500`.

**Problema: Los talles no aparecen**

- Deben estar separados por coma en una sola celda: `S,M,L,XL`.
- No uses punto y coma ni otro separador.

**Problema: Las imagenes no se muestran**

- Verifica que el link de Google Drive sea correcto (ver seccion 2).
- Verifica que la imagen en Drive sea publica.

---

## 2. Google Drive para Imagenes

Google Drive se usa para almacenar las imagenes de los productos y del lookbook. El sitio convierte automaticamente los links de Drive al formato correcto para mostrarlos.

### 2.1 Crear carpeta en Drive

**Paso a paso:**

1. Ingresa a [Google Drive](https://drive.google.com).
2. Hace clic en **"+ Nuevo"** (boton a la izquierda) y selecciona **"Carpeta"**.
3. Nombra la carpeta `Norte Sport` (o el nombre que prefieras).
4. Dentro de esa carpeta, crea subcarpetas para organizarte:

**Estructura de carpetas recomendada:**

```
Norte Sport/
  |-- Productos/
  |     |-- calza-larga-deportiva.jpg
  |     |-- short-running.jpg
  |     |-- remera-dryfit.jpg
  |     |-- ...
  |
  |-- Lookbook/
  |     |-- look-gym-day.jpg
  |     |-- look-running.jpg
  |     |-- look-casual.jpg
  |     |-- ...
  |
  |-- Logo/
        |-- logo-norte-sport.png
        |-- logo-blanco.png
```

> **Consejo:** Usa nombres de archivo descriptivos y sin espacios (usa guiones). Esto facilita encontrarlos despues.

---

### 2.2 Subir imagenes

**Paso a paso:**

1. Navega a la carpeta donde queres subir imagenes (ej: `Productos/`).
2. Arrastra las imagenes desde tu computadora directamente a la ventana de Drive.
3. O bien, hace clic en **"+ Nuevo" > "Subir archivo"** y selecciona las imagenes.
4. Espera a que se complete la carga (se muestra un progreso en la esquina inferior derecha).

**Formatos recomendados:**

- **JPEG (.jpg):** Para fotos de productos. Buen balance entre calidad y tamano.
- **PNG (.png):** Para imagenes con fondo transparente (logos).
- **WebP (.webp):** Formato moderno, mas liviano. No todos los navegadores antiguos lo soportan.

**Tamano recomendado:**

- Productos: **800x800 px** minimo (cuadrada idealmente).
- Lookbook: **1200x800 px** o mas (puede ser horizontal o vertical segun el tamano del item).
- Intenta que cada imagen no pese mas de **500 KB** para que el sitio cargue rapido.

---

### 2.3 Obtener el link publico

Para que el sitio pueda mostrar una imagen, esa imagen debe ser publica en Drive.

**Paso a paso:**

1. Hace clic derecho sobre la imagen en Google Drive.
2. Selecciona **"Compartir"** (o "Obtener enlace").
3. En la ventana que aparece, cambia el acceso de "Restringido" a **"Cualquier persona con el enlace"**.
4. Asegurate de que diga **"Lector"**.
5. Hace clic en **"Copiar enlace"**.
6. Hace clic en **"Listo"**.

El link que copiaste tiene un formato como este:

```
https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing
```

**Este es el link que vas a pegar en la columna `ImagenURL` de tu hoja de Sheets.**

---

### 2.4 Formato del link (conversion automatica)

Google Drive no permite mostrar imagenes directamente con el link de "compartir". El link necesita ser convertido a un formato especial.

**Link original (el que copias de Drive):**

```
https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing
```

**Link convertido (el que el sitio necesita):**

```
https://drive.google.com/uc?export=view&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**NO necesitas hacer esta conversion manualmente.** El sitio tiene una funcion automatica que hace la conversion por vos. Solo pega el link tal cual lo copiaste de Drive.

---

### 2.5 Como funciona drive.js (tecnico)

El archivo `lib/drive.js` contiene la funcion `getDriveImageUrl()` que se encarga de la conversion automatica. Reconoce estos formatos de entrada:

| Formato de entrada | Ejemplo |
|-------------------|---------|
| Link de compartir | `https://drive.google.com/file/d/FILE_ID/view` |
| Link con parametro id | `https://drive.google.com/...?id=FILE_ID` |
| Link con /d/ | `https://drive.google.com/d/FILE_ID/...` |
| Link directo (ya convertido) | `https://drive.google.com/uc?export=view&id=FILE_ID` |

Cualquiera de estos formatos funciona. La funcion extrae el `FILE_ID` y genera el link directo automaticamente. Si el link ya esta en formato directo, lo devuelve tal cual.

---

### 2.6 Usar en la hoja de Sheets

1. Subi las imagenes a Google Drive (seccion 2.2).
2. Hace cada imagen publica (seccion 2.3).
3. Copia los links de compartir.
4. Pegalos en la columna `ImagenURL` del producto correspondiente en tu hoja de Sheets.

**Si el producto tiene UNA sola foto:**

| ID | Nombre | ... | ImagenURL |
|----|--------|-----|-----------|
| 1 | Calza larga deportiva | ... | https://drive.google.com/file/d/1aBcDeFg/view?usp=sharing |

**Si el producto tiene VARIAS fotos (carrusel):**

Separa los links con `|` (barra vertical). La primera foto es la principal:

| ID | Nombre | ... | ImagenURL |
|----|--------|-----|-----------|
| 1 | Calza larga deportiva | ... | https://drive.google.com/file/d/FOTO_FRENTE/view \| https://drive.google.com/file/d/FOTO_ESPALDA/view \| https://drive.google.com/file/d/FOTO_DETALLE/view |

Esto genera un **carrusel de fotos** en la tienda: flechas para navegar, puntos indicadores en la grilla, y thumbnails en la vista rapida.

El sitio convierte automaticamente cada link al formato que necesita para mostrar las imagenes.

---

### 2.7 Imagenes locales y fallback

Actualmente, el sitio usa **fotos reales almacenadas localmente** en `/public/`:

- **Productos:** `/public/productos/[nombre-limpio].jpg` (dos colecciones: BASICS y NAVY & GREY)
- **Lookbook:** `/public/lookbook/[nombre-look].jpg`
- **Hero:** `/public/hero/hero-bg.jpg`

Cada producto en `config.js` tiene un campo `imagenes` (array de URLs) que apunta a sus fotos reales (hasta 3 por producto). Cada lookbook item tiene `imagenUrl` con una foto. Los componentes (ProductCard, QuickViewModal, CarritoPanel, Lookbook, Hero) muestran estas imagenes reales con carrusel cuando hay multiples fotos.

Si por algun motivo una imagen no se puede cargar (ruta incorrecta, archivo eliminado, o al usar Google Drive con link roto), el sitio **no muestra un espacio vacio ni un icono de error**. En su lugar, muestra un **degradado de colores** como fondo de respaldo.

El degradado predeterminado es:

```
linear-gradient(135deg, #2B3A52, #6B7B8D)
```

Esto genera un fondo azul-grisaceo elegante que mantiene la apariencia visual del sitio aunque la imagen no este disponible.

---

### 2.8 Limitaciones de Google Drive

Google Drive tiene **limites de ancho de banda** para enlaces directos de imagenes:

- Si muchas personas visitan el sitio al mismo tiempo, Google puede bloquear temporalmente el acceso a las imagenes.
- El limite exacto no esta documentado, pero se estima en unas **pocas miles de visualizaciones por dia**.
- Las imagenes pueden tardar mas en cargar que si estuvieran en un servicio dedicado.

**Para un sitio con poco o medio trafico** (hasta unos cientos de visitas por dia), Google Drive funciona perfectamente.

**Para produccion con alto trafico**, se recomienda migrar las imagenes a un servicio dedicado:

| Servicio | Descripcion | Plan gratuito |
|----------|-------------|---------------|
| [Cloudinary](https://cloudinary.com) | CDN de imagenes con optimizacion automatica | Si (25 creditos/mes) |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Almacenamiento integrado con Vercel | Si (hasta cierto limite) |
| [ImgBB](https://imgbb.com) | Hosting de imagenes simple | Si |
| [Supabase Storage](https://supabase.com) | Almacenamiento con CDN | Si (1GB) |

---

## 3. Generador de Catalogos PDF (Admin)

El panel de administracion incluye un generador de catalogos en formato PDF. Permite subir un archivo Excel o CSV con productos y generar una lista de precios profesional para compartir por WhatsApp o imprimir.

### 3.1 Acceso al panel de administracion

**Paso a paso:**

1. Abre tu navegador y ve a la direccion del sitio seguida de `/admin`. Por ejemplo:
   - Local: `http://localhost:3000/admin`
   - Produccion: `https://tu-dominio.com/admin`
2. Se muestra una pantalla de login con el titulo "Norte Sport -- Admin".
3. Ingresa la contrasena (configurada en `lib/admin.js`): **`nortesport2026`**
4. Hace clic en "Ingresar" o presiona Enter.
5. Seras redirigido al dashboard de administracion.

> **IMPORTANTE:** Cambia esta contrasena antes de poner el sitio en produccion (ver seccion 9).

---

### 3.2 Subir archivo

Una vez en el dashboard, en la pestana **"Catalogos"**:

1. Veras una zona de carga que dice "Subi un archivo Excel o CSV".
2. Hace clic en la zona o arrastra un archivo desde tu computadora.
3. Formatos aceptados: **`.xlsx`** (Excel) y **`.csv`** (valores separados por coma).
4. El sistema lee automaticamente la primera hoja del archivo.
5. Los encabezados (primera fila) se detectan automaticamente.

**Requisitos del archivo:**

- La primera fila debe contener los nombres de las columnas (encabezados).
- Debe tener al menos 2 filas (encabezados + 1 fila de datos).
- Las columnas de precios deben contener solo numeros (sin $, sin puntos de miles).

---

### 3.3 Configurar columnas y margenes

Despues de subir el archivo, aparece el panel de configuracion:

**Columna de precio:**

- El sistema detecta automaticamente las columnas que probablemente contienen precios (busca palabras como "precio", "costo", "valor", "lista", "venta", "mayorista", "minorista" en los nombres).
- Selecciona la columna correcta del menu desplegable.

**Margen (%):**

- Si queres aplicar un margen sobre el precio base, ingresa el porcentaje.
- Ejemplo: si el precio base es $10.000 y pones 30% de margen, el precio final sera $13.000.
- Si no queres aplicar margen, deja el valor en 0.

**Mapeo de columnas:**

- **Nombre:** Selecciona la columna que contiene el nombre del producto.
- **Categoria:** Selecciona la columna que contiene la categoria (opcional, pero permite filtrar despues).

**Titulo del catalogo:**

- Por defecto dice "Lista de Precios".
- Podes cambiarlo a lo que quieras, por ejemplo "Catalogo Mayorista Marzo 2026".

---

### 3.4 Filtrar por categoria

Si seleccionaste una columna de categoria en el paso anterior, aparecen botones con cada categoria detectada:

- Hace clic en una categoria para **desactivarla** (no se incluira en el PDF).
- Hace clic de nuevo para **activarla**.
- Por defecto, todas las categorias estan activas.

Esto es util si queres generar un PDF solo con ciertos tipos de productos (por ejemplo, solo "Calzas" o solo "Remeras").

---

### 3.5 Generar el PDF

1. Revisa la **vista previa** de la tabla con los datos que se van a incluir.
2. Verifica que los precios esten correctos (con o sin margen).
3. Hace clic en el boton **"Generar PDF"**.
4. El archivo PDF se descarga automaticamente a tu computadora.

---

### 3.6 Formato del PDF generado

El PDF tiene un diseno profesional con:

- **Encabezado oscuro** (color `#2B3A52`) con:
  - Nombre del negocio: "Norte Sport"
  - Numero de WhatsApp
  - Instagram
  - Ubicacion
- **Titulo del catalogo** con la fecha de generacion.
- **Tabla de productos** con:
  - Columnas: Producto, Categoria (si se selecciono), Precio
  - Filas alternadas con fondo gris claro para mejor lectura
  - Estilo limpio y profesional
- **Pie de pagina** en cada pagina con:
  - Linea decorativa azul (color `#3B82F6`)
  - "Norte Sport -- Lista de precios -- [fecha]"
  - Numero de pagina ("Pagina X de Y")

---

### 3.7 Personalizar colores y datos del PDF

Los colores del admin y PDF se configuran en `lib/admin.js`, y los datos del negocio en `lib/config.js`:

**Colores del PDF** (`lib/admin.js`):

```javascript
export const adminConfig = {
  password: 'nortesport2026',
  pdfColors: {
    header: '#2B3A52',    // Color del encabezado (azul oscuro)
    border: '#E5E7EB',    // Color de los bordes de la tabla (gris claro)
    accent: '#3B82F6',    // Color de la linea del pie de pagina (azul)
  },
  empresa: 'Norte Sport',
}
```

**Datos del negocio** (`lib/config.js`) — aparecen en el encabezado del PDF:

```javascript
export const negocio = {
  nombre: 'Norte Sport',
  whatsappDisplay: '385-478-8733',    // Numero que aparece en el PDF
  instagram: '@nortesport.sgo',
  ubicacion: 'Santiago del Estero, Argentina',
  // ... otros campos
}
```

Para cambiar cualquiera de estos valores, edita el archivo correspondiente y guarda.

---

## 4. Integracion con WhatsApp

WhatsApp es el principal canal de ventas de Norte Sport. El sitio genera links de WhatsApp con mensajes pre-formateados para facilitar la comunicacion con los clientes.

### 4.1 Como funciona

El archivo `lib/config.js` contiene la funcion `waLink()` que genera links de WhatsApp:

```javascript
export const waLink = (mensaje = '') => {
  const encoded = encodeURIComponent(mensaje)
  return `https://wa.me/${negocio.whatsapp}?text=${encoded}`
}
```

Esta funcion:

1. Recibe un texto de mensaje.
2. Lo codifica para que sea valido en una URL.
3. Genera un link `wa.me` que abre WhatsApp con ese mensaje pre-escrito.
4. El cliente solo tiene que presionar "Enviar".

---

### 4.2 Cambiar el numero de WhatsApp

El numero se configura en `lib/config.js`:

```javascript
export const negocio = {
  // ...
  whatsapp: '5493854788733',
  whatsappDisplay: '385-478-8733',
  // ...
}
```

**Formato del numero (`whatsapp`):**

- Codigo de pais + codigo de area + numero.
- **Sin espacios, sin guiones, sin parentesis, sin signo +**.
- Valor actual: `5493854788733`
  - `54` = codigo de pais (Argentina)
  - `9` = prefijo para celulares
  - `385` = codigo de area (Santiago del Estero)
  - `4788733` = numero de telefono

**Formato de visualizacion (`whatsappDisplay`):**

- Este es el numero que se muestra en el sitio y en los PDFs.
- Puede tener guiones para que sea mas legible: `385-478-8733`.

---

### 4.3 Mensaje del carrito (checkout por WhatsApp)

Cuando un cliente agrega productos al carrito y elige "Continuar por WhatsApp", se genera automaticamente un mensaje con este formato:

```
(emoji de pesa) *Nuevo pedido -- Norte Sport*

(emoji de persona) Nombre: Juan Perez

(emoji de lista) Productos:
* 2x Calza larga deportiva (Talle M) -- $37.000
* 1x Remera dry-fit oversize (Talle L) -- $12.000

(emoji de billete) Total: $49.000

(emoji de nota) Notas: Me gustaria en color negro si hay
```

**Desglose del mensaje:**

| Parte | De donde sale |
|-------|---------------|
| Nombre del cliente | Campo "Nombre" en el carrito |
| Productos (lista) | Productos agregados al carrito con cantidad, talle y subtotal |
| Total | Suma de todos los subtotales |
| Notas | Campo "Notas" en el carrito (opcional) |

**El cliente completa:**

1. Su nombre (opcional).
2. Notas adicionales: color preferido, indicaciones especiales, etc. (opcional).
3. Presiona "Continuar por WhatsApp".
4. Se abre WhatsApp con el mensaje ya escrito.
5. El cliente solo presiona "Enviar".

---

### 4.4 Mensaje de contacto

Desde la seccion "Contacto" del sitio, los clientes pueden enviar consultas por WhatsApp. El mensaje tiene este formato:

```
(emoji de sobre) *Nueva consulta -- Norte Sport*

(emoji de persona) Nombre: Maria Lopez
(emoji de telefono) WhatsApp: 3815551234
(emoji de pin) Asunto: Talles

(emoji de nota) Consulta:
Hola, queria saber si la calza larga viene en talle XXL. Gracias!
```

**Campos del formulario de contacto:**

| Campo | Descripcion | Requerido |
|-------|-------------|-----------|
| Nombre | Nombre del cliente | No |
| WhatsApp | Numero de contacto del cliente | No |
| Asunto | Opciones: Productos, Talles, Envios, Pagos, Otro | No |
| Consulta | Texto libre con la consulta | No |

---

### 4.5 Testear los links de WhatsApp

**Para testear localmente:**

1. Inicia el sitio en modo desarrollo (`npm run dev`).
2. Agrega productos al carrito.
3. Hace clic en "Continuar por WhatsApp".
4. Se abrira WhatsApp Web (o la app en el celular) con el mensaje pre-escrito.
5. Verifica que el mensaje tenga el formato correcto.
6. **No presiones "Enviar"** si solo estas testeando (o enviatelo a vos mismo).

**Verificacion rapida:**

Podes probar el link de WhatsApp directamente en el navegador:

```
https://wa.me/5493854788733?text=Hola,%20quiero%20consultar%20por%20un%20producto
```

Verifica que se abra WhatsApp correctamente con el numero configurado. Si se abre WhatsApp correctamente, el numero esta bien configurado.

**Problemas comunes:**

| Problema | Solucion |
|----------|----------|
| "Este numero no esta en WhatsApp" | Verifica que el formato del numero sea correcto (sin espacios, con codigo de pais) |
| Se abre WhatsApp pero con numero equivocado | Revisa el campo `whatsapp` en `lib/config.js` |
| El mensaje aparece cortado | Puede ser un limite del navegador. En general no deberia pasar con mensajes de carrito normales |
| No se abre nada | En desktop necesitas tener WhatsApp Web o la app de escritorio instalada |

---

## 5. MercadoPago (Proximamente)

### 5.1 Estado actual

Actualmente, el boton **"Pagar con MercadoPago"** en el carrito muestra un mensaje de alerta:

```
"Integracion con MercadoPago proximamente. Por ahora, usa WhatsApp."
```

Esto significa que la pasarela de pago **aun no esta implementada**. Los clientes deben usar WhatsApp para completar su pedido.

### 5.2 Hoja de ruta para implementar MercadoPago

Cuando se decida implementar la integracion, estos son los pasos generales:

**1. Crear cuenta en MercadoPago:**
   - Ir a [mercadopago.com.ar](https://www.mercadopago.com.ar)
   - Registrarse como vendedor
   - Obtener las credenciales de la API (Access Token y Public Key) desde el panel de desarrolladores

**2. Instalar la libreria:**
   ```bash
   npm install @mercadopago/sdk-react mercadopago
   ```

**3. Crear una API route en Next.js** (`app/api/mercadopago/route.js`):
   - Recibe los items del carrito
   - Crea una "preferencia" en MercadoPago con los productos y montos
   - Devuelve el ID de preferencia al frontend

**4. Integrar el checkout en el frontend:**
   - Usar el componente Wallet o Checkout Pro de MercadoPago
   - Reemplazar el alert actual por el checkout real

**5. Manejar notificaciones (webhooks):**
   - Configurar una URL de webhook para recibir notificaciones de pago
   - Procesar pagos aprobados, pendientes y rechazados

**Documentacion oficial:**
- [MercadoPago Developers](https://www.mercadopago.com.ar/developers/es)
- [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)
- [SDK React](https://github.com/mercadopago/sdk-react)

---

## 6. Gestion del Lookbook (Admin)

El lookbook se puede administrar desde el panel de admin, en la pestana **"Lookbook"**.

### 6.1 Acceder al gestor de Lookbook

1. Ingresa al panel de admin (seccion 3.1).
2. Hace clic en la pestana **"Lookbook"** en la barra de navegacion superior.
3. Veras la lista de todos los items del lookbook.

### 6.2 Funcionalidades disponibles

**Reordenar items:**

- Cada item tiene flechas arriba/abajo a la izquierda.
- Hace clic en la flecha hacia arriba para mover el item una posicion antes.
- Hace clic en la flecha hacia abajo para moverlo una posicion despues.
- El orden se guarda automaticamente.

**Editar un item:**

1. Pasa el mouse sobre el item que queres editar.
2. Aparece un icono de lapiz a la derecha.
3. Hace clic en el lapiz.
4. Se abren 3 campos editables:
   - **Titulo:** Nombre del look (ej: "Look Gym Day")
   - **Badge:** Etiqueta opcional (ej: "4 prendas", "Mas vendido", "Nuevo")
   - **Tamano:** Selecciona entre Normal, Grande u Horizontal
5. Hace clic en el icono de check (tilde verde) para guardar.
6. O hace clic en la X para cancelar.

**Tamanos de los items:**

| Tamano | Dimension en la grilla | Descripcion visual |
|--------|----------------------|-------------------|
| Normal | 1 columna x 1 fila | Tarjeta cuadrada estandar |
| Grande | 1 columna x 2 filas | Tarjeta alta, ocupa el doble de alto. Ideal para fotos verticales de cuerpo entero |
| Horizontal | 2 columnas x 1 fila | Tarjeta ancha, ocupa el doble de ancho. Ideal para fotos panoramicas o banners |

**Agregar un item manualmente:**

1. Hace clic en **"+ Agregar manualmente"** al final de la lista.
2. Completa los campos:
   - **URL de imagen:** Link de la imagen (de Google Drive u otra fuente). Opcional.
   - **Titulo:** Nombre del look (obligatorio).
   - **Badge:** Etiqueta (opcional).
   - **Tamano:** Normal, Grande u Horizontal.
3. Hace clic en **"Agregar"**.

**Ver preview:**

- Hace clic en **"Ver preview"** para ver como se veria la grilla del lookbook con los items actuales.
- La preview muestra la disposicion en grilla con los tamanos aplicados.

**Restaurar valores originales:**

- Hace clic en **"Restaurar"** para volver a los items por defecto de `defaults.js`.
- Se pide confirmacion antes de restaurar.
- ATENCION: Esto elimina todos los cambios que hayas hecho desde el admin.

### 6.3 Donde se guardan los datos

Los cambios hechos desde el admin del lookbook se guardan en el **localStorage** del navegador. Esto significa:

- Los cambios se guardan **solo en tu navegador**.
- Si abris el admin desde otro navegador o computadora, no veras esos cambios.
- Si limpias los datos del navegador (cookies, cache), se pierden los cambios.
- Los cambios del admin **no afectan** a los datos que vienen de Google Sheets.

**Para produccion:** Los datos del lookbook deberian gestionarse desde la hoja de Google Sheets (pestana "Lookbook"). El admin local es util para previsualizar y testear cambios rapidamente.

> **Claves de localStorage usadas:**
> - `norte_lookbook_overrides` -- Cambios en los items
> - `norte_lookbook_order` -- Orden personalizado

---

## 7. Gestion de Productos (Admin)

La pestana **"Productos"** del panel de admin permite ver y hacer ajustes rapidos a los productos.

### 7.1 De donde salen los datos que se ven en el admin?

> **MUY IMPORTANTE:** Actualmente la tabla del admin muestra los datos de `lib/config.js` (los datos que vienen con el sitio). **NO lee de Google Sheets.**

**Flujo actual de datos:**

```
Google Sheets  ──>  Pagina publica (landing page)
                     ↑ fallback si Sheets falla
defaults.js   ──>  Panel admin (siempre)
                     ↑ + overrides de localStorage
```

**Esto significa:**

| Donde | Que datos muestra |
|-------|-------------------|
| **Pagina publica** (lo que ven tus clientas) | Datos de Google Sheets si esta configurado. Si no, usa defaults.js como respaldo |
| **Panel admin** (tabla de productos) | Siempre muestra defaults.js + cambios que hayas hecho desde el admin |

**En resumen:**

- Si agregas un producto nuevo en Google Sheets → **se ve en la tienda** pero **NO aparece en la tabla del admin**.
- Si cambias un precio en Google Sheets → **se actualiza en la tienda** pero la tabla del admin sigue mostrando el precio de defaults.js.
- Si cambias un precio en el admin → **solo se guarda en tu navegador** (localStorage). No modifica Sheets ni defaults.js.

**Para que sirve entonces la tabla del admin?**

- Para hacer **ajustes rapidos temporales** (cambiar precio, stock o disponibilidad) que solo vos ves en tu navegador.
- Para tener una **vista rapida** de los productos base del sitio (de defaults.js).
- En el futuro, si se implementa la Google Sheets API con escritura, el admin podria modificar Sheets directamente.

### 7.2 Como se relacionan Sheets, config.js y el admin?

```
                    TU FLUJO DE TRABAJO
                    ====================

1. Cargas los productos en Google Sheets
   (nombre, precio, talles, fotos, stock, etc.)
          ↓
2. La tienda lee Sheets cada 5 minutos
   y muestra los datos actualizados a las clientas
          ↓
3. Si necesitas un ajuste urgente que no podes
   hacer en Sheets, usas el admin para un override
   temporal en tu navegador
```

**Recomendacion:** Gestiona TODO desde Google Sheets. Usa la tabla del admin solo como referencia rapida o para ajustes de emergencia.

### 7.3 Acceder al gestor de productos

1. Ingresa al panel de admin (`/admin`, contrasena: `nortesport2026`).
2. Hace clic en la pestana **"Productos"** en la barra de navegacion.
3. Veras una tabla con todos los productos de defaults.js.

### 7.4 Funcionalidades disponibles

**Editar precio:**

1. Hace clic sobre el precio de cualquier producto.
2. Aparece un campo numerico editable.
3. Escribi el nuevo precio (solo numeros, sin $ ni puntos).
4. Presiona **Enter** o hace clic en el tilde verde para guardar.
5. Presiona **Escape** o la X para cancelar.

**Editar stock:**

1. Hace clic sobre el numero de stock de cualquier producto.
2. Aparece un campo numerico editable.
3. Escribi la nueva cantidad (0 = sin stock).
4. Presiona **Enter** para guardar o **Escape** para cancelar.
5. Los productos con stock 0 se muestran en rojo.

**Cambiar disponibilidad:**

1. En la columna "Disponible", cada producto tiene un toggle (Si/No).
2. Hace clic en el toggle para cambiar el estado.
3. **Si:** El producto es visible en la tienda.
4. **No:** El producto se oculta de la tienda.
5. El cambio se aplica inmediatamente.

**Restaurar valores originales:**

- Si hiciste cambios, aparece el boton **"Restaurar originales"** en la esquina superior derecha.
- Hace clic para volver todos los productos a sus valores por defecto.
- Se pide confirmacion.

### 7.5 Informacion mostrada en la tabla

| Columna | Descripcion | Editable |
|---------|-------------|----------|
| ID | Numero identificador del producto | No |
| Nombre | Nombre del producto | No |
| Categoria | Categoria a la que pertenece | No |
| Precio | Precio actual | Si (click para editar) |
| Stock | Cantidad disponible (rojo si es 0) | Si (click para editar) |
| Badge | Etiqueta (NUEVO, SALE, ULTIMAS) o guion si no tiene | No |
| Disponible | Toggle Si/No para mostrar/ocultar el producto | Si (click para toggle) |

### 7.6 Donde se guardan los cambios del admin

Los cambios hechos desde el admin se guardan en **localStorage** (almacenamiento del navegador):

- Clave: `norte_productos_overrides`
- Los cambios **solo existen en tu navegador actual**. Si abris otro navegador o limpias la cache, se pierden.
- Se aplican como "sobreescrituras" sobre los datos originales de `lib/defaults.js`.
- **NO modifican Google Sheets.** Tus clientas no ven estos cambios — ellas ven lo que hay en Sheets.

### 7.7 Entonces, donde debo gestionar mis productos?

| Tarea | Donde hacerlo |
|-------|---------------|
| Agregar un producto nuevo | Google Sheets (agregar fila en hoja "Productos") |
| Cambiar precio | Google Sheets (editar celda Precio) |
| Actualizar stock | Google Sheets (editar celda Stock) |
| Agregar/cambiar fotos | Google Drive (subir fotos) + Google Sheets (pegar links en ImagenURL) |
| Ocultar producto temporalmente | Google Sheets (poner Disponible en FALSE) o Sheets (poner Stock en 0) |
| Eliminar producto | Google Sheets (borrar la fila) |
| Ajuste de emergencia rapido | Panel admin (se guarda solo en tu navegador) |

> **Tip:** Los cambios en Google Sheets se reflejan en la tienda en un maximo de **5 minutos** (el sitio cachea los datos y los refresca cada 300 segundos).

---

## 8. Datos Mock vs Datos Reales

El sitio tiene un **sistema de fallback** (respaldo) que garantiza que siempre muestre contenido, incluso si Google Sheets no esta disponible.

### 8.1 Como funciona el sistema de fallback

```
Cliente visita el sitio
        |
        v
Intenta cargar datos de Google Sheets
        |
        +--> EXITO --> Muestra datos de Sheets (datos reales)
        |
        +--> ERROR --> Muestra datos de config.js (datos mock)
```

**Cada seccion del sitio tiene su propio fallback:**

| Seccion | Funcion | Datos de fallback |
|---------|---------|----------------------|
| Productos | `getProductos()` | `productos` en defaults.js (12 productos de ejemplo) |
| Testimonios | `getTestimonios()` | `testimonios` en defaults.js (6 testimonios de ejemplo) |
| Lookbook | `getLookbook()` | `lookbookItems` en defaults.js (8 items de ejemplo) |
| Config (temporada, promos) | `getConfig()` | `temporadaActual` y `promos` en defaults.js |

### 8.2 Como modificar los datos de fallback

Los datos de fallback estan en `lib/defaults.js`. Son los datos que se muestran cuando Google Sheets no esta configurado o no esta disponible.

**Productos de fallback:**

Busca el array `productos` en `defaults.js`. Cada producto tiene esta estructura:

```javascript
{
  id: 1,
  nombre: 'Calza larga deportiva',
  categoria: 'Calzas largas',
  descripcion: 'Calza larga con cintura alta y tela suplex...',
  precio: 18500,
  precioAnterior: null,    // null = sin descuento
  talles: ['S', 'M', 'L', 'XL'],
  badge: 'NUEVO',          // 'NUEVO', 'SALE', 'ULTIMAS', o null
  imagenes: [              // Array de fotos — la primera es la principal
    '/productos/calza-larga-deportiva.jpg',
    '/productos/calza-larga-deportiva-2.jpg',
    '/productos/calza-larga-deportiva-3.jpg',
  ],
  placeholder: 'linear-gradient(135deg, #2B3A52, #6B7B8D)', // Gradiente de fallback
  stock: 10,              // Cantidad disponible. 0 = sin stock. null = ilimitado
  disponible: true,
}
```

> **Nota:** En Sheets, las multiples fotos van en la misma celda `ImagenURL` separadas por `|`. En defaults.js, se usan como array `imagenes`. El sitio convierte automaticamente el formato de Sheets al array interno.

Para modificar un producto de fallback, edita los valores directamente en el archivo.

**Testimonios de fallback:**

```javascript
{
  id: 1,
  nombre: 'Maria L.',
  texto: 'Las calzas son increibles...',
  estrellas: 5,
}
```

**Lookbook de fallback:**

```javascript
{
  id: 1,
  titulo: 'Look Gym Day',
  badge: '4 prendas',
  tamano: 'grande',    // 'normal', 'grande', 'horizontal'
  imagenUrl: '/lookbook/look-gym-day.jpg',  // Ruta a foto real en /public/lookbook/
  placeholder: 'linear-gradient(135deg, #1A2535, #6B7B8D)', // Gradiente de fallback
}
```

### 8.3 Cuando usar datos de fallback vs datos reales

| Escenario | Que usar |
|-----------|----------|
| Desarrollo y pruebas locales | Datos de fallback (no necesitas configurar Sheets) |
| Demo o presentacion | Datos de fallback con valores atractivos |
| Sitio en produccion | Datos reales de Google Sheets |
| Google Sheets tiene problemas temporales | Se usa automaticamente el fallback |
| Queres probar un cambio rapido | Edita defaults.js, despues replica en Sheets |

### 8.4 Verificar si el sitio usa datos reales o de fallback

Si el `SHEET_ID` en `lib/admin.js` es `'TU_GOOGLE_SHEET_ID_AQUI'` (el valor por defecto), el sitio **siempre** usara datos de fallback porque no puede conectarse a ninguna hoja real.

Una vez que configures un Sheet ID real y la hoja sea publica, el sitio intentara cargar los datos reales. Si falla, usara los de fallback como respaldo silencioso (no muestra ningun error al visitante).

---

## 9. Configuracion para Produccion

Antes de lanzar el sitio al publico, segui esta lista de verificacion:

### 9.1 Checklist de produccion

- [ ] **1. Configurar Google Sheets ID**
  - Editar `lib/admin.js`
  - Cambiar `SHEET_ID` por el ID real de tu hoja de calculo
  - Verificar que la hoja sea publica

- [x] **2. Numero de WhatsApp** (ya configurado)
  - `negocio.whatsapp`: `'5493854788733'`
  - `negocio.whatsappDisplay`: `'385-478-8733'`

- [ ] **3. Cambiar la contrasena del admin**
  - Editar `lib/admin.js`
  - Cambiar `adminConfig.password` de `'nortesport2026'` a una contrasena segura
  - **NO uses contrasenas simples** en produccion

- [x] **4. Datos del negocio** (ya configurados)
  - `instagram`: `'@nortesport.sgo'`
  - `instagramUrl`: URL completa con parametros UTM
  - Verificar que `nombre`, `slogan`, `descripcion`, `horarios` y `ubicacion` esten actualizados

- [x] **5. Imagenes reales** (ya configuradas)
  - Las fotos de productos estan en `/public/productos/` (colecciones BASICS y NAVY & GREY)
  - Las fotos del lookbook estan en `/public/lookbook/`
  - La foto del hero esta en `/public/hero/hero-bg.jpg`
  - Cada producto en `config.js` tiene `imagenUrl` apuntando a su foto real
  - Cada lookbook item tiene `imagenUrl` apuntando a su foto real
  - Si se usa Google Sheets, copiar los links de imagenes a la columna `ImagenURL`

- [ ] **6. Completar la hoja de Google Sheets**
  - Hoja "Productos" con todos los productos reales
  - Hoja "Testimonios" con testimonios reales
  - Hoja "Config" con la temporada actual
  - Hoja "Lookbook" con los looks reales

- [ ] **7. Considerar CDN de imagenes** (si se espera alto trafico)
  - Cloudinary, Vercel Blob, o similar
  - Reemplazar los links de Drive por links del CDN

- [ ] **8. Configurar MercadoPago** (cuando este implementado)
  - Crear cuenta de vendedor
  - Obtener credenciales
  - Configurar en el proyecto

- [ ] **9. Deploy a Vercel**
  - Ver seccion 9.2

- [ ] **10. Dominio personalizado** (opcional)
  - Ver seccion 9.3

### 9.2 Deploy a Vercel

Vercel es la plataforma recomendada para desplegar sitios Next.js. El plan gratuito es suficiente para la mayoria de los casos.

**Paso a paso:**

1. Crea una cuenta en [vercel.com](https://vercel.com) (podes usar tu cuenta de GitHub).
2. Conecta tu repositorio de GitHub con el proyecto Norte Sport.
3. Vercel detecta automaticamente que es un proyecto Next.js.
4. Hace clic en **"Deploy"**.
5. En unos minutos, el sitio estara online con una URL tipo `tu-proyecto.vercel.app`.

**Cada vez que subas cambios al repositorio,** Vercel automaticamente hace un nuevo deploy.

### 9.3 Dominio personalizado

1. En el dashboard de Vercel, ve a la configuracion del proyecto.
2. Busca la seccion **"Domains"**.
3. Agrega tu dominio personalizado (ej: `nortesport.com.ar`).
4. Vercel te indicara los registros DNS que necesitas configurar en tu proveedor de dominio.
5. Configura los registros DNS segun las instrucciones.
6. Espera a que se propague (puede tardar hasta 48 horas, pero generalmente es mucho mas rapido).

---

## 10. Preguntas Frecuentes (FAQ tecnica)

### Cada cuanto se actualizan los datos de Google Sheets?

Los datos se refrescan **cada 5 minutos** (300 segundos). Esto significa que si modificas la hoja de Sheets, los cambios pueden tardar hasta 5 minutos en aparecer en el sitio. Este tiempo de cache es configurable en `lib/sheets.js` (valor `revalidate: 300`).

---

### Puedo usar otra hoja de calculo diferente?

Si. Solo necesitas cambiar el `SHEET_ID` en `lib/admin.js` por el ID de la nueva hoja. Asegurate de que la nueva hoja tenga las mismas pestanas y columnas con los mismos nombres.

---

### Que pasa si Google Sheets se cae o no esta disponible?

El sitio sigue funcionando normalmente. Usa automaticamente los **datos de respaldo** que estan en `lib/defaults.js`. El visitante no nota ninguna diferencia, excepto que los datos pueden no estar actualizados.

---

### Como agrego mas productos?

**Opcion A -- desde Google Sheets (recomendado):**
1. Abre la hoja de calculo.
2. Ve a la pestana "Productos".
3. Agrega una nueva fila con todos los datos del producto.
4. Espera hasta 5 minutos para que aparezca en el sitio.

**Opcion B -- desde defaults.js (para testing):**
1. Abre `lib/defaults.js`.
2. Agrega un nuevo objeto al array `productos` siguiendo la misma estructura.
3. Guarda el archivo.

---

### Como cambio la temporada?

**Desde Google Sheets:**
1. Ve a la pestana "Config".
2. Modifica los valores de `temporadaNombre`, `temporadaColor`, `temporadaColorNombre` y `temporadaEmoji`.

**Desde defaults.js:**
1. Edita el objeto `temporadaActual` en `lib/defaults.js`:
```javascript
export const temporadaActual = {
  nombre: 'Invierno 2026',
  color: '#1A365D',
  colorNombre: 'Azul Medianoche',
  emoji: '(emoji de copo de nieve)',
}
```

---

### Como cambio los textos de la barra de promociones?

**Desde Google Sheets:**
1. Ve a la pestana "Config".
2. Modifica el valor de la clave `promos`.
3. Separa cada texto con `|` (barra vertical).
4. Ejemplo: `Envios gratis arriba de $25.000|Nuevos talles disponibles|3 cuotas sin interes`

**Desde defaults.js:**
1. Edita el array `promos` en `lib/defaults.js`:
```javascript
export const promos = [
  'Envios gratis arriba de $25.000',
  'Nuevos talles disponibles',
  '3 cuotas sin interes',
]
```

---

### Los cambios que hago en el admin (dashboard) afectan a otros usuarios?

**No.** Los cambios del admin (editar precios, cambiar disponibilidad, modificar lookbook) se guardan en el **localStorage de TU navegador**. Otros usuarios ven los datos que vienen de Google Sheets o de config.js. El admin es una herramienta de previsualizacion y ajuste local, no un CMS compartido.

---

### Puedo usar imagenes de otro servicio que no sea Google Drive?

Si. La columna `ImagenURL` acepta cualquier URL de imagen publica. Puede ser de:
- Google Drive (se convierte automaticamente)
- Cloudinary
- ImgBB
- Cualquier servidor que devuelva una imagen directamente

Solo asegurate de que la URL sea publica y accesible sin autenticacion. Tambien podes mezclar servicios en un mismo producto usando el separador `|`:

```
https://drive.google.com/.../foto1 | https://i.imgur.com/foto2.jpg | https://res.cloudinary.com/.../foto3
```

---

### Que navegadores soporta el sitio?

El sitio es compatible con todos los navegadores modernos:
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS/iOS)
- Opera

No se garantiza compatibilidad con Internet Explorer.

---

### Como puedo ver los datos que el sitio esta leyendo de Sheets?

Podes acceder directamente a la API de Google Sheets escribiendo esta URL en tu navegador (reemplaza `TU_SHEET_ID` por tu ID real):

```
https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:json&sheet=Productos
```

Si ves datos JSON, la conexion funciona. Si ves un error, la hoja no es publica o el ID es incorrecto.

---

### Cuantos productos puedo tener?

No hay un limite tecnico estricto. Google Sheets soporta hasta 10 millones de celdas por hoja de calculo. En la practica, tener cientos de productos no deberia ser un problema. Si tenes miles de productos, podrias notar que la carga es un poco mas lenta.

---

### Puedo tener multiples personas editando la hoja de Sheets?

Si. Google Sheets permite edicion colaborativa en tiempo real. Varias personas pueden editar la hoja al mismo tiempo. Los cambios se sincronizan automaticamente entre todos los editores.

Para dar acceso de edicion:
1. Abre la hoja de Sheets.
2. Hace clic en "Compartir".
3. Agrega el email de la persona con permiso de **"Editor"**.

> Recorda que el acceso publico de la hoja debe mantenerse en **"Lector"** (solo lectura). El permiso de "Editor" se da individualmente a personas de confianza.

---

### Cuantas fotos puedo poner por producto?

No hay un limite estricto, pero se recomienda entre **2 y 5 fotos** por producto. La primera foto es la principal (la que se ve primero en la grilla). Las demas se ven al navegar el carrusel.

Para agregarlas, separa los links con `|` en la columna `ImagenURL` de Sheets:

```
link-foto-1 | link-foto-2 | link-foto-3
```

Si solo pones un link (sin `|`), no se muestra carrusel — solo la foto fija.

---

### El carrusel de fotos funciona en celular?

Si. En celular las flechas del carrusel se muestran al tocar la imagen, y en la vista rapida (Quick View) aparecen los thumbnails y flechas de navegacion. El carrusel es completamente responsive.

---

> **Necesitas ayuda adicional?** Contacta al equipo de desarrollo o revisa el codigo fuente del proyecto. Los archivos principales de integracion estan en la carpeta `lib/`:
> - `lib/config.js` -- Datos del negocio (nombre, WhatsApp, Instagram, stats, navegacion)
> - `lib/defaults.js` -- Datos de fallback (productos, testimonios, lookbook, FAQs, promos, temporada)
> - `lib/admin.js` -- Configuracion del admin (contrasena, colores PDF, Sheet ID)
> - `lib/sheets.js` -- Conexion con Google Sheets
> - `lib/drive.js` -- Conversion de links de Google Drive
> - `lib/excel-parser.js` -- Lectura de archivos Excel/CSV
> - `lib/pdf-generator.js` -- Generacion de PDFs
