# Activar la sincronización del panel de administración

¡Hola! Esta guía es para conectar tu **panel de administración de Norte Sport** con tu **planilla de Google Sheets**, así los cambios que hacés desde el panel (precios, stock, lookbook, etc.) se guardan automáticamente en la planilla y aparecen en la web de inmediato.

Es un paso que se hace **una sola vez**. Te lleva unos 10 minutos. No necesitás saber nada técnico, solamente seguir las instrucciones tal cual.

---

## Lo que necesitás antes de empezar

- [ ] Estar logueada en tu cuenta de Google (la misma que es **dueña** de la planilla de Norte Sport).
- [ ] Tener a mano el archivo `apps-script.gs` que te pasó el desarrollador.
- [ ] Tener un momento sin interrupciones (10 minutos).

> ⚠️ **Importante:** la cuenta con la que hagas estos pasos tiene que ser la dueña de la planilla. Si la planilla está a nombre de otra persona, pedile que haga ella estos pasos.

---

## Paso 1 — Abrir el editor de Apps Script

1. Entrá a tu planilla de Google Sheets de Norte Sport.
2. En el menú de arriba, hacé click en **Extensiones**.
3. Del menú que se despliega, elegí **Apps Script**.

   ![](https://i.imgur.com/placeholder1.png)
   *(Va a abrirse una pestaña nueva con un editor de código)*

4. Vas a ver un archivo llamado **`Code.gs`** con algo de código de ejemplo (algo como `function myFunction() {}`).

---

## Paso 2 — Pegar el código nuevo

1. Hacé click dentro del editor y **seleccioná todo** lo que hay (`Ctrl + A` en Windows o `Cmd + A` en Mac).
2. Borralo (`Delete` o `Backspace`).
3. Abrí el archivo **`apps-script.gs`** que te pasó el desarrollador (lo podés abrir con el Bloc de notas o cualquier editor de texto).
4. Seleccioná **todo** el contenido del archivo (`Ctrl + A`) y copialo (`Ctrl + C`).
5. Volvé a la pestaña de Apps Script y pegá el código (`Ctrl + V`) en el editor vacío.

> ✅ El código ya viene preparado con todas las claves necesarias. **No tenés que cambiar nada** dentro del código.

6. Guardá los cambios:
   - Click en el ícono del **disquete** (💾) arriba a la izquierda, o
   - Apretá `Ctrl + S` (Windows) / `Cmd + S` (Mac).

7. Si te pide ponerle un nombre al proyecto, escribí: **`Norte Sport Sync`** y hacé click en *Cambiar nombre*.

---

## Paso 3 — Publicar el script (deploy)

Acá es donde le decimos a Google que ese código tiene que estar disponible para recibir cambios desde el panel.

1. Arriba a la derecha del editor, hacé click en el botón azul **Implementar** (o "Deploy" si lo ves en inglés).
2. Del menú que se abre, elegí **Nueva implementación**.

   ![](https://i.imgur.com/placeholder2.png)

3. Va a abrirse una ventana. A la izquierda hay un ícono de **engranaje (⚙️)** al lado del título "Seleccionar tipo". Hacé click ahí.
4. De la lista, elegí **Aplicación web**.

5. Vas a ver un formulario con varios campos. Completalos así:

   | Campo | Qué poner |
   |---|---|
   | **Descripción** | `Norte Sport admin sync` |
   | **Ejecutar como** | **Yo** (debería aparecer tu email) |
   | **Quién puede acceder** | **Cualquier usuario** |

   > Es **muy importante** que "Quién puede acceder" diga **Cualquier usuario** (no "Cualquier usuario con cuenta de Google", solamente "Cualquier usuario"). El sistema usa una clave secreta para protegerse, así que es seguro.

6. Hacé click en **Implementar** (botón azul abajo a la derecha).

---

## Paso 4 — Autorizar permisos

La primera vez, Google te va a pedir autorización para que el script pueda escribir en tu planilla. Es normal y solo pasa una vez.

1. Va a aparecer una ventana que dice **"Es necesario autorizar"**. Hacé click en **Autorizar acceso**.
2. Se abre una ventana de Google. Elegí **tu cuenta** (la dueña de la planilla).
3. **Posiblemente te aparezca una pantalla amarilla/naranja** que dice algo como:

   > *"Google no ha verificado esta aplicación"*

   Esto es **completamente normal**. Pasa porque el script es uno hecho a medida para vos, no es una app pública del Google Store. **No es peligroso** — el código lo escribió tu desarrollador y solamente toca tu propia planilla.

   Para continuar:
   - Hacé click en **Configuración avanzada** (texto chiquito abajo a la izquierda).
   - Después click en **Ir a Norte Sport Sync (no seguro)** (el texto va a tener el nombre que le pusiste).

4. Te muestra una lista de permisos que el script va a tener (leer y modificar tu planilla). Hacé click en **Permitir**.

---

## Paso 5 — Copiar la URL y enviarla

Después de autorizar, vuelve a la ventana de Apps Script y aparece un mensaje **"Implementación actualizada"** con dos campos:

- **ID de implementación**
- **URL de la aplicación web** ← este es el importante

1. Hacé click en el botón **Copiar** que está al lado de la **URL de la aplicación web**.
2. La URL es larga y termina en `/exec`. Algo como:
   ```
   https://script.google.com/macros/s/AKfyc.................../exec
   ```
3. **Pegale esta URL a tu desarrollador** (por WhatsApp, mail, lo que sea).

4. Hacé click en **Listo** para cerrar la ventana.

---

## ¡Y eso es todo! 🎉

Una vez que le pases la URL al desarrollador, él la va a configurar de su lado y la sincronización va a empezar a funcionar. A partir de ese momento, cualquier cambio que hagas desde el panel de administración (precios, stock, lookbook) va a aparecer automáticamente en tu planilla y en la web.

---

## Preguntas frecuentes

### ¿Esto es seguro? ¿Alguien puede entrar a mi planilla?

Sí, es seguro. Aunque el deploy diga "Cualquier usuario", el script tiene una **clave secreta** adentro. Solamente las requests que vienen desde el panel de Norte Sport (que también tiene esa clave) pueden hacer cambios. Cualquier otra persona que intente acceder a la URL recibe un error de "no autorizado".

### ¿Tengo que hacer esto cada vez que cambio algo en la planilla?

No. Es un paso de **una sola vez**. Una vez configurado, queda funcionando para siempre.

### ¿Y si en el futuro mi desarrollador modifica el script?

Si tu desarrollador te pasa una versión nueva de `apps-script.gs`, vas a tener que:
1. Volver a entrar a **Extensiones → Apps Script**.
2. Reemplazar todo el código viejo por el nuevo.
3. Guardar.
4. Ir a **Implementar → Administrar implementaciones**.
5. Hacer click en el ícono del **lápiz** ✏️ al lado de la implementación que ya existe.
6. En **Versión**, elegir **Nueva versión**.
7. Click en **Implementar**.

Eso publica la versión nueva. **La URL no cambia**, así que no hace falta avisarle nada al desarrollador.

### ¿Puedo desactivar la sincronización si quiero?

Sí. En **Implementar → Administrar implementaciones**, podés archivar o eliminar el deploy. A partir de ese momento el panel deja de sincronizar con la planilla (pero sigue funcionando localmente).

### Algo no me funcionó / no me aparece la opción

Avisale a tu desarrollador y mostrale una captura de pantalla de lo que estás viendo. La mayoría de los problemas se resuelven en 2 minutos.

---

¿Dudas? Cualquier cosa, hablá con tu desarrollador. 🙌
