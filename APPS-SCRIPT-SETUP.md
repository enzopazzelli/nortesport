# Sincronización Admin → Google Sheets (vía Apps Script)

El admin panel guarda los cambios en `localStorage` y, además, los reenvía a un endpoint de Google Apps Script que escribe directamente en la planilla. Así los cambios funcionan **multi-dispositivo** y no quedan atados al navegador donde se editó.

Este archivo explica cómo configurar el webhook desde cero.

---

## 1. Pegar el script en Apps Script

1. Abrí la planilla de Google Sheets que usa Norte Sport (la misma del `SHEET_ID` en `lib/admin.js`).
2. En el menú: **Extensiones → Apps Script**.
3. Borrá el contenido del archivo `Code.gs` que viene por defecto.
4. Copiá y pegá **todo el contenido** de [apps-script.gs](apps-script.gs) (en la raíz del repo).
5. **Cambiá el valor de `TOKEN`** por un string secreto largo y único. Generá uno con:

   **PowerShell (Windows):**
   ```powershell
   $bytes = New-Object byte[] 32
   [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   [BitConverter]::ToString($bytes) -replace '-',''
   ```

   **Git Bash / WSL / macOS / Linux:**
   ```bash
   openssl rand -hex 32
   ```

   Reemplazá `'CAMBIAR_POR_UN_SECRETO_LARGO_Y_UNICO'` por el que generaste.
6. Guardá (`Ctrl/Cmd + S`). Apps Script puede pedirte un nombre para el proyecto — poné `Norte Sport Sync` o lo que prefieras.

---

## 2. Deployar como Web App

### ⚠️ Antes de deployar: ¿quién hace el deploy?

Apps Script siempre va a ejecutar el script con la cuenta de **quien hizo el deploy** (es la opción "Ejecutar como: Yo", la única que nos sirve — la alternativa "Usuario que accede" requeriría login de Google y el flujo `/api/sync` es anónimo).

Eso significa:

- La cuenta que deploya es la que lee/escribe la planilla.
- Si esa cuenta pierde el permiso de editor sobre la planilla, **el webhook se rompe**.
- Las quotas de ejecución de Apps Script (invocaciones por día, tiempo de ejecución, etc.) se cuentan contra esa cuenta.

Hay dos escenarios posibles según quién sea esa cuenta:

#### Caso A — Deploy hecho por un colaborador / desarrollador (testing)

Útil cuando estás desarrollando y la planilla pertenece al cliente. Vos sos editor, así que podés crear el deploy bajo tu cuenta sin molestar al dueño.

- ✅ Cero fricción para arrancar a probar.
- ⚠️ Si el dueño te quita el acceso de editor en el futuro, el script va a fallar con error de permisos.
- Recomendado **solo para development y staging**.

#### Caso B — Deploy hecho por el dueño de la planilla (producción)

Es el setup recomendado para producción. El dueño de la planilla deploya el script desde su propia cuenta.

- ✅ No depende del acceso de ningún colaborador externo.
- ✅ Sobrevive a cambios de equipo.
- ✅ Quotas contra la cuenta del dueño (no es un problema para el volumen de un admin panel).
- Requiere coordinar 5 minutos con el cliente para que haga el paso a paso.

> **Estrategia sugerida:** mientras desarrollás, deployás vos (Caso A) y guardás esa URL en `.env.local`. Cuando el panel está listo para producción, le pedís al dueño que haga el deploy (Caso B), te pasa la nueva URL, y la metés en las env vars de Vercel. La URL local de testing puede convivir con la de producción sin problema.

---

### Caso A — Pasos para deployar (vos como editor)

1. Abrí la planilla del cliente y entrá a **Extensiones → Apps Script** (necesitás permiso de editor sobre la planilla).
2. Pegá `apps-script.gs` y guardá (esto ya lo hiciste en la sección 1).
3. Arriba a la derecha: **Implementar → Nueva implementación**.
4. En el ícono del engranaje, elegí **Aplicación web**.
5. Configurá:
   - **Descripción:** `Norte Sport admin sync (dev)`
   - **Ejecutar como:** *Yo* → tu cuenta aparece acá.
   - **Quién puede acceder:** *Cualquier usuario*.
