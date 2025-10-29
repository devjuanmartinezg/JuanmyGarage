"use client"

import { Bell, User, LogOut, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "./theme-toggle"
import { mockAppointments, mockInventory } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const lowStockItems = mockInventory.filter((item) => item.quantity < item.min_quantity)
  const pendingAppointments = mockAppointments.filter((apt) => apt.status === "pending")
  const notificationCount = lowStockItems.length + pendingAppointments.length

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    const today = new Date().toISOString().split("T")[0]
    const isToday = date.toISOString().split("T")[0] === today
    return {
      time,
      label: isToday ? "Hoy" : new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    setShowNotifications(false)
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Bienvenido al panel de control del taller</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
          >
            <Bell size={20} className="text-muted-foreground group-hover:text-foreground" />
            {notificationCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notificaciones</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {notificationCount} {notificationCount === 1 ? "notificación" : "notificaciones"}
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notificationCount === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No hay notificaciones nuevas</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {/* Low Stock Notifications */}
                    {lowStockItems.slice(0, 5).map((item) => (
                      <Link
                        key={`stock-${item.id}`}
                        href="/inventory?filter=low-stock"
                        onClick={() => setShowNotifications(false)}
                        className="block px-4 py-3 hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">Stock Bajo</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.name}: {item.quantity} unidades (mínimo {item.min_quantity})
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {/* Pending Appointments */}
                    {pendingAppointments.slice(0, 5).map((apt) => {
                      const { time, label } = formatDateTime(apt.appointment_date)
                      return (
                        <Link
                          key={`apt-${apt.id}`}
                          href="/appointments?status=pending"
                          onClick={() => setShowNotifications(false)}
                          className="block px-4 py-3 hover:bg-slate-700/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">Cita Pendiente</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {apt.customer_name} - {label} a las {time}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {notificationCount > 0 && (
                <div className="px-4 py-3 border-t border-border">
                  <button className="text-xs text-primary hover:text-primary/80 font-medium w-full text-center">
                    Ver todas las notificaciones
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button onClick={toggleUserMenu} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <User size={20} className="text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              {userEmail && (
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
                  <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
                </div>
              )}
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left text-sm">
                <User size={16} />
                <span>Mi Perfil</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left text-sm border-t border-border">
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition-colors text-left text-sm border-t border-border text-red-400"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
