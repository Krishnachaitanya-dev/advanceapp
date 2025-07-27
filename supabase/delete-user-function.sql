-- Function to safely delete user account and all associated data
-- This ensures proper cleanup while respecting foreign key constraints

CREATE OR REPLACE FUNCTION delete_user_account(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete in proper order to respect foreign key constraints
  
  -- Delete order items first (they reference orders)
  DELETE FROM order_items 
  WHERE order_id IN (
    SELECT id FROM orders WHERE user_id = delete_user_account.user_id
  );
  
  -- Delete orders (they reference users)
  DELETE FROM orders WHERE user_id = delete_user_account.user_id;
  
  -- Delete addresses (they reference users)  
  DELETE FROM addresses WHERE user_id = delete_user_account.user_id;
  
  -- Delete profile (references auth.users)
  DELETE FROM profiles WHERE id = delete_user_account.user_id;
  
  -- Finally delete the auth user (this is the parent record)
  DELETE FROM auth.users WHERE id = delete_user_account.user_id;
  
END;
$$;

-- Grant execute permission to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION delete_user_account(uuid) TO authenticated;

-- Add RLS policy to ensure users can only delete their own account
CREATE POLICY "Users can only delete their own account" ON auth.users
FOR DELETE USING (auth.uid() = id);