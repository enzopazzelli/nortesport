'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react'
import { getOrders, updateOrderStatus, deleteOrder, getMetrics } from '@/lib/orders'

const formatPrice = (price) =>
  '$' + price.toLocaleString('es-AR', { minimumFractionDigits: 0 })

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  confirmado: {
    label: 'Confirmado',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
}

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-sm text-secondary">{label}</span>
      </div>
      <p className="text-2xl font-bold text-dark">{value}</p>
      {sub && <p className="text-xs text-secondary mt-1">{sub}</p>}
    </div>
  )
}

function OrderRow({ order, onConfirm, onCancel, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[order.estado]
  const StatusIcon = status.icon

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-secondary bg-gray-100 px-2 py-0.5 rounded">
              {order.id}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-dark">{order.cliente}</span>
            <span className="text-secondary">·</span>
            <span className="text-secondary">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
            <span className="text-secondary">·</span>
            <span className="font-semibold text-dark">{formatPrice(order.total)}</span>
          </div>
        </div>
        <span className="text-xs text-secondary hidden sm:block">{formatDate(order.createdAt)}</span>
        {expanded ? <ChevronUp size={16} className="text-secondary" /> : <ChevronDown size={16} className="text-secondary" />}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4">
          {/* Items list */}
          <div className="py-3 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-dark">
                  {item.cantidad}x {item.nombre}
                  {item.talle ? <span className="text-secondary"> — Talle {item.talle}</span> : ''}
                </span>
                <span className="text-secondary font-medium">{formatPrice(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>

          {order.notas && (
            <p className="text-xs text-secondary bg-gray-50 rounded-lg p-2 mb-3">
              <strong>Notas:</strong> {order.notas}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {order.estado === 'pendiente' && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onConfirm(order.id) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
                >
                  <CheckCircle size={14} />
                  Confirmar venta
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onCancel(order.id) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                >
                  <XCircle size={14} />
                  Cancelar
                </button>
              </>
            )}
            {order.estado === 'cancelado' && (
              <button
                onClick={(e) => { e.stopPropagation(); onConfirm(order.id) }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
              >
                <CheckCircle size={14} />
                Confirmar venta
              </button>
            )}
            {order.estado === 'confirmado' && (
              <button
                onClick={(e) => { e.stopPropagation(); onCancel(order.id) }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <XCircle size={14} />
                Revertir
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(order.id) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-secondary hover:bg-gray-100 border border-border transition-colors ml-auto"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PedidosManager() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const metrics = useMemo(() => getMetrics(orders), [orders])

  const filteredOrders = useMemo(() => {
    let result = orders
    if (filter !== 'todos') {
      result = result.filter((o) => o.estado === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.cliente.toLowerCase().includes(q) ||
          o.items.some((item) => item.nombre.toLowerCase().includes(q))
      )
    }
    return result
  }, [orders, filter, search])

  const handleConfirm = (id) => {
    updateOrderStatus(id, 'confirmado')
    setOrders(getOrders())
  }

  const handleCancel = (id) => {
    updateOrderStatus(id, 'cancelado')
    setOrders(getOrders())
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    deleteOrder(id)
    setOrders(getOrders())
  }

  const FILTERS = [
    { id: 'todos', label: 'Todos', count: orders.length },
    { id: 'pendiente', label: 'Pendientes', count: metrics.pendientes },
    { id: 'confirmado', label: 'Confirmados', count: metrics.confirmados },
    { id: 'cancelado', label: 'Cancelados', count: metrics.cancelados },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={ShoppingBag}
          label="Total pedidos"
          value={metrics.total}
          sub={`${metrics.recentOrders} en últimos 30 días`}
          color="bg-accent"
        />
        <MetricCard
          icon={DollarSign}
          label="Ingresos confirmados"
          value={formatPrice(metrics.ingresos)}
          color="bg-green-500"
        />
        <MetricCard
          icon={TrendingUp}
          label="Tasa de conversión"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          sub={`${metrics.confirmados} de ${metrics.total} pedidos`}
          color="bg-purple-500"
        />
        <MetricCard
          icon={Clock}
          label="Pendientes"
          value={metrics.pendientes}
          sub="Requieren acción"
          color="bg-yellow-500"
        />
      </div>

      {/* Top products */}
      {metrics.topProducts.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-accent" />
            <h3 className="font-semibold text-dark text-sm">Productos más vendidos</h3>
          </div>
          <div className="space-y-2">
            {metrics.topProducts.map((p, i) => (
              <div key={p.nombre} className="flex items-center gap-3">
                <span className="text-xs font-bold text-secondary w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-dark truncate">{p.nombre}</span>
                    <span className="text-xs text-secondary whitespace-nowrap">{p.cantidad} vendidos · {formatPrice(p.ingresos)}</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(p.cantidad / metrics.topProducts[0].cantidad) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-border rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.id
                  ? 'bg-accent text-white'
                  : 'text-secondary hover:text-dark hover:bg-gray-50'
              }`}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === f.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
          />
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-12 text-center">
            <Package size={40} className="mx-auto text-secondary/30 mb-3" />
            <p className="text-secondary text-sm">
              {orders.length === 0
                ? 'Todavía no hay pedidos. Cuando un cliente envíe un pedido por WhatsApp desde la tienda, aparecerá acá.'
                : 'No se encontraron pedidos con ese filtro.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
