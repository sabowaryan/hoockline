/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - Current policies reference the profiles table within their own conditions
    - This creates infinite recursion when checking permissions
    - Policies like "Admins can view all profiles" check if user is admin by querying profiles table

  2. Solution
    - Remove recursive policy references
    - Use auth.uid() directly for user identification
    - Simplify admin checks to avoid circular dependencies
    - Create non-recursive policies that work with Supabase auth

  3. Security
    - Users can only view/update their own profile
    - Service role has full access for admin operations
    - Remove complex admin policies that cause recursion
*/

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON profiles;

-- Create simple, non-recursive policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile (but not change their role)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (
      SELECT role 
      FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

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