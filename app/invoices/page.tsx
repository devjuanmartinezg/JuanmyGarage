"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InvoicesList } from "@/components/invoices/invoices-list"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dbService } from "@/lib/db-service"
import { useToast } from "@/hooks/use-toast"
import { mockInvoices } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function InvoicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const data = await dbService.getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error("[v0] Error loading invoices:", error)
      setInvoices(mockInvoices)
      toast({
        title: "Usando datos de ejemplo",
        description: "No se pudo conectar a la base de datos. Mostrando datos de ejemplo.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedInvoice(null)
    setShowForm(true)
  }

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedInvoice(null)
  }

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      if (selectedInvoice) {
        // Update existing invoice
        await dbService.updateInvoice(invoiceData.id, invoiceData)
        toast({
          title: "Factura actualizada",
          description: "La factura se ha actualizado correctamente",
        })
      } else {
        // Create new invoice
        await dbService.createInvoice(invoiceData)
        toast({
          title: "Factura creada",
          description: "La nueva factura se ha creado correctamente",
        })
      }
      await loadInvoices()
      handleCloseForm()
    } catch (error) {
      console.error("[v0] Error saving invoice:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la factura",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Facturas</h2>
              <p className="text-sm text-muted-foreground mt-1">Administra todas las facturas del taller</p>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} />
            Nueva Factura
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por cliente, número de factura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="paid">Pagada</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showForm ? (
          <InvoiceForm invoice={selectedInvoice} onClose={handleCloseForm} onSave={handleSaveInvoice} />
        ) : (
          <InvoicesList
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onEdit={handleEditInvoice}
            invoices={invoices}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
