"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppointmentCalendar({ onSelectDate }: { onSelectDate: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 28))

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
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

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
                      onClick={onSelectDate}
                      className="w-full aspect-square flex items-center justify-center rounded-lg border border-border hover:bg-primary hover:text-white hover:border-primary transition-colors text-sm font-medium"
                    >
                      {day}
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
            <h4 className="font-semibold mb-4">Citas Próximas</h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-700/30 rounded-lg border border-border">
                <p className="font-medium text-sm">Carlos García</p>
                <p className="text-xs text-muted-foreground">10:00 AM - Revisión general</p>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg border border-border">
                <p className="font-medium text-sm">María López</p>
                <p className="text-xs text-muted-foreground">14:30 PM - Reparación de frenos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
