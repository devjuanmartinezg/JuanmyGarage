"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RepairOrdersList } from "@/components/repair-orders/repair-orders-list"
import { RepairOrderForm } from "@/components/repair-orders/repair-order-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dbService } from "@/lib/db-service"
import { useToast } from "@/hooks/use-toast"
import { mockRepairOrders } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function RepairOrdersPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await dbService.getRepairOrders()
      setOrders(data)
    } catch (error) {
      console.error("[v0] Error loading repair orders:", error)
      setOrders(mockRepairOrders)
      toast({
        title: "Usando datos de ejemplo",
        description: "No se pudo conectar a la base de datos. Mostrando datos de ejemplo.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedOrder(null)
    setShowForm(true)
  }

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedOrder(null)
  }

  const handleSaveOrder = async (orderData: any) => {
    try {
      if (selectedOrder) {
        // Update existing order
        await dbService.updateRepairOrder(orderData.id, orderData)
        toast({
          title: "Orden actualizada",
          description: "La orden se ha actualizado correctamente",
        })
      } else {
        // Create new order
        await dbService.createRepairOrder(orderData)
        toast({
          title: "Orden creada",
          description: "La nueva orden se ha creado correctamente",
        })
      }
      await loadOrders()
      handleCloseForm()
    } catch (error) {
      console.error("[v0] Error saving repair order:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la orden",
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
              <h2 className="text-2xl font-bold text-foreground">Órdenes de Reparación</h2>
              <p className="text-sm text-muted-foreground mt-1">Administra todas las órdenes de reparación</p>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} />
            Nueva Orden
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por cliente, vehículo, orden..."
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
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showForm ? (
          <RepairOrderForm order={selectedOrder} onClose={handleCloseForm} onSave={handleSaveOrder} />
        ) : (
          <RepairOrdersList
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onEdit={handleEditOrder}
            orders={orders}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
