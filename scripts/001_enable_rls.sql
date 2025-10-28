-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Users can view all customers" ON customers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert customers" ON customers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update customers" ON customers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete customers" ON customers FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for appointments table
CREATE POLICY "Users can view all appointments" ON appointments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update appointments" ON appointments FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete appointments" ON appointments FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for inventory table
CREATE POLICY "Users can view all inventory" ON inventory FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert inventory" ON inventory FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update inventory" ON inventory FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete inventory" ON inventory FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for repair_orders table
CREATE POLICY "Users can view all repair_orders" ON repair_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert repair_orders" ON repair_orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update repair_orders" ON repair_orders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete repair_orders" ON repair_orders FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for repair_order_items table
CREATE POLICY "Users can view all repair_order_items" ON repair_order_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert repair_order_items" ON repair_order_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update repair_order_items" ON repair_order_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete repair_order_items" ON repair_order_items FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for invoices table
CREATE POLICY "Users can view all invoices" ON invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update invoices" ON invoices FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete invoices" ON invoices FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for financial_transactions table
CREATE POLICY "Users can view all financial_transactions" ON financial_transactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert financial_transactions" ON financial_transactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update financial_transactions" ON financial_transactions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete financial_transactions" ON financial_transactions FOR DELETE USING (auth.uid() IS NOT NULL);
