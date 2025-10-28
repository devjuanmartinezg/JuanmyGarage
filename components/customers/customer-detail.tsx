"use client"

import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  notes: string
  created_at: string
  appointments_count: number
  total_spent: number
}

export function CustomerDetail({
  customer,
  onBack,
  onEdit,
}: {
  customer: Customer
  onBack: () => void
  onEdit: (customer: Customer) => void
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft size={16} />
          Volver
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">Cliente ID: #{customer.id}</p>
        </div>
        <Button onClick={() => onEdit(customer)} className="gap-2">
          Editar Cliente
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">
                  {customer.address}, {customer.city} {customer.postal_code}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold mb-2">Notas</h4>
              <p className="text-sm text-muted-foreground">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Cliente desde</p>
                <p className="font-semibold">{customer.created_at}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Citas</p>
                <p className="font-semibold text-lg">{customer.appointments_count}</p>
              </div>
            </div>
          </div>

          <div className="card bg-green-500/5 border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Gasto total</p>
                <p className="font-semibold text-lg text-green-400">€{customer.total_spent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-border">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-sm">Cita completada</p>
              <p className="text-xs text-muted-foreground">Hace 2 días - Revisión general</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b border-border">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-sm">Factura pagada</p>
              <p className="text-xs text-muted-foreground">Hace 5 días - €450.00</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-sm">Nueva cita programada</p>
              <p className="text-xs text-muted-foreground">Hace 1 semana - 2025-11-05</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
