export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  customer_id: number
  appointment_date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  description?: string
  estimated_duration?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: number
  name: string
  description?: string
  sku?: string
  quantity: number
  min_quantity: number
  unit_price: number
  category?: string
  supplier?: string
  last_restocked?: string
  created_at: string
  updated_at: string
}

export interface RepairOrder {
  id: number
  customer_id: number
  appointment_id?: number
  vehicle_info?: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  estimated_cost?: number
  actual_cost?: number
  start_date?: string
  completion_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  customer_id: number
  repair_order_id?: number
  issue_date: string
  due_date?: string
  subtotal: number
  tax: number
  total: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}

export interface FinancialTransaction {
  id: number
  type: "income" | "expense"
  category: string
  amount: number
  description?: string
  invoice_id?: number
  transaction_date: string
  created_at: string
}
