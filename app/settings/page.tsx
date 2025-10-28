"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User, Bell, Shield, Palette, Save } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointments: true,
    lowStock: true,
    payments: true,
  })

  const handleSave = () => {
    alert("Configuración guardada correctamente")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Configuración</h1>
              <p className="text-muted-foreground mt-1">Gestiona las preferencias de tu taller</p>
            </div>

            <Tabs defaultValue="business" className="space-y-4">
              <TabsList>
                <TabsTrigger value="business" className="gap-2">
                  <Building2 size={16} />
                  Negocio
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2">
                  <User size={16} />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell size={16} />
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield size={16} />
                  Seguridad
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette size={16} />
                  Apariencia
                </TabsTrigger>
              </TabsList>

              {/* Business Settings */}
              <TabsContent value="business" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Información del Negocio
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Nombre del Taller</Label>
                        <Input id="business-name" defaultValue="Taller Mecánico Pro" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-phone">Teléfono</Label>
                        <Input id="business-phone" defaultValue="+34 912 345 678" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <Input id="business-email" type="email" defaultValue="contacto@tallerpro.es" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-address">Dirección</Label>
                      <Textarea
                        id="business-address"
                        defaultValue="Calle Principal 123, 28001 Madrid, España"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-cif">CIF/NIF</Label>
                        <Input id="business-cif" defaultValue="B12345678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-currency">Moneda</Label>
                        <Select defaultValue="eur">
                          <SelectTrigger id="business-currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="usd">Dólar ($)</SelectItem>
                            <SelectItem value="gbp">Libra (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-hours">Horario de Atención</Label>
                      <Input id="business-hours" defaultValue="Lunes a Viernes: 9:00 - 18:00" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Configuración de Facturación</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoice-prefix">Prefijo de Factura</Label>
                        <Input id="invoice-prefix" defaultValue="FAC-" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoice-number">Próximo Número</Label>
                        <Input id="invoice-number" type="number" defaultValue="1001" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">IVA (%)</Label>
                      <Input id="tax-rate" type="number" defaultValue="21" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">Condiciones de Pago</Label>
                      <Textarea
                        id="payment-terms"
                        defaultValue="Pago al contado. Aceptamos efectivo, tarjeta y transferencia bancaria."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Información Personal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                        JD
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Cambiar Foto
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF. Máx 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nombre</Label>
                        <Input id="first-name" defaultValue="Juan" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Apellidos</Label>
                        <Input id="last-name" defaultValue="Díaz" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="juan.diaz@tallerpro.es" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" defaultValue="+34 600 123 456" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select defaultValue="admin">
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="mechanic">Mecánico</SelectItem>
                          <SelectItem value="receptionist">Recepcionista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Preferencias de Notificaciones
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notif-email">Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones en tu correo electrónico</p>
                      </div>
                      <Switch
                        id="notif-email"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notif-sms">Notificaciones por SMS</Label>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones por mensaje de texto</p>
                      </div>
                      <Switch
                        id="notif-sms"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium mb-4">Tipos de Notificaciones</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notif-appointments">Nuevas Citas</Label>
                            <p className="text-sm text-muted-foreground">Cuando se agenda una nueva cita</p>
                          </div>
                          <Switch
                            id="notif-appointments"
                            checked={notifications.appointments}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, appointments: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notif-stock">Inventario Bajo</Label>
                            <p className="text-sm text-muted-foreground">Cuando un artículo tiene stock bajo</p>
                          </div>
                          <Switch
                            id="notif-stock"
                            checked={notifications.lowStock}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notif-payments">Pagos Recibidos</Label>
                            <p className="text-sm text-muted-foreground">Cuando se recibe un pago</p>
                          </div>
                          <Switch
                            id="notif-payments"
                            checked={notifications.payments}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, payments: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Seguridad
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña Actual</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva Contraseña</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button variant="outline" className="w-full md:w-auto bg-transparent">
                      Cambiar Contraseña
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Autenticación de Dos Factores</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad a tu cuenta requiriendo un código de verificación además de tu
                      contraseña.
                    </p>
                    <Button variant="outline">Activar 2FA</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sesiones Activas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium">Chrome en Windows</p>
                        <p className="text-sm text-muted-foreground">Madrid, España • Activa ahora</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    Apariencia
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Selecciona el tema de la interfaz. El tema se aplica automáticamente.
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 border-2 border-primary rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors">
                          <div className="w-full h-20 bg-slate-800 rounded mb-2"></div>
                          <p className="text-sm font-medium">Oscuro</p>
                        </button>
                        <button className="p-4 border-2 border-border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                          <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                          <p className="text-sm font-medium text-gray-900">Claro</p>
                        </button>
                        <button className="p-4 border-2 border-border rounded-lg bg-gradient-to-br from-slate-900 to-white hover:opacity-80 transition-opacity">
                          <div className="w-full h-20 bg-gradient-to-br from-slate-800 to-gray-100 rounded mb-2"></div>
                          <p className="text-sm font-medium">Auto</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select defaultValue="es">
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select defaultValue="europe-madrid">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe-madrid">Europa/Madrid (GMT+1)</SelectItem>
                          <SelectItem value="europe-london">Europa/Londres (GMT+0)</SelectItem>
                          <SelectItem value="america-new-york">América/Nueva York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-format">Formato de Fecha</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSave} className="gap-2">
                <Save size={16} />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
