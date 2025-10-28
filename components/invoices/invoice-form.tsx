"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dbService } from "@/lib/db-service"

interface InvoiceFormProps {
  invoice?: any
  onClose: () => void
  onSave: (invoice: any) => void
}

const TAX_RATE = 0.21 // 21% tax

export function InvoiceForm({ invoice, onClose, onSave }: InvoiceFormProps) {
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const [formData, setFormData] = useState({
    invoice_number: invoice?.invoice_number || "",
    customer_id: invoice?.customer_id || "",
    issue_date: invoice?.issue_date || "",
    due_date: invoice?.due_date || "",
    status: invoice?.status || "pending",
    notes: invoice?.notes || "",
  })

  const [items, setItems] = useState(invoice?.items || [])
  const [newItem, setNewItem] = useState({ description: "", quantity: "", unit_price: "" })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const data = await dbService.getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error("[v0] Error loading customers:", error)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const handleAddItem = () => {
    const quantity = Number.parseFloat(newItem.quantity)
    const unit_price = Number.parseFloat(newItem.unit_price)

    if (newItem.description && !Number.isNaN(quantity) && quantity > 0 && !Number.isNaN(unit_price) && unit_price > 0) {
      setItems([
        ...items,
        {
          description: newItem.description,
          quantity: quantity,
          unit_price: unit_price,
          id: Date.now(),
        },
      ])
      setNewItem({ description: "", quantity: "", unit_price: "" })
    }
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item: any) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0)
    const tax = subtotal * TAX_RATE
    const total = subtotal + tax

    const invoiceData = {
      ...formData,
      customer_id: Number(formData.customer_id),
      id: invoice?.id || Date.now(),
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
    }
    console.log("[v0] Saving invoice:", invoiceData)
    onSave(invoiceData)
  }

  const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const selectedCustomer = customers.find((c) => c.id === Number(formData.customer_id))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">{invoice ? "Editar Factura" : "Nueva Factura"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información de la Factura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice_number">Número de Factura</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  placeholder="INV-2025-001"
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
                    <SelectItem value="paid">Pagada</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información del Cliente</h3>
            <div>
              <Label htmlFor="customer_id">Seleccionar Cliente</Label>
              <Select
                value={formData.customer_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
              >
                <SelectTrigger id="customer_id">
                  <SelectValue placeholder={loadingCustomers ? "Cargando clientes..." : "Selecciona un cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} - {customer.email || customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCustomer && (
              <div className="p-3 bg-slate-700/20 rounded-lg space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nombre:</span> {selectedCustomer.name}
                </p>
                {selectedCustomer.email && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {selectedCustomer.email}
                  </p>
                )}
                {selectedCustomer.phone && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Teléfono:</span> {selectedCustomer.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Fechas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Fecha de Emisión</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>
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
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  min="1"
                />
                <Input
                  type="number"
                  placeholder="Precio Unitario"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button type="button" onClick={handleAddItem} className="w-full gap-2">
                <Plus size={16} />
                Agregar Artículo
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-2 p-4 bg-slate-700/20 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-semibold">€{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Impuesto (21%)</p>
                <p className="font-semibold">€{tax.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="font-semibold">Total</p>
                <p className="text-lg font-bold text-green-400">€{total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Notas Adicionales</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas o términos de pago..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{invoice ? "Actualizar Factura" : "Crear Factura"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
