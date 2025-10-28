"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { dbService } from "@/lib/db-service"
import { useToast } from "@/hooks/use-toast"
import { mockAppointments } from "@/lib/mock-data"

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await dbService.getAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
      console.log("[v0] Using mock data as fallback")
      setAppointments(mockAppointments)
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
    setSelectedAppointment(null)
    setShowForm(true)
  }

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedAppointment(null)
  }

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      if (selectedAppointment) {
        // Update existing appointment
        await dbService.updateAppointment(appointmentData.id, appointmentData)
        toast({
          title: "Cita actualizada",
          description: "La cita se ha actualizado correctamente",
        })
      } else {
        // Create new appointment
        await dbService.createAppointment(appointmentData)
        toast({
          title: "Cita creada",
          description: "La nueva cita se ha creado correctamente",
        })
      }
      await loadAppointments()
      handleCloseForm()
    } catch (error) {
      console.error("[v0] Error saving appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la cita",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    try {
      await dbService.deleteAppointment(id)
      toast({
        title: "Cita eliminada",
        description: "La cita se ha eliminado correctamente",
      })
      await loadAppointments()
    } catch (error) {
      console.error("[v0] Error deleting appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Citas</h2>
            <p className="text-sm text-muted-foreground mt-1">Administra todas las citas del taller</p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus size={20} />
            Nueva Cita
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por cliente, teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded transition-colors ${
                view === "list" ? "bg-primary text-white" : "text-foreground hover:bg-slate-700/50"
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                view === "calendar" ? "bg-primary text-white" : "text-foreground hover:bg-slate-700/50"
              }`}
            >
              <Calendar size={16} />
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {showForm ? (
          <AppointmentForm appointment={selectedAppointment} onClose={handleCloseForm} onSave={handleSaveAppointment} />
        ) : view === "list" ? (
          <AppointmentsList
            searchQuery={searchQuery}
            onEdit={handleEditAppointment}
            appointments={appointments}
            onDelete={handleDeleteAppointment}
          />
        ) : (
          <AppointmentCalendar onSelectDate={() => handleCreateNew()} />
        )}
      </div>
    </div>
  )
}
