"use client"

import { ArrowLeft, DollarSign, Calendar, Mail, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  issue_date: string
  due_date: string
  subtotal: number
  tax: number
  total: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  notes: string
  items: Array<{
    id: number
    description: string
    quantity: number
    unit_price: number
  }>
}

export function InvoiceDetail({
  invoice,
  onBack,
  onEdit,
}: {
  invoice: Invoice
  onBack: () => void
  onEdit: (invoice: Invoice) => void
}) {
  const statusConfig = {
    pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400" },
    paid: { label: "Pagada", color: "bg-green-500/20 text-green-400" },
    overdue: { label: "Vencida", color: "bg-red-500/20 text-red-400" },
    cancelled: { label: "Cancelada", color: "bg-slate-500/20 text-slate-400" },
  }

  const config = statusConfig[invoice.status]

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
            <h2 className="text-2xl font-bold text-foreground">{invoice.invoice_number}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{invoice.customer_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download size={16} />
            Descargar PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Printer size={16} />
            Imprimir
          </Button>
          <Button onClick={() => onEdit(invoice)} className="gap-2">
            Editar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{invoice.customer_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{invoice.customer_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Artículos y Servicios</h3>
            <div className="space-y-2">
              {invoice.items.map((item) => (
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

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-semibold">€{invoice.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Impuesto (21%)</p>
                <p className="font-semibold">€{invoice.tax.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="font-semibold">Total</p>
                <p className="text-lg font-bold text-green-400">€{invoice.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="card">
              <h4 className="font-semibold mb-2">Notas</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                <p className="font-semibold">{invoice.issue_date}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Vencimiento</p>
                <p className="font-semibold">{invoice.due_date}</p>
              </div>
            </div>
          </div>

          <div className="card bg-green-500/5 border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Total a Pagar</p>
                <p className="font-semibold text-lg text-green-400">€{invoice.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {invoice.status === "pending" && (
            <Button className="w-full gap-2">
              <DollarSign size={16} />
              Marcar como Pagada
            </Button>
          )}

          {invoice.status === "paid" && (
            <div className="card bg-green-500/10 border-green-500/20">
              <p className="text-sm text-green-400 font-medium">✓ Factura Pagada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
