"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomerDetail } from "./customer-detail"

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

export function CustomersList({
  searchQuery,
  onEdit,
  customers: initialCustomers,
}: {
  searchQuery: string
  onEdit: (customer: any) => void
  customers: Customer[]
}) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  if (selectedCustomer) {
    return <CustomerDetail customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} onEdit={onEdit} />
  }

  return (
    <div className="p-6 space-y-4">
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron clientes</p>
        </div>
      ) : (
        filteredCustomers.map((customer) => (
          <div key={customer.id} className="card hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Cliente desde {customer.created_at}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={16} />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={16} />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>
                      {customer.city}, {customer.postal_code}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Gasto total</p>
                    <p className="font-semibold text-green-400">{(customer.total_spent ?? 0).toFixed(2)}€</p>
                  </div>
                </div>

                {customer.notes && <p className="text-sm text-muted-foreground mt-3 italic">Nota: {customer.notes}</p>}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)} className="gap-2">
                  <Eye size={16} />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(customer)} className="gap-2">
                  <Edit2 size={16} />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(customer.id)}
                  className="gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
