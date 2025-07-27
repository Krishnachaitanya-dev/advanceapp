

-- Basic RLS Setup for Advance Washing App
-- This is a minimal, working baseline that can be extended later

-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PROFILES TABLE - Basic policies
-- Users can read their own profile
CREATE POLICY "users_own_profile_select" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_own_profile_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Users can insert their own profile (for signup)
CREATE POLICY "users_own_profile_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ADDRESSES TABLE - Basic policies
-- Users can only see their own addresses
CREATE POLICY "users_own_addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

-- BOOKINGS TABLE - Basic policies  
-- Users can only access their own bookings
CREATE POLICY "users_own_bookings" ON bookings
  FOR ALL USING (user_id = auth.uid());

-- ORDERS TABLE - Basic policies
-- Users can only access their own orders
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());

-- ORDER_ITEMS TABLE - Basic policies
-- Users can access order items if they own the parent order
CREATE POLICY "users_own_order_items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

