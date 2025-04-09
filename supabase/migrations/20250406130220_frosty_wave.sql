/*
  # Create admin users table and functions
  
  1. Changes
    - Create admin_users table
    - Add RLS policies with proper checks
    - Create admin user management functions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can read their own data" ON admin_users;

-- Create policy for admins to read their own data
CREATE POLICY "Admins can read their own data"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (auth.email() = email);

-- Function to create or update admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    p_email text,
    p_password text
) RETURNS uuid AS $$
DECLARE
    v_user_id uuid;
BEGIN
    INSERT INTO admin_users (
        email,
        password_hash
    ) VALUES (
        p_email,
        crypt(p_password, gen_salt('bf'))
    )
    ON CONFLICT (email) DO UPDATE SET
        password_hash = crypt(p_password, gen_salt('bf')),
        updated_at = now()
    RETURNING id INTO v_user_id;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
    p_email text,
    p_password text
) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE email = p_email
        AND password_hash = crypt(p_password, password_hash)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin users
SELECT create_admin_user('joelle@nguyen.eu', 'temporaryPassword123');
SELECT create_admin_user('pearl@nguyen.eu', 'temporaryPassword123');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_admin_user TO postgres, authenticated, service_role;
GRANT EXECUTE ON FUNCTION verify_admin_password TO postgres, authenticated, service_role;