"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Users, Download, FileText } from "lucide-react"
import { useState, useMemo } from "react"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { mockCustomers, mockInvoices, mockRepairOrders, mockInventory } from "@/lib/mock-data"

export default function ReportsPage() {
  const [period, setPeriod] = useState("month")

  const statistics = useMemo(() => {
    // Total revenue from paid invoices
    const totalRevenue = mockInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

    // Completed orders
    const completedOrders = mockRepairOrders.filter((order) => order.status === "completed").length

    // Unique customers served
    const uniqueCustomers = new Set(mockRepairOrders.map((order) => order.customer_name)).size

    // Average ticket
    const averageTicket = completedOrders > 0 ? totalRevenue / completedOrders : 0

    return {
      totalRevenue,
      completedOrders,
      uniqueCustomers,
      averageTicket,
    }
  }, [])

  const serviceData = useMemo(() => {
    const serviceCounts: Record<string, number> = {}

    mockRepairOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const category = item.description.toLowerCase().includes("aceite")
          ? "Cambio de Aceite"
          : item.description.toLowerCase().includes("freno")
            ? "Frenos"
            : item.description.toLowerCase().includes("neumático")
              ? "Neumáticos"
              : item.description.toLowerCase().includes("revisión") ||
                  item.description.toLowerCase().includes("diagnóstico")
                ? "Diagnóstico"
                : "Otros"

        serviceCounts[category] = (serviceCounts[category] || 0) + 1
      })
    })

    const total = Object.values(serviceCounts).reduce((sum, count) => sum + count, 0)
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    return Object.entries(serviceCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[index % colors.length],
    }))
  }, [])

  const topCustomers = useMemo(() => {
    return [...mockCustomers]
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5)
      .map((customer) => ({
        name: customer.name,
        total: customer.total_spent,
        visits: customer.appointments_count,
      }))
  }, [])

  const inventoryMovement = useMemo(() => {
    return mockInventory
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((item) => ({
        item: item.name,
        vendido: Math.floor(Math.random() * 50) + 10, // Simulated sales
        stock: item.quantity,
      }))
  }, [])

  const revenueData = useMemo(() => {
    const monthlyData: Record<string, { ingresos: number; gastos: number }> = {}

    mockInvoices.forEach((invoice) => {
      const date = new Date(invoice.issue_date)
      const monthKey = date.toLocaleDateString("es-ES", { month: "short" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { ingresos: 0, gastos: 0 }
      }

      if (invoice.status === "paid") {
        monthlyData[monthKey].ingresos += invoice.total
      }
    })

    // Add estimated expenses (70% of revenue)
    Object.keys(monthlyData).forEach((month) => {
      monthlyData[month].gastos = Math.round(monthlyData[month].ingresos * 0.7)
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      ...data,
    }))
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Reportes</h1>
                <p className="text-muted-foreground mt-1">Análisis y estadísticas del taller</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                    <SelectItem value="year">Este Año</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download size={16} />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                    <p className="text-2xl font-bold mt-1">{statistics.totalRevenue.toFixed(2)}€</p>
                    <p className="text-xs text-green-500 mt-1">Facturas pagadas</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Órdenes Completadas</p>
                    <p className="text-2xl font-bold mt-1">{statistics.completedOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total de órdenes</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FileText className="text-blue-500" size={24} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes Atendidos</p>
                    <p className="text-2xl font-bold mt-1">{statistics.uniqueCustomers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Clientes únicos</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="text-purple-500" size={24} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                    <p className="text-2xl font-bold mt-1">{statistics.averageTicket.toFixed(0)}€</p>
                    <p className="text-xs text-muted-foreground mt-1">Por orden completada</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="text-orange-500" size={24} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList>
                <TabsTrigger value="revenue">Ingresos y Gastos</TabsTrigger>
                <TabsTrigger value="services">Servicios</TabsTrigger>
                <TabsTrigger value="customers">Clientes</TabsTrigger>
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ingresos vs Gastos</h3>
                  {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#3b82f6" name="Ingresos" />
                        <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                      No hay datos de ingresos disponibles
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Distribución de Servicios</h3>
                    {serviceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={serviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No hay datos de servicios disponibles
                      </div>
                    )}
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Servicios Más Solicitados</h3>
                    <div className="space-y-4">
                      {serviceData.map((service, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{service.name}</span>
                            <span className="text-sm text-muted-foreground">{service.value}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{ width: `${service.value}%`, backgroundColor: service.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top 5 Clientes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Visitas</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Total Gastado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((customer, index) => (
                          <tr key={index} className="border-b border-border hover:bg-slate-700/30">
                            <td className="py-3 px-4 text-sm">{index + 1}</td>
                            <td className="py-3 px-4 text-sm font-medium">{customer.name}</td>
                            <td className="py-3 px-4 text-sm">{customer.visits}</td>
                            <td className="py-3 px-4 text-sm text-right font-semibold">{customer.total.toFixed(2)}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Movimiento de Inventario</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Artículo</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Vendido</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                            Stock Actual
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryMovement.map((item, index) => (
                          <tr key={index} className="border-b border-border hover:bg-slate-700/30">
                            <td className="py-3 px-4 text-sm font-medium">{item.item}</td>
                            <td className="py-3 px-4 text-sm text-center">{item.vendido}</td>
                            <td className="py-3 px-4 text-sm text-center">{item.stock}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  item.stock < 5
                                    ? "bg-red-500/20 text-red-500"
                                    : item.stock < 10
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "bg-green-500/20 text-green-500"
                                }`}
                              >
                                {item.stock < 5 ? "Bajo" : item.stock < 10 ? "Medio" : "Óptimo"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