6. Click en **Implementar**.
7. La primera vez te va a pedir **autorizar permisos** sobre la planilla. Aceptá con tu cuenta de Google. Si te aparece "Esta aplicación no está verificada", click en *Configuración avanzada → Ir a (no seguro)*. Es normal — el script lo escribiste vos, no está publicado en la Google Workspace Marketplace.
8. Copiá la **URL de la aplicación web** (termina en `/exec`). Esa va al `.env.local` (ver sección 3).

---

### Caso B — Pasos para que los haga el dueño de la planilla

Mandale al dueño este checklist (o el repositorio entero junto con [apps-script.gs](apps-script.gs)):

1. Abrir la planilla y entrar a **Extensiones → Apps Script**.
2. Borrar el contenido del archivo `Code.gs` que viene por defecto.
3. Pegar el contenido completo de `apps-script.gs` (lo provee el desarrollador, **con el `TOKEN` ya incluido**).
4. Guardar (`Ctrl/Cmd + S`). Si pide nombre de proyecto, poner `Norte Sport Sync`.
5. **Implementar → Nueva implementación → ⚙️ → Aplicación web**.
6. Configurar:
   - **Descripción:** `Norte Sport admin sync (prod)`
   - **Ejecutar como:** *Yo* (la cuenta del dueño).
   - **Quién puede acceder:** *Cualquier usuario*.
7. Click en **Implementar** y autorizar permisos cuando lo pida.
8. Copiar la **URL de la aplicación web** (termina en `/exec`) y enviársela al desarrollador.

> ⚠️ El `TOKEN` que figura en el script es secreto. Compartilo con el dueño solo por canales seguros (gestor de contraseñas, mensaje cifrado), nunca por mail en texto plano ni Slack público.

---

### Después de cualquier edición del script

Si en algún momento editás `apps-script.gs` (cualquiera de los dos casos), **no alcanza con guardar**. Hay que entrar a **Implementar → Administrar implementaciones → ✏️ ícono de lápiz → Versión: Nueva versión → Implementar**. Si solo guardás el código sin crear nueva versión, el deploy sigue ejecutando la versión vieja y los cambios no entran en producción.

> Buena noticia: la **URL del Web App no cambia** entre versiones, así que no tenés que tocar `.env.local` ni Vercel cada vez.

#### ⚠️ Si la edición agrega un *scope* nuevo (ej: Drive)

El script original solo tocaba Sheets. Cuando agregamos `upload_image`, el código pasó a usar `DriveApp.getFolderById(...)` — eso requiere un permiso nuevo (acceso a Drive) que el deploy original no tiene.

Cuando hagás "Nueva versión" con código que usa scopes nuevos:

1. Apps Script va a detectar que el script ahora pide más permisos.
2. La primera invocación que use ese scope (ej: la primera subida de imagen) **va a fallar con un error de autorización**.
3. Tenés que volver a abrir el editor → ejecutar manualmente cualquier función (botón ▶️ "Ejecutar" en la barra de herramientas, eligiendo `uploadImage` por ejemplo) → Google te muestra una pantalla de autorización con los permisos nuevos → **Autorizar acceso → seleccionar la cuenta dueña → Permitir**.
4. Después de eso, las invocaciones del Web App vuelven a funcionar.

> Si el script ya está deployado bajo la cuenta de la clienta, **ella** es la que tiene que hacer este paso, no vos. Avisale antes y guidala por los pasos arriba (o mandale un screenshot).

Otra forma equivalente (y a veces más simple): hacer una invocación de prueba que dispare el scope. La pantalla de autorización aparece igual.

---

## 3. Configurar variables de entorno en Next.js

