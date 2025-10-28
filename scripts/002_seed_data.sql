-- Insert sample customers
INSERT INTO customers (name, email, phone, address, city, postal_code, notes) VALUES
('Carlos Martínez', 'carlos.martinez@email.com', '+34 612 345 678', 'Calle Mayor 15', 'Madrid', '28001', 'Cliente frecuente, prefiere citas por la mañana'),
('Ana García López', 'ana.garcia@email.com', '+34 623 456 789', 'Avenida Libertad 42', 'Barcelona', '08001', 'Vehículo de empresa'),
('Miguel Rodríguez', 'miguel.rodriguez@email.com', '+34 634 567 890', 'Plaza España 8', 'Valencia', '46001', NULL),
('Laura Fernández', 'laura.fernandez@email.com', '+34 645 678 901', 'Calle Sol 23', 'Sevilla', '41001', 'Requiere factura detallada'),
('David Sánchez', 'david.sanchez@email.com', '+34 656 789 012', 'Avenida Constitución 67', 'Zaragoza', '50001', NULL)
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (sku, name, description, category, quantity, min_quantity, unit_price, supplier, last_restocked) VALUES
('OIL-5W30-001', 'Aceite Motor 5W-30', 'Aceite sintético para motor 5W-30, 5L', 'Lubricantes', 45, 20, 35.50, 'Castrol España', NOW() - INTERVAL '15 days'),
('FILTER-AIR-002', 'Filtro de Aire', 'Filtro de aire universal para vehículos', 'Filtros', 28, 15, 12.75, 'Mann Filter', NOW() - INTERVAL '20 days'),
('BRAKE-PAD-003', 'Pastillas de Freno', 'Juego de pastillas de freno delanteras', 'Frenos', 18, 10, 45.00, 'Brembo Ibérica', NOW() - INTERVAL '10 days'),
('SPARK-PLUG-004', 'Bujías', 'Juego de 4 bujías de platino', 'Encendido', 32, 20, 28.90, 'NGK España', NOW() - INTERVAL '25 days'),
('COOLANT-005', 'Líquido Refrigerante', 'Anticongelante/refrigerante 5L', 'Líquidos', 22, 15, 18.50, 'Total España', NOW() - INTERVAL '30 days'),
('BATTERY-12V-006', 'Batería 12V 70Ah', 'Batería de arranque 12V 70Ah', 'Eléctrico', 8, 5, 95.00, 'Varta Automotive', NOW() - INTERVAL '5 days'),
('TIRE-205-007', 'Neumático 205/55R16', 'Neumático turismo 205/55R16', 'Neumáticos', 16, 8, 75.00, 'Michelin España', NOW() - INTERVAL '12 days'),
('WIPER-BLADE-008', 'Escobillas Limpiaparabrisas', 'Par de escobillas 55cm', 'Accesorios', 25, 12, 15.50, 'Bosch España', NOW() - INTERVAL '18 days')
ON CONFLICT DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (customer_id, appointment_date, estimated_duration, status, description, notes) VALUES
(1, NOW() + INTERVAL '2 days', 60, 'confirmed', 'Cambio de aceite y filtros', 'Cliente solicita revisión completa'),
(2, NOW() + INTERVAL '3 days', 120, 'pending', 'Revisión de frenos', NULL),
(3, NOW() + INTERVAL '5 days', 90, 'confirmed', 'Cambio de neumáticos', 'Traer 4 neumáticos nuevos'),
(4, NOW() + INTERVAL '1 day', 45, 'pending', 'Diagnóstico de ruido en motor', NULL),
(5, NOW() + INTERVAL '7 days', 180, 'confirmed', 'Mantenimiento completo', 'Revisión de 50.000 km')
ON CONFLICT DO NOTHING;

-- Insert sample repair orders
INSERT INTO repair_orders (customer_id, appointment_id, vehicle_info, description, status, start_date, estimated_cost, notes) VALUES
(1, NULL, '1234 ABC - Toyota Corolla 2018', 'Cambio de aceite y filtro de aire', 'completed', NOW() - INTERVAL '5 days', 85.50, 'Trabajo completado sin incidencias'),
(2, NULL, '5678 DEF - BMW Serie 3 2020', 'Sustitución de pastillas de freno', 'in_progress', NOW() - INTERVAL '1 day', 180.00, 'Esperando aprobación del cliente para discos'),
(3, NULL, '9012 GHI - Seat León 2019', 'Revisión pre-ITV', 'pending', NOW(), 120.00, NULL),
(4, NULL, '3456 JKL - Ford Focus 2017', 'Cambio de batería', 'completed', NOW() - INTERVAL '10 days', 125.00, 'Batería antigua reciclada'),
(5, NULL, '7890 MNO - Volkswagen Golf 2021', 'Mantenimiento 30.000 km', 'in_progress', NOW() - INTERVAL '2 days', 350.00, 'Incluye cambio de correa distribución')
ON CONFLICT DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, repair_order_id, issue_date, due_date, subtotal, tax, total, status, notes) VALUES
('INV-2025-001', 1, 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 85.50, 17.96, 103.46, 'paid', 'Pagado en efectivo'),
('INV-2025-002', 4, 4, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 125.00, 26.25, 151.25, 'paid', 'Pagado con tarjeta'),
('INV-2025-003', 2, 2, NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days', 180.00, 37.80, 217.80, 'pending', NULL),
('INV-2025-004', 5, 5, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', 350.00, 73.50, 423.50, 'pending', 'Pendiente de finalizar trabajos')
ON CONFLICT DO NOTHING;
