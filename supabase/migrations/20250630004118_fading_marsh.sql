/*
  # Fix profiles RLS policies - remove recursion

  1. Security Changes
    - Drop all existing policies that cause infinite recursion
    - Create simple, non-recursive policies for profiles table
    - Users can view and update their own profiles
    - Service role has full access for admin operations
    - Allow profile creation for authenticated users

  2. Notes
    - Role protection is handled at application level
    - Removes recursive policy checks that caused database errors
*/

-- Drop ALL existing policies on profiles table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Create simple, non-recursive policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
-- Note: Role protection should be handled at application level
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role has full access for admin operations
CREATE POLICY "Service role full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow profile creation for new users (handled by trigger)
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);