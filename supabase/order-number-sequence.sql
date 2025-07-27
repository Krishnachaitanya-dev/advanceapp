
-- Drop existing sequence if it exists
DROP SEQUENCE IF EXISTS order_number_seq;

-- Create sequence for order numbers starting from a safe number
-- This should be higher than any existing order numbers
CREATE SEQUENCE order_number_seq START 100;

-- Create function to get next order number (bypasses RLS)
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('order_number_seq');
  RETURN 'AW' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_next_order_number() TO authenticated;

-- Alternative: If you want to automatically set the sequence based on existing data
-- Uncomment and run this instead:
/*
DO $$
DECLARE
  max_order_num INTEGER;
BEGIN
  -- Extract the highest order number from existing orders
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 3) AS INTEGER)), 0) + 1
  INTO max_order_num
  FROM orders
  WHERE order_number ~ '^AW[0-9]+$';
  
  -- Drop and recreate sequence with the correct starting value
  DROP SEQUENCE IF EXISTS order_number_seq;
  EXECUTE format('CREATE SEQUENCE order_number_seq START %s', max_order_num);
END $$;
*/