Creá (o editá) `.env.local` en la raíz del proyecto con:

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
APPS_SCRIPT_TOKEN=el_mismo_token_secreto_que_pusiste_arriba
```

Reiniciá el dev server (`npm run dev`) para que tome las variables nuevas.

**En Vercel (producción):** agregá las dos variables en *Project Settings → Environment Variables* y redeployá.

---

## 4. Probar que funciona

### Test rápido del endpoint (sin admin)

Pegá la URL de la web app en el navegador. Tendrías que ver:

```json
{ "ok": true, "message": "Norte Sport sync endpoint is running" }
```

### Test desde el admin

1. Andá a `/admin/dashboard`.
2. Tab **Productos** → editá un precio o cambiá la disponibilidad de algún producto.
3. Verificá en la planilla de Google Sheets (hoja `Productos`) que el cambio aparezca casi instantáneamente.
4. Tab **Lookbook** → reordená un item, editalo, o agregá uno nuevo. Verificá la hoja `Lookbook`.

Si los cambios **no** aparecen en Sheets, abrí la consola del navegador. El helper loggea `[sync] failed:` con el error.

---

## 5. Acciones soportadas

| Acción | Hoja / Recurso | Qué hace |
|--------|----------------|----------|
| `update_product` | `Productos` | Actualiza columnas de un producto por `ID`. |
| `add_product` | `Productos` | Agrega un producto nuevo, generando el `ID` en el server. Devuelve `{ ok: true, id }`. |
| `update_lookbook` | `Lookbook` | Actualiza columnas de un item por `ID`. |
| `add_lookbook` | `Lookbook` | Agrega un item nuevo, generando el `ID` en el server. Devuelve `{ ok: true, id }`. |
| `delete_lookbook` | `Lookbook` | Borra una fila por `ID`. (Handler listo, UI no lo expone aún.) |
| `reorder_lookbook` | `Lookbook` | Reescribe todas las filas en el orden indicado por el array `order`. |
| `upload_image` | Drive (carpeta de productos) | Sube una imagen base64 a la carpeta `PRODUCT_IMAGES_FOLDER_ID`, la hace pública, y devuelve la URL directa (`lh3.googleusercontent.com/d/...`). |

Productos: soporta **update y add** (no hay delete por UI). Lookbook: soporta todo.

---

## 6. Cómo funciona el flujo de seguridad

```
Browser (admin)  ──►  /api/sync (Next route)  ──►  Apps Script Web App  ──►  Google Sheet
                       │                              │
                       │  Agrega { token } al payload │  Verifica token === TOKEN
                       │  desde APPS_SCRIPT_TOKEN     │  Si no matchea → unauthorized
```

- El token **nunca** llega al cliente: vive sólo en `.env.local` / Vercel y se inyecta en el route handler de Next.
- Si `APPS_SCRIPT_URL` o `APPS_SCRIPT_TOKEN` no están seteadas, `/api/sync` devuelve `503 sync_not_configured`. El admin sigue funcionando — los cambios se quedan en `localStorage` como antes.

---

## 7. Troubleshooting

- **`unauthorized`** en la respuesta → el `APPS_SCRIPT_TOKEN` del `.env.local` no coincide con el `TOKEN` del script. Asegurate de que sean idénticos (y de haber redeployado el script si lo cambiaste).
- **`sync_not_configured`** → falta una de las dos env vars. Revisá `.env.local` y reiniciá el dev server.
- **`Sheet not found`** → el nombre de la hoja en el script (`Productos`, `Lookbook`) no coincide con el nombre real de la pestaña. Renombrá la pestaña o ajustá el script.
- **`ID column not found`** → la primera fila de la hoja debe tener una columna llamada exactamente `ID`.
- **El cambio se ve en `localStorage` pero no en Sheets** → abrí la consola del navegador y buscá warnings `[sync]`. El error suele ser HTTP 401/403 (token), 404 (URL mal copiada) o un redirect raro de Google (volver a deployar como nueva versión suele resolverlo).
