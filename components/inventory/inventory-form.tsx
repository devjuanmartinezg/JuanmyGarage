"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryFormProps {
  item?: any
  onClose: () => void
  onSave: (item: any) => void
}

const categories = [
  "Fluidos",
  "Filtros",
  "Frenos",
  "Eléctrico",
  "Correas",
  "Encendido",
  "Suspensión",
  "Transmisión",
  "Motor",
  "Otros",
]

export function InventoryForm({ item, onClose, onSave }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    sku: item?.sku || "",
    category: item?.category || "",
    quantity: item?.quantity || 0,
    min_quantity: item?.min_quantity || 5,
    unit_price: item?.unit_price || 0,
    supplier: item?.supplier || "",
    description: item?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const itemData = {
      ...formData,
      id: item?.id || Date.now(),
      last_restocked: item?.last_restocked || new Date().toISOString().split("T")[0],
    }
    console.log("[v0] Saving inventory item:", itemData)
    onSave(itemData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">{item ? "Editar Artículo" : "Nuevo Artículo"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información Básica</h3>
            <div>
              <Label htmlFor="name">Nombre del Artículo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Aceite de Motor 5W-30"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="OIL-5W30-5L"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del artículo..."
                rows={2}
              />
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información de Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Cantidad Actual</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value ? Number.parseInt(e.target.value) : 0 })
                  }
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="min_quantity">Cantidad Mínima</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, min_quantity: e.target.value ? Number.parseInt(e.target.value) : 5 })
                  }
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit_price">Precio Unitario</Label>
                <Input
                  id="unit_price"
                  type="number"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_price: e.target.value ? Number.parseFloat(e.target.value) : 0 })
                  }
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Información del Proveedor</h3>
            <div>
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{item ? "Actualizar Artículo" : "Crear Artículo"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
