"use client"

import { ArrowLeft, DollarSign, Calendar, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function RepairOrderDetail({
  order,
  onBack,
  onEdit,
}: {
  order: RepairOrder
  onBack: () => void
  onEdit: (order: RepairOrder) => void
}) {
  const totalCost = order.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const statusConfig = {
    pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400" },
    in_progress: { label: "En Progreso", color: "bg-blue-500/20 text-blue-400" },
    completed: { label: "Completada", color: "bg-green-500/20 text-green-400" },
    cancelled: { label: "Cancelada", color: "bg-red-500/20 text-red-400" },
  }

  const config = statusConfig[order.status]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft size={16} />
          Volver
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{order.order_number}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{order.customer_name}</p>
        </div>
        <Button onClick={() => onEdit(order)} className="gap-2">
          Editar Orden
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle & Description */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Información del Vehículo</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Vehículo</p>
                <p className="font-medium">{order.vehicle_info}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripción del Trabajo</p>
                <p className="font-medium">{order.description}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Artículos y Servicios</h3>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x €{item.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">€{(item.quantity * item.unit_price).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="text-lg font-bold text-green-400">€{totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="card border-l-4 border-l-blue-500 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold">Notas</h4>
                  <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Costo Estimado</p>
                <p className="font-semibold text-lg">€{order.estimated_cost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {order.actual_cost && (
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Costo Real</p>
                  <p className="font-semibold text-lg">€{order.actual_cost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {order.start_date && (
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-primary" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                  <p className="font-semibold">{order.start_date}</p>
                </div>
              </div>
            </div>
          )}

          {order.completion_date && (
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-green-400" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Finalización</p>
                  <p className="font-semibold">{order.completion_date}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
