"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RepairOrderFormProps {
  order?: any
  onClose: () => void
  onSave: (order: any) => void
}

export function RepairOrderForm({ order, onClose, onSave }: RepairOrderFormProps) {
  const [formData, setFormData] = useState({
    order_number: order?.order_number || "",
    customer_name: order?.customer_name || "",
    vehicle_info: order?.vehicle_info || "",
    description: order?.description || "",
    status: order?.status || "pending",
    estimated_cost: order?.estimated_cost || 0,
    actual_cost: order?.actual_cost || 0,
    start_date: order?.start_date || "",
    completion_date: order?.completion_date || "",
    notes: order?.notes || "",
  })

  const [items, setItems] = useState(order?.items || [])
  const [newItem, setNewItem] = useState({ description: "", quantity: 1, unit_price: 0 })

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.unit_price > 0) {
      setItems([...items, { ...newItem, id: Date.now() }])
      setNewItem({ description: "", quantity: 1, unit_price: 0 })
    }
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item: any) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      id: order?.id || Date.now(),
      items: items,
    }
    onSave(orderData)
  }

  const totalCost = items.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">{order ? "Editar Orden" : "Nueva Orden de Reparación"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información de la Orden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_number">Número de Orden</Label>
                <Input
                  id="order_number"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  placeholder="RO-2025-001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Cliente y Vehículo</h3>
            <div>
              <Label htmlFor="customer_name">Nombre del Cliente</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Ej: Juan García"
                required
              />
            </div>
            <div>
              <Label htmlFor="vehicle_info">Información del Vehículo</Label>
              <Input
                id="vehicle_info"
                value={formData.vehicle_info}
                onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                placeholder="Ej: Toyota Corolla 2020 - Placa ABC-123"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción del Trabajo</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del trabajo a realizar..."
                rows={2}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Artículos y Servicios</h3>
            <div className="space-y-2 mb-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x €{item.unit_price.toFixed(2)} = €{(item.quantity * item.unit_price).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="gap-2 text-red-400"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Item */}
            <div className="p-4 bg-slate-700/20 rounded-lg space-y-3">
              <p className="text-sm font-medium">Agregar Artículo</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Descripción"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                  min="1"
                />
                <Input
                  type="number"
                  placeholder="Precio Unitario"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem({ ...newItem, unit_price: Number.parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button type="button" onClick={handleAddItem} className="w-full gap-2">
                <Plus size={16} />
                Agregar Artículo
              </Button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <p className="font-semibold">Total de Artículos</p>
              <p className="text-lg font-bold text-green-400">€{totalCost.toFixed(2)}</p>
            </div>
          </div>

          {/* Costs & Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Costos y Fechas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_cost">Costo Estimado</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: Number.parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="actual_cost">Costo Real</Label>
                <Input
                  id="actual_cost"
                  type="number"
                  value={formData.actual_cost}
                  onChange={(e) => setFormData({ ...formData, actual_cost: Number.parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="completion_date">Fecha de Finalización</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Notas Adicionales</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas internas sobre la orden..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{order ? "Actualizar Orden" : "Crear Orden"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
