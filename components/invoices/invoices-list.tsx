"use client"

import { useState, useEffect } from "react"
import { FileText, DollarSign, Calendar, Edit2, Trash2, Eye, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvoiceDetail } from "./invoice-detail"

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

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400", bgColor: "bg-yellow-500/10" },
  paid: { label: "Pagada", color: "bg-green-500/20 text-green-400", bgColor: "bg-green-500/10" },
  overdue: { label: "Vencida", color: "bg-red-500/20 text-red-400", bgColor: "bg-red-500/10" },
  cancelled: { label: "Cancelada", color: "bg-slate-500/20 text-slate-400", bgColor: "bg-slate-500/10" },
}

export function InvoicesList({
  searchQuery,
  statusFilter,
  onEdit,
  invoices: initialInvoices,
}: {
  searchQuery: string
  statusFilter: string
  onEdit: (invoice: any) => void
  invoices: Invoice[]
}) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    setInvoices(initialInvoices)
  }, [initialInvoices])

  let filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer_email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (statusFilter !== "all") {
    filteredInvoices = filteredInvoices.filter((invoice) => invoice.status === statusFilter)
  }

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter((i) => i.id !== id))
  }

  if (selectedInvoice) {
    return <InvoiceDetail invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} onEdit={onEdit} />
  }

  return (
    <div className="p-6 space-y-4">
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron facturas</p>
        </div>
      ) : (
        filteredInvoices.map((invoice) => {
          const config = statusConfig[invoice.status]

          return (
            <div key={invoice.id} className={`card hover:border-primary/50 transition-colors ${config.bgColor}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedInvoice(invoice)}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {invoice.invoice_number}
                      </h3>
                      <p className="text-xs text-muted-foreground">{invoice.customer_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">{invoice.customer_email}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Emitida</p>
                        <p className="font-semibold">{invoice.issue_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Vencimiento</p>
                        <p className="font-semibold">{invoice.due_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-400" />
                      <div>
                        <p className="text-muted-foreground">Subtotal</p>
                        <p className="font-semibold">€{invoice.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-blue-400" />
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold text-lg">€{invoice.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {invoice.status === "overdue" && (
                    <div className="flex items-start gap-2 mt-3 p-2 bg-red-500/10 rounded text-sm">
                      <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-400">{invoice.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)} className="gap-2">
                    <Eye size={16} />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download size={16} />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(invoice)} className="gap-2">
                    <Edit2 size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(invoice.id)}
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
