"use client"

import { useState, useEffect } from "react"
import { Package, AlertCircle, Edit2, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  quantity: number
  min_quantity: number
  unit_price: number
  supplier: string
  last_restocked: string
  description: string
}

export function InventoryList({
  searchQuery,
  filter,
  onEdit,
  inventory: initialInventory,
}: {
  searchQuery: string
  filter: "all" | "low-stock" | "categories"
  onEdit: (item: any) => void
  inventory: InventoryItem[]
}) {
  const [inventory, setInventory] = useState(initialInventory)

  useEffect(() => {
    setInventory(initialInventory)
  }, [initialInventory])

  let filteredItems = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (filter === "low-stock") {
    filteredItems = filteredItems.filter((item) => item.quantity <= item.min_quantity)
  }

  const handleDelete = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: number, change: number) => {
    setInventory(
      inventory.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)),
    )
  }

  if (filter === "categories") {
    const categories = [...new Set(filteredItems.map((item) => item.category))]

    return (
      <div className="p-6 space-y-6">
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((item) => item.category === category)
          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{category}</h3>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron artículos</p>
        </div>
      ) : (
        filteredItems.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={handleDelete}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))
      )}
    </div>
  )
}

function InventoryItemCard({
  item,
  onEdit,
  onDelete,
  onUpdateQuantity,
}: {
  item: InventoryItem
  onEdit: (item: any) => void
  onDelete: (id: number) => void
  onUpdateQuantity: (id: number, change: number) => void
}) {
  const isLowStock = item.quantity <= item.min_quantity
  const stockPercentage = (item.quantity / item.min_quantity) * 100

  return (
    <div className={`card hover:border-primary/50 transition-colors ${isLowStock ? "border-yellow-500/30" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">{item.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Categoría</p>
              <p className="font-medium text-sm">{item.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio Unitario</p>
              <p className="font-medium text-sm">€{item.unit_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Proveedor</p>
              <p className="font-medium text-sm">{item.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Último Restock</p>
              <p className="font-medium text-sm">{item.last_restocked}</p>
            </div>
          </div>

          {/* Stock Level */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Stock</p>
              <p className={`text-sm font-semibold ${isLowStock ? "text-yellow-400" : "text-green-400"}`}>
                {item.quantity} / {item.min_quantity}
              </p>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${isLowStock ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              ></div>
            </div>
            {isLowStock && (
              <div className="flex items-center gap-2 mt-2 text-yellow-400 text-xs">
                <AlertCircle size={14} />
                <span>Stock por debajo del nivel mínimo</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, -1)} className="gap-1">
              <Minus size={14} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, 1)} className="gap-1">
              <Plus size={14} />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="gap-2">
            <Edit2 size={16} />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="gap-2 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
