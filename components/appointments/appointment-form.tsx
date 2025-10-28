"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dbService } from "@/lib/db-service"

interface AppointmentFormProps {
  appointment?: any
  onClose: () => void
  onSave: (appointmentData: any) => void
}

export function AppointmentForm({ appointment, onClose, onSave }: AppointmentFormProps) {
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const [formData, setFormData] = useState({
    customer_id: appointment?.customer_id || "",
    appointment_date: appointment?.appointment_date || "",
    status: appointment?.status || "pending",
    description: appointment?.description || "",
    estimated_duration: appointment?.estimated_duration || 60,
    notes: appointment?.notes || "",
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const appointmentData = {
      ...formData,
      customer_id: Number(formData.customer_id),
      id: appointment?.id || Date.now(),
    }
    onSave(appointmentData)
  }

  const selectedCustomer = customers.find((c) => c.id === Number(formData.customer_id))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">{appointment ? "Editar Cita" : "Nueva Cita"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
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
                      {customer.name} - {customer.phone || customer.email}
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
                {selectedCustomer.phone && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Teléfono:</span> {selectedCustomer.phone}
                  </p>
                )}
                {selectedCustomer.email && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {selectedCustomer.email}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Detalles de la Cita</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date">Fecha y Hora</Label>
                <Input
                  id="appointment_date"
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
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
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción del Servicio</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Revisión general, cambio de aceite..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="estimated_duration">Duración Estimada (minutos)</Label>
              <Input
                id="estimated_duration"
                type="number"
                value={formData.estimated_duration || ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? 60 : Number.parseInt(e.target.value)
                  setFormData({ ...formData, estimated_duration: value })
                }}
                min="15"
                step="15"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas internas..."
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{appointment ? "Actualizar Cita" : "Crear Cita"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
