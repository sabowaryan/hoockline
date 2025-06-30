/*
  # Fix Admin Access Issues

  1. Ensure proper profile creation trigger
  2. Create admin user if needed
  3. Fix RLS policies for profiles
*/

-- First, let's make sure the trigger function exists and works properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, do nothing
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create an admin user profile if it doesn't exist
-- You'll need to replace 'your-admin-email@example.com' with the actual admin email
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to find existing admin user by email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@clicklone.com' -- Replace with your admin email
  LIMIT 1;
  
  -- If admin user exists, ensure they have admin profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (id) 
    DO UPDATE SET role = 'admin', updated_at = now();
    
    RAISE NOTICE 'Admin profile created/updated for user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'No admin user found with email admin@clicklone.com';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;

-- Create clean, simple policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;