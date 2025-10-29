"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAppointments } from "@/lib/db-service"

export function AppointmentCalendar({ onSelectDate }: { onSelectDate: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 28))
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments()
        setAppointments(data)
      } catch (error) {
        console.error("[v0] Error loading appointments:", error)
      }
    }
    loadAppointments()
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    setSelectedDay(null)
  }

  const hasAppointments = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.some((apt) => apt.appointment_date.startsWith(dateStr))
  }

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter((apt) => apt.appointment_date.startsWith(dateStr))
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
  }

  const selectedDayAppointments = selectedDay ? getAppointmentsForDay(selectedDay) : []

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold capitalize">{monthName}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft size={18} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={index}>
                  {day ? (
                    <button
                      onClick={() => handleDayClick(day)}
                      className={`w-full aspect-square flex items-center justify-center rounded-lg border transition-colors text-sm font-medium relative ${
                        selectedDay === day
                          ? "bg-primary text-white border-primary"
                          : "border-border hover:bg-primary hover:text-white hover:border-primary"
                      }`}
                    >
                      {day}
                      {hasAppointments(day) && (
                        <span className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  ) : (
                    <div className="w-full aspect-square" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Appointments for selected date */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary" />
              {selectedDay ? `Citas del día ${selectedDay}` : "Citas Próximas"}
            </h4>
            <div className="space-y-2">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((apt) => {
                  const time = new Date(apt.appointment_date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  return (
                    <div key={apt.id} className="p-3 bg-slate-700/30 rounded-lg border border-border">
                      <p className="font-medium text-sm">{apt.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {time} - {apt.description}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                          apt.status === "confirmed"
                            ? "bg-green-500/20 text-green-500"
                            : apt.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {apt.status === "confirmed"
                          ? "Confirmada"
                          : apt.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                      </span>
                    </div>
                  )
                })
              ) : selectedDay ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No hay citas programadas para este día
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Selecciona un día para ver las citas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
