-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  estimated_duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Inventario
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  unit_price DECIMAL(10, 2),
  category VARCHAR(100),
  supplier VARCHAR(255),
  last_restocked TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Órdenes de Reparación
CREATE TABLE IF NOT EXISTS repair_orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  appointment_id INTEGER REFERENCES appointments(id),
  vehicle_info VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Items de Órdenes (Partes y Servicios)
CREATE TABLE IF NOT EXISTS repair_order_items (
  id SERIAL PRIMARY KEY,
  repair_order_id INTEGER NOT NULL REFERENCES repair_orders(id),
  inventory_id INTEGER REFERENCES inventory(id),
  description VARCHAR(255),
  quantity INTEGER,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  repair_order_id INTEGER REFERENCES repair_orders(id),
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Transacciones Financieras
CREATE TABLE IF NOT EXISTS financial_transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50),
  category VARCHAR(100),
  amount DECIMAL(10, 2),
  description TEXT,
  invoice_id INTEGER REFERENCES invoices(id),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_repair_orders_customer ON repair_orders(customer_id);
CREATE INDEX idx_repair_orders_status ON repair_orders(status);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_financial_date ON financial_transactions(transaction_date);
