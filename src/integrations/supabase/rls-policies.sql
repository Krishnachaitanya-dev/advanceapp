
-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. PROFILES TABLE POLICIES
-- Users can create their own profile during signup
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view their own profile, admins can view all profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

-- Users can update their own profile, admins can update any profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin())
  WITH CHECK (
    CASE 
      WHEN is_admin() THEN TRUE
      WHEN auth.uid() = id THEN 
        -- Regular users cannot change their role
        (NEW.role = OLD.role)
      ELSE FALSE
    END
  );

-- Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles" ON profiles
  FOR DELETE USING (is_admin());

-- 2. ADDRESSES TABLE POLICIES
-- Users can add addresses for themselves only
CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users see only their addresses, admins see all addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Users can update only their addresses, admins can update any
CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users can delete only their addresses, admins can delete any
CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- 3. SERVICES TABLE POLICIES
-- Only admins can create services
CREATE POLICY "Only admins can insert services" ON services
  FOR INSERT WITH CHECK (is_admin());

-- All authenticated users can view active services
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (status = 'active' OR is_admin());

-- Only admins can update services
CREATE POLICY "Only admins can update services" ON services
  FOR UPDATE USING (is_admin());

-- Only admins can delete services
CREATE POLICY "Only admins can delete services" ON services
  FOR DELETE USING (is_admin());

-- 4. BOOKINGS TABLE POLICIES
-- Users can create bookings for themselves only
CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users see only their bookings, admins see all bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Users can update their own bookings, admins can update any
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users can cancel their own bookings, admins can delete any
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- 5. ORDERS TABLE POLICIES
-- Users can create orders for themselves only
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users see only their orders, admins see all orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Users can update their own pending orders, admins can update any
CREATE POLICY "Users can update own pending orders" ON orders
  FOR UPDATE USING (
    (auth.uid() = user_id AND status IN ('pending', 'confirmed')) 
    OR is_admin()
  )
  WITH CHECK (
    (auth.uid() = user_id AND status IN ('pending', 'confirmed')) 
    OR is_admin()
  );

-- Only admins can delete orders
CREATE POLICY "Only admins can delete orders" ON orders
  FOR DELETE USING (is_admin());

-- 6. ORDER ITEMS TABLE POLICIES
-- Allow access based on order ownership
CREATE POLICY "Users can insert items to own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.user_id = auth.uid()
    )
    OR is_admin()
  );

-- Users can view items in their own orders
CREATE POLICY "Users can view items in own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

-- Users can update items in their pending orders, admins can update any
CREATE POLICY "Users can update items in own orders" ON order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (
        (orders.user_id = auth.uid() AND orders.status IN ('pending', 'confirmed'))
        OR is_admin()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (
        (orders.user_id = auth.uid() AND orders.status IN ('pending', 'confirmed'))
        OR is_admin()
      )
    )
  );

-- Users can delete items from their pending orders, admins can delete any
CREATE POLICY "Users can delete items in own orders" ON order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND (
        (orders.user_id = auth.uid() AND orders.status IN ('pending', 'confirmed'))
        OR is_admin()
      )
    )
  );

-- 7. ADMIN LOGS TABLE POLICIES
-- Only admins can create log entries
CREATE POLICY "Only admins can insert logs" ON admin_logs
  FOR INSERT WITH CHECK (is_admin());

-- Only admins can view logs
CREATE POLICY "Only admins can view logs" ON admin_logs
  FOR SELECT USING (is_admin());

-- Only admins can update logs
CREATE POLICY "Only admins can update logs" ON admin_logs
  FOR UPDATE USING (is_admin());

-- Only admins can delete logs
CREATE POLICY "Only admins can delete logs" ON admin_logs
  FOR DELETE USING (is_admin());
