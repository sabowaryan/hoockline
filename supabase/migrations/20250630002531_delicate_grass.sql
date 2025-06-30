/*
  # Make user_id nullable in stripe_customers table

  1. Changes
    - Alter stripe_customers table to make user_id column nullable
    - This allows creating Stripe customers for anonymous users (public payments)
    - Update RLS policies to handle both authenticated and anonymous customers

  2. Security
    - Maintain existing RLS policies for authenticated users
    - Anonymous customers won't be able to view their data through RLS
*/

-- Make user_id nullable in stripe_customers table
ALTER TABLE stripe_customers 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the unique constraint to allow multiple NULL values
DROP INDEX IF EXISTS stripe_customers_user_id_key;
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