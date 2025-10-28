"use client"

import { StatCard } from "./stat-card"
import { Calendar, Package, Wrench, TrendingUp, AlertCircle, ArrowRight, Users, FileText } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { mockAppointments, mockRepairOrders, mockInventory, mockInvoices } from "@/lib/mock-data"

export function DashboardGrid() {
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = mockAppointments.filter((apt) => apt.appointment_date.startsWith(today))
  const activeOrders = mockRepairOrders.filter((order) => order.status === "in_progress" || order.status === "pending")
  const lowStockItems = mockInventory.filter((item) => item.quantity < item.min_quantity)

  // Calculate today's revenue from paid invoices
  const todayRevenue = mockInvoices
    .filter((inv) => inv.status === "paid" && inv.issue_date === today)
    .reduce((sum, inv) => sum + inv.total, 0)

  // Get upcoming appointments (today and tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const upcomingAppointments = mockAppointments
    .filter((apt) => apt.appointment_date.startsWith(today) || apt.appointment_date.startsWith(tomorrowStr))
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
    .slice(0, 3)

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    const isToday = date.toISOString().split("T")[0] === today
    return { time, label: isToday ? "Hoy" : "Mañana" }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "cancelled":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-slate-500/20 text-slate-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Citas Hoy"
          value={todayAppointments.length.toString()}
          change={`${mockAppointments.length} total este mes`}
          color="blue"
        />
        <StatCard
          icon={Wrench}
          label="Órdenes Activas"
          value={activeOrders.length.toString()}
          change={`${mockRepairOrders.filter((o) => o.status === "completed").length} completadas`}
          color="green"
        />
        <StatCard
          icon={Package}
          label="Inventario Bajo"
          value={lowStockItems.length.toString()}
          change="Requieren atención"
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          label="Ingresos Hoy"
          value={`${todayRevenue.toFixed(2)}€`}
          change={`${mockInvoices.filter((i) => i.status === "paid").length} facturas pagadas`}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Próximas Citas
            </h3>
            <a
              href="/appointments"
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
            >
              Ver todas <ArrowRight size={16} />
            </a>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => {
                const { time, label } = formatDateTime(apt.appointment_date)
                return (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => router.push("/appointments")}
                  >
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">{apt.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {label} {time} - {apt.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ml-4 ${getStatusColor(apt.status)}`}
                    >
                      {getStatusText(apt.status)}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                <p>No hay citas programadas para hoy o mañana</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-2">
            <Button
              className="w-full justify-start gap-2"
              variant="default"
              onClick={() => router.push("/appointments")}
            >
              <Calendar size={18} />
              Nueva Cita
            </Button>
            <Button
              className="w-full justify-start gap-2 bg-transparent"
              variant="outline"
              onClick={() => router.push("/customers")}
            >
              <Users size={18} />
              Nuevo Cliente
            </Button>
            <Button
              className="w-full justify-start gap-2 bg-transparent"
              variant="outline"
              onClick={() => router.push("/repair-orders")}
            >
              <Wrench size={18} />
              Nueva Orden
            </Button>
            <Button
              className="w-full justify-start gap-2 bg-transparent"
              variant="outline"
              onClick={() => router.push("/invoices")}
            >
              <FileText size={18} />
              Nueva Factura
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || mockAppointments.some((apt) => apt.status === "pending")) && (
        <div className="card border-l-4 border-l-yellow-500 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Alertas Importantes</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    • {item.name}: Stock bajo ({item.quantity} unidades, mínimo {item.min_quantity})
                  </li>
                ))}
                {mockAppointments
                  .filter((apt) => apt.status === "pending")
                  .slice(0, 2)
                  .map((apt) => {
                    const { time, label } = formatDateTime(apt.appointment_date)
                    return (
                      <li key={apt.id}>
                        • Cita de {apt.customer_name} el {label} a las {time} sin confirmar
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
