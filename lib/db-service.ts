import { createClient } from "@/lib/supabase/client"

export const dbService = {
  // Customers
  async getCustomers() {
    try {
      const supabase = createClient()
      console.log("[v0] Fetching customers from Supabase...")
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Supabase error:", error)
        throw error
      }

      console.log("[v0] Customers fetched successfully:", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async createCustomer(customer: any) {
    try {
      const supabase = createClient()
      const { id, appointments_count, total_spent, created_at, ...dbCustomer } = customer
      console.log("[v0] Creating customer:", dbCustomer)
      const { data, error } = await supabase.from("customers").insert(dbCustomer).select().single()

      if (error) {
        console.error("[v0] Supabase error:", error)
        throw error
      }

      console.log("[v0] Customer created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async updateCustomer(id: number, customer: any) {
    try {
      const supabase = createClient()
      const { appointments_count, total_spent, ...dbCustomer } = customer
      const { data, error } = await supabase.from("customers").update(dbCustomer).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Error updating customer:", error)
      throw error
    }
  },

  async deleteCustomer(id: number) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("customers").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("[v0] Error deleting customer:", error)
      throw error
    }
  },

  // Appointments
  async getAppointments() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          customer:customers(id, name, phone, email)
        `)
        .order("appointment_date", { ascending: true })

      if (error) throw error

      const transformedData = (data || []).map((apt) => ({
        ...apt,
        customer_id: apt.customer?.id,
        customer_name: apt.customer?.name || "Cliente desconocido",
        customer_phone: apt.customer?.phone || "N/A",
        customer_email: apt.customer?.email || "",
      }))

      return transformedData
    } catch (error) {
      console.error("[v0] Error fetching appointments:", error)
      throw error
    }
  },

  async createAppointment(appointment: any) {
    try {
      const supabase = createClient()
      const { id, customer_name, customer_phone, customer_email, ...dbAppointment } = appointment
      console.log("[v0] Creating appointment:", dbAppointment)
      const { data, error } = await supabase.from("appointments").insert(dbAppointment).select().single()
      if (error) {
        console.error("[v0] Error saving appointment:", error.message)
        throw error
      }
      console.log("[v0] Appointment created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async updateAppointment(id: number, appointment: any) {
    try {
      const supabase = createClient()
      const { customer_name, customer_phone, customer_email, ...dbAppointment } = appointment
      const { data, error } = await supabase.from("appointments").update(dbAppointment).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Error updating appointment:", error)
      throw error
    }
  },

  async deleteAppointment(id: number) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("appointments").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("[v0] Error deleting appointment:", error)
      throw error
    }
  },

  // Inventory
  async getInventory() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("inventory").select("*").order("name", { ascending: true })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[v0] Error fetching inventory:", error)
      throw error
    }
  },

  async createInventoryItem(item: any) {
    try {
      const supabase = createClient()
      const { id, ...dbItem } = item
      console.log("[v0] Creating inventory item:", dbItem)
      const { data, error } = await supabase.from("inventory").insert(dbItem).select().single()
      if (error) {
        console.error("[v0] Error saving inventory item:", error.message)
        throw error
      }
      console.log("[v0] Inventory item created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async updateInventoryItem(id: number, item: any) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("inventory").update(item).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Error updating inventory item:", error)
      throw error
    }
  },

  async deleteInventoryItem(id: number) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("inventory").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("[v0] Error deleting inventory item:", error)
      throw error
    }
  },

  // Repair Orders
  async getRepairOrders() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("repair_orders")
        .select(`
          *,
          customer:customers(id, name, phone, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const transformedData = (data || []).map((order) => ({
        ...order,
        customer_id: order.customer?.id,
        customer_name: order.customer?.name || "Cliente desconocido",
        customer_phone: order.customer?.phone || "",
        customer_email: order.customer?.email || "",
      }))

      return transformedData
    } catch (error) {
      console.error("[v0] Error fetching repair orders:", error)
      throw error
    }
  },

  async createRepairOrder(order: any) {
    try {
      const supabase = createClient()
      const { id, customer_name, customer_phone, customer_email, items, ...dbOrder } = order
      console.log("[v0] Creating repair order:", dbOrder)
      const { data, error } = await supabase.from("repair_orders").insert(dbOrder).select().single()
      if (error) {
        console.error("[v0] Error saving repair order:", error.message)
        throw error
      }
      console.log("[v0] Repair order created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async updateRepairOrder(id: number, order: any) {
    try {
      const supabase = createClient()
      const { customer_name, customer_phone, customer_email, items, ...dbOrder } = order
      const { data, error } = await supabase.from("repair_orders").update(dbOrder).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Error updating repair order:", error)
      throw error
    }
  },

  async deleteRepairOrder(id: number) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("repair_orders").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("[v0] Error deleting repair order:", error)
      throw error
    }
  },

  // Invoices
  async getInvoices() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(id, name, email, phone)
        `)
        .order("issue_date", { ascending: false })

      if (error) throw error

      const transformedData = (data || []).map((invoice) => ({
        ...invoice,
        customer_id: invoice.customer?.id,
        customer_name: invoice.customer?.name || "Cliente desconocido",
        customer_email: invoice.customer?.email || "",
        // Parse items from JSON if stored as JSON, or use empty array
        items: typeof invoice.items === "string" ? JSON.parse(invoice.items) : invoice.items || [],
      }))

      return transformedData
    } catch (error) {
      console.error("[v0] Error fetching invoices:", error)
      throw error
    }
  },

  async createInvoice(invoice: any) {
    try {
      const supabase = createClient()
      console.log("[v0] Creating invoice:", invoice)
      const { id, customer_name, customer_email, items, ...dbInvoice } = invoice

      const invoiceToSave = {
        ...dbInvoice,
        // Note: items should be stored in a separate table (invoice_items) for proper normalization
        // For now, we'll skip items as they're not in the schema
      }

      const { data, error } = await supabase.from("invoices").insert(invoiceToSave).select().single()
      if (error) {
        console.error("[v0] Error saving invoice:", error.message)
        throw error
      }
      console.log("[v0] Invoice created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Database service error:", error)
      throw error
    }
  },

  async updateInvoice(id: number, invoice: any) {
    try {
      const supabase = createClient()
      const { customer_name, customer_email, items, ...dbInvoice } = invoice
      const { data, error } = await supabase.from("invoices").update(dbInvoice).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Error updating invoice:", error)
      throw error
    }
  },

  async deleteInvoice(id: number) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("invoices").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("[v0] Error deleting invoice:", error)
      throw error
    }
  },
}

export const getCustomers = dbService.getCustomers
export const createCustomer = dbService.createCustomer
export const updateCustomer = dbService.updateCustomer
export const deleteCustomer = dbService.deleteCustomer

export const getAppointments = dbService.getAppointments
export const createAppointment = dbService.createAppointment
export const updateAppointment = dbService.updateAppointment
export const deleteAppointment = dbService.deleteAppointment

export const getInventory = dbService.getInventory
export const createInventoryItem = dbService.createInventoryItem
export const updateInventoryItem = dbService.updateInventoryItem
export const deleteInventoryItem = dbService.deleteInventoryItem

export const getRepairOrders = dbService.getRepairOrders
export const createRepairOrder = dbService.createRepairOrder
export const updateRepairOrder = dbService.updateRepairOrder
export const deleteRepairOrder = dbService.deleteRepairOrder

export const getInvoices = dbService.getInvoices
export const createInvoice = dbService.createInvoice
export const updateInvoice = dbService.updateInvoice
export const deleteInvoice = dbService.deleteInvoice
