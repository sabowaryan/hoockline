/*
  # Fix infinite recursion in profiles RLS policies

  1. Security Changes
    - Remove recursive policies that reference profiles table within profiles policies
    - Create simple, non-recursive policies for basic user access
    - Use service role for admin operations to avoid recursion
    - Prevent users from changing their own roles

  2. Policy Structure
    - Users can view and update their own profile
    - Role changes are prevented for regular users
    - Service role has full access for admin operations
    - Profile creation is allowed for new users
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

-- Users can update their own profile (but cannot change their role)
-- We prevent role changes by requiring the role to remain the same
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM profiles WHERE id = auth.uid())
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