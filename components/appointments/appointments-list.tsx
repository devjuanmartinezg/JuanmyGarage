"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, Phone, Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: number
  customer_name: string
  customer_phone: string
  appointment_date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  description: string
  estimated_duration: number
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    customer_name: "Carlos García",
    customer_phone: "+34 612 345 678",
    appointment_date: "2025-10-28T10:00:00",
    status: "confirmed",
    description: "Revisión general y cambio de aceite",
    estimated_duration: 60,
  },
  {
    id: 2,
    customer_name: "María López",
    customer_phone: "+34 623 456 789",
    appointment_date: "2025-10-28T14:30:00",
    status: "pending",
    description: "Reparación de frenos",
    estimated_duration: 90,
  },
  {
    id: 3,
    customer_name: "Juan Martínez",
    customer_phone: "+34 634 567 890",
    appointment_date: "2025-10-29T09:00:00",
    status: "confirmed",
    description: "Cambio de neumáticos",
    estimated_duration: 45,
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400", icon: AlertCircle },
  confirmed: { label: "Confirmada", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  completed: { label: "Completada", color: "bg-blue-500/20 text-blue-400", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-red-500/20 text-red-400", icon: AlertCircle },
}

export function AppointmentsList({
  searchQuery,
  onEdit,
  appointments: externalAppointments,
  onDelete,
}: {
  searchQuery: string
  onEdit: (appointment: any) => void
  appointments?: Appointment[]
  onDelete?: (id: number) => void
}) {
  const [appointments, setAppointments] = useState(externalAppointments || mockAppointments)

  useEffect(() => {
    if (externalAppointments) {
      setAppointments(externalAppointments)
    }
  }, [externalAppointments])

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customer_phone.includes(searchQuery) ||
      apt.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id)
    } else {
      setAppointments(appointments.filter((apt) => apt.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-4">
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron citas</p>
        </div>
      ) : (
        filteredAppointments.map((appointment) => {
          const config = statusConfig[appointment.status]
          const StatusIcon = config.icon
          const appointmentDate = new Date(appointment.appointment_date)

          return (
            <div key={appointment.id} className="card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{appointment.customer_name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
                    >
                      <StatusIcon size={14} />
                      {config.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>
                        {appointmentDate.toLocaleDateString("es-ES")} a las{" "}
                        {appointmentDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={16} />
                      <span>{appointment.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={16} />
                      <span>{appointment.estimated_duration} minutos</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mt-3">{appointment.description}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => onEdit(appointment)} className="gap-2">
                    <Edit2 size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(appointment.id)}
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
