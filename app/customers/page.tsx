"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomersList } from "@/components/customers/customers-list"
import { CustomerForm } from "@/components/customers/customer-form"
import { dbService } from "@/lib/db-service"
import { useToast } from "@/hooks/use-toast"
import { mockCustomers } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading customers from database...")
      const data = await dbService.getCustomers()
      console.log("[v0] Customers loaded:", data.length)
      setCustomers(data)
    } catch (error) {
      console.error("[v0] Error loading customers:", error)
      console.log("[v0] Using mock data as fallback")
      setCustomers(mockCustomers)
      toast({
        title: "Usando datos de ejemplo",
        description: "No se pudo conectar a la base de datos. Mostrando datos de ejemplo.",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedCustomer(null)
  }

  const handleSaveCustomer = async (customerData: any) => {
    try {
      console.log("[v0] Saving customer:", customerData)
      if (selectedCustomer) {
        // Update existing customer
        await dbService.updateCustomer(customerData.id, customerData)
        toast({
          title: "Cliente actualizado",
          description: "El cliente se ha actualizado correctamente",
        })
      } else {
        // Create new customer
        const newCustomer = await dbService.createCustomer(customerData)
        console.log("[v0] Customer created:", newCustomer)
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente se ha creado correctamente",
        })
      }
      await loadCustomers()
      handleCloseForm()
    } catch (error) {
      console.error("[v0] Error saving customer:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    )
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
              <h2 className="text-2xl font-bold text-foreground">Gestión de Clientes</h2>
              <p className="text-sm text-muted-foreground mt-1">Administra la base de datos de clientes</p>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} />
            Nuevo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por nombre, email, teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showForm ? (
          <CustomerForm customer={selectedCustomer} onClose={handleCloseForm} onSave={handleSaveCustomer} />
        ) : (
          <CustomersList searchQuery={searchQuery} onEdit={handleEditCustomer} customers={customers} />
        )}
      </div>
    </div>
  )
}
