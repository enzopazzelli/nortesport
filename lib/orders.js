// =============================================
// Orders management — localStorage based
// =============================================

const ORDERS_KEY = 'norte-sport-pedidos'

export function generateOrderId() {
  const now = new Date()
  const date = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `NS-${date}-${rand}`
}

export function getOrders() {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return order
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders()
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx === -1) return null
  orders[idx].estado = status
  orders[idx].updatedAt = new Date().toISOString()
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders[idx]
}

export function deleteOrder(orderId) {
  const orders = getOrders().filter((o) => o.id !== orderId)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getMetrics(orders) {
  const total = orders.length
  const confirmados = orders.filter((o) => o.estado === 'confirmado')
  const cancelados = orders.filter((o) => o.estado === 'cancelado')
  const pendientes = orders.filter((o) => o.estado === 'pendiente')

  const ingresos = confirmados.reduce((sum, o) => sum + o.total, 0)
  const conversionRate = total > 0 ? (confirmados.length / total) * 100 : 0

  // Top products
  const productCount = {}
  confirmados.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.nombre
      if (!productCount[key]) productCount[key] = { nombre: key, cantidad: 0, ingresos: 0 }
      productCount[key].cantidad += item.cantidad
      productCount[key].ingresos += item.precio * item.cantidad
    })
  })
  const topProducts = Object.values(productCount)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  // Orders by day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentOrders = orders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo)

  return {
    total,
    confirmados: confirmados.length,
    cancelados: cancelados.length,
    pendientes: pendientes.length,
    ingresos,
    conversionRate,
    topProducts,
    recentOrders: recentOrders.length,
  }
}

export function getStockUsed(orders) {
  // Calculate stock used by confirmed orders
  const stockUsed = {}
  orders
    .filter((o) => o.estado === 'confirmado')
    .forEach((order) => {
      order.items.forEach((item) => {
        const key = `${item.id}-${item.talle}`
        if (!stockUsed[key]) stockUsed[key] = { id: item.id, nombre: item.nombre, talle: item.talle, cantidad: 0 }
        stockUsed[key].cantidad += item.cantidad
      })
    })
  return stockUsed
}
