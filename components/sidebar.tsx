"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Users, Package, Wrench, FileText, BarChart3, Settings, Menu, X, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Citas", href: "/appointments" },
  { icon: Users, label: "Clientes", href: "/customers" },
  { icon: Package, label: "Inventario", href: "/inventory" },
  { icon: Wrench, label: "Órdenes", href: "/repair-orders" },
  { icon: FileText, label: "Facturas", href: "/invoices" },
  { icon: BarChart3, label: "Reportes", href: "/reports" },
  { icon: Settings, label: "Configuración", href: "/settings" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userInitials, setUserInitials] = useState("U")

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserEmail(user.email)
        // Get initials from email
        const emailParts = user.email.split("@")[0]
        const initials = emailParts
          .split(".")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        setUserInitials(initials || "U")
      }
    }
    getUser()
  }, [])

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg hover:bg-slate-700 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-0"
        } bg-card border-r border-border transition-all duration-300 overflow-hidden md:w-64 md:relative fixed h-full z-40 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">Mechanic ERP</h1>
          <p className="text-xs text-muted-foreground mt-1">Taller Mecánico</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-white" : "text-foreground hover:bg-slate-700/50"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/30">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{userInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userEmail || "Usuario"}</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
