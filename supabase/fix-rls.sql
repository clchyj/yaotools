-- Fix RLS policies for user registration

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create comprehensive RLS policies for users table
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert users" 
  ON users FOR INSERT 
  WITH CHECK (true);

-- Alternative approach: Allow authenticated users to insert their own records
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Ensure the trigger function has the right permissions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;

-- Grant necessary permissions to service role
GRANT ALL ON users TO service_role;

-- Update the trigger function to handle RLS properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, remaining_uses)
  VALUES (NEW.id, NEW.email, 10);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;