/*
  # Make user_id nullable for anonymous customers

  1. Schema Changes
    - Make user_id nullable in stripe_customers table
    - Update unique constraint to allow multiple NULL values for anonymous customers
    
  2. Security Updates
    - Update RLS policies to handle nullable user_id
    - Add service role policy for managing anonymous customers
    
  3. Data Integrity
    - Maintain uniqueness for non-null user_id values
    - Preserve existing customer data
*/

-- Make user_id nullable in stripe_customers table
ALTER TABLE stripe_customers 
ALTER COLUMN user_id DROP NOT NULL;

-- Drop the unique constraint (not the index) to allow multiple NULL values
ALTER TABLE stripe_customers 
DROP CONSTRAINT IF EXISTS stripe_customers_user_id_key;

-- Create a new unique index that allows multiple NULL values
CREATE UNIQUE INDEX stripe_customers_user_id_key 
ON stripe_customers (user_id) 
WHERE user_id IS NOT NULL;

-- Update RLS policy to handle nullable user_id
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Add policy for service role to manage anonymous customers
CREATE POLICY "Service role can manage all customers"
    ON stripe_customers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);