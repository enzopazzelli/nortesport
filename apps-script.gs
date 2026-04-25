// =====================================================================
// NORTE SPORT — Apps Script webhook para escritura desde el admin panel
// =====================================================================
//
// COPIÁ TODO ESTE ARCHIVO dentro del editor de Apps Script de tu hoja.
// Ver instrucciones detalladas en: APPS-SCRIPT-SETUP.md
//
// IMPORTANTE: Cambiá el valor de TOKEN por un string secreto único.
// Después, ponelo también en tu .env.local como APPS_SCRIPT_TOKEN.
// =====================================================================

const TOKEN = 'CAMBIAR_POR_UN_SECRETO_LARGO_Y_UNICO'
const PRODUCT_IMAGES_FOLDER_ID = '1Yd7SDFJWeNegn5iyx1wfKm9yK_du5eIj'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    if (data.token !== TOKEN) {
      return json({ ok: false, error: 'unauthorized' })
    }

    switch (data.action) {
      case 'update_product':
        return updateRowById('Productos', data.id, data.changes)
      case 'add_product':
        return appendRow('Productos', data.item)
      case 'update_lookbook':
        return updateRowById('Lookbook', data.id, data.changes)
      case 'add_lookbook':
        return appendRow('Lookbook', data.item)
      case 'delete_lookbook':
        return deleteRowById('Lookbook', data.id)
      case 'reorder_lookbook':
        return reorderRows('Lookbook', data.order)
      case 'upload_image':
        return uploadImage(data.image)
      default:
        return json({ ok: false, error: 'unknown action: ' + data.action })
    }
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

// Opcional: permite probar el endpoint desde el navegador
function doGet() {
  return json({ ok: true, message: 'Norte Sport sync endpoint is running' })
}

// -------- Helpers --------

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  if (!sheet) throw new Error('Sheet not found: ' + name)
  return sheet
}

function updateRowById(sheetName, id, changes) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  const headers = values[0]
  const idCol = headers.indexOf('ID')
  if (idCol === -1) return json({ ok: false, error: 'ID column not found' })

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(id)) {
      Object.entries(changes).forEach(([key, value]) => {
        const col = headers.indexOf(key)
        if (col !== -1) {
          sheet.getRange(i + 1, col + 1).setValue(value)
        }
      })
      return json({ ok: true })
    }
  }
  return json({ ok: false, error: 'row not found: ' + id })
}

function appendRow(sheetName, item) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  const headers = values[0]
  const idCol = headers.indexOf('ID')

  let newId = 1
  if (idCol !== -1 && values.length > 1) {
    const maxId = values.slice(1).reduce((max, row) => {
      const n = Number(row[idCol])
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)
    newId = maxId + 1
  }

  const row = headers.map((h) => {
    if (h === 'ID') return newId
    return item[h] !== undefined ? item[h] : ''
  })
  sheet.appendRow(row)
  return json({ ok: true, id: newId })
}

function deleteRowById(sheetName, id) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  const headers = values[0]
  const idCol = headers.indexOf('ID')
  if (idCol === -1) return json({ ok: false, error: 'ID column not found' })

  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1)
      return json({ ok: true })
    }
  }
  return json({ ok: false, error: 'row not found: ' + id })
}

function uploadImage(image) {
  if (!image || !image.base64) {
    return json({ ok: false, error: 'missing image data' })
  }

  try {
    const folder = DriveApp.getFolderById(PRODUCT_IMAGES_FOLDER_ID)
    const blob = Utilities.newBlob(
      Utilities.base64Decode(image.base64),
      image.mimeType || 'image/jpeg',
      image.name || 'imagen.jpg'
    )
    const file = folder.createFile(blob)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

    const fileId = file.getId()
    const url = 'https://drive.google.com/file/d/' + fileId + '/view'
    return json({ ok: true, url: url, fileId: fileId })
  } catch (err) {
    return json({ ok: false, error: 'upload failed: ' + String(err) })
  }
}

function reorderRows(sheetName, order) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  if (values.length <= 1) return json({ ok: true })

  const headers = values[0]
  const idCol = headers.indexOf('ID')
  if (idCol === -1) return json({ ok: false, error: 'ID column not found' })

  const dataRows = values.slice(1)
  const indexMap = {}
  order.forEach((id, i) => { indexMap[String(id)] = i })

  dataRows.sort((a, b) => {
    const ai = indexMap[String(a[idCol])] !== undefined ? indexMap[String(a[idCol])] : 9999
    const bi = indexMap[String(b[idCol])] !== undefined ? indexMap[String(b[idCol])] : 9999
    return ai - bi
  })

  sheet.getRange(2, 1, dataRows.length, headers.length).setValues(dataRows)
  return json({ ok: true })
}
