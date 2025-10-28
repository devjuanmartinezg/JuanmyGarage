"use client"

import { useState, useEffect } from "react"
import { Plus, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventoryList } from "@/components/inventory/inventory-list"
import { InventoryForm } from "@/components/inventory/inventory-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dbService } from "@/lib/db-service"
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = await dbService.getInventory()
      setInventory(data)
    } catch (error) {
      console.error("[v0] Error loading inventory:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedItem(null)
    setShowForm(true)
  }

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedItem(null)
  }

  const handleSaveItem = async (itemData: any) => {
    try {
      if (selectedItem) {
        // Update existing item
        await dbService.updateInventoryItem(itemData.id, itemData)
        toast({
          title: "Artículo actualizado",
          description: "El artículo se ha actualizado correctamente",
        })
      } else {
        // Create new item
        await dbService.createInventoryItem(itemData)
        toast({
          title: "Artículo creado",
          description: "El nuevo artículo se ha creado correctamente",
        })
      }
      await loadInventory()
      handleCloseForm()
    } catch (error) {
      console.error("[v0] Error saving inventory item:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el artículo",
        variant: "destructive",
      })
    }
  }

  const lowStockCount = inventory.filter((item) => item.quantity < item.min_quantity).length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Inventario</h2>
            <p className="text-sm text-muted-foreground mt-1">Administra el stock de partes y suministros</p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} />
            Nuevo Artículo
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por nombre, SKU, categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showForm ? (
          <InventoryForm item={selectedItem} onClose={handleCloseForm} onSave={handleSaveItem} />
        ) : (
          <div className="p-6 space-y-6">
            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-400">Stock Bajo</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lowStockCount} artículos tienen stock por debajo del nivel mínimo. Considera hacer un pedido.
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-700/30">
                <TabsTrigger value="all">Todos los Artículos</TabsTrigger>
                <TabsTrigger value="low-stock">Stock Bajo</TabsTrigger>
                <TabsTrigger value="categories">Por Categoría</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <InventoryList searchQuery={searchQuery} filter="all" onEdit={handleEditItem} inventory={inventory} />
              </TabsContent>

              <TabsContent value="low-stock" className="mt-6">
                <InventoryList
                  searchQuery={searchQuery}
                  filter="low-stock"
                  onEdit={handleEditItem}
                  inventory={inventory}
                />
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <InventoryList
                  searchQuery={searchQuery}
                  filter="categories"
                  onEdit={handleEditItem}
                  inventory={inventory}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
