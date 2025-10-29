"use client"

import { useState, useEffect } from "react"
import { Wrench, Calendar, DollarSign, Edit2, Trash2, Eye, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RepairOrderDetail } from "./repair-order-detail"
import { Spinner } from "@/components/ui/spinner"

interface RepairOrder {
  id: number
  order_number: string
  customer_name: string
  vehicle_info: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  estimated_cost: number
  actual_cost: number | null
  start_date: string | null
  completion_date: string | null
  notes: string
  items: Array<{
    id: number
    description: string
    quantity: number
    unit_price: number
  }>
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400", bgColor: "bg-yellow-500/10" },
  in_progress: { label: "En Progreso", color: "bg-blue-500/20 text-blue-400", bgColor: "bg-blue-500/10" },
  completed: { label: "Completada", color: "bg-green-500/20 text-green-400", bgColor: "bg-green-500/10" },
  cancelled: { label: "Cancelada", color: "bg-red-500/20 text-red-400", bgColor: "bg-red-500/10" },
}

export function RepairOrdersList({
  searchQuery,
  statusFilter,
  onEdit,
  orders: initialOrders,
  loading = false,
}: {
  searchQuery: string
  statusFilter: string
  onEdit: (order: any) => void
  orders: RepairOrder[]
  loading?: boolean
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null)

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  let filteredOrders = orders.filter(
    (order) =>
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle_info.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === statusFilter)
  }

  const handleDelete = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

  if (selectedOrder) {
    return <RepairOrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} onEdit={onEdit} />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron órdenes de reparación</p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const config = statusConfig[order.status]
          const totalCost = order.items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) ?? 0

          return (
            <div key={order.id} className={`card hover:border-primary/50 transition-colors ${config.bgColor}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Wrench size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {order.order_number}
                      </h3>
                      <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>

                  <p className="text-sm text-foreground mt-2">{order.vehicle_info}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-400" />
                      <div>
                        <p className="text-muted-foreground">Costo Estimado</p>
                        <p className="font-semibold">{order.estimated_cost.toFixed(2)}€</p>
                      </div>
                    </div>
                    {order.actual_cost && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={16} className="text-blue-400" />
                        <div>
                          <p className="text-muted-foreground">Costo Real</p>
                          <p className="font-semibold">{order.actual_cost.toFixed(2)}€</p>
                        </div>
                      </div>
                    )}
                    {order.start_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Iniciada</p>
                          <p className="font-semibold">{order.start_date}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="flex items-start gap-2 mt-3 p-2 bg-slate-700/30 rounded text-sm">
                      <AlertCircle size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)} className="gap-2">
                    <Eye size={16} />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(order)} className="gap-2">
                    <Edit2 size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                    className="gap-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
