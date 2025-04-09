/*
  # Add password reset function
  
  1. Changes
    - Add function to reset password
    - Update existing users with new passwords
    - Remove audit logging to fix schema compatibility issues
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a function to reset password
CREATE OR REPLACE FUNCTION reset_user_password(
    user_email text,
    new_password text
)
RETURNS boolean AS $$
DECLARE
    updated_count int;
BEGIN
    -- Update the user's password
    WITH updated AS (
        UPDATE auth.users
        SET 
            encrypted_password = crypt(new_password, gen_salt('bf')),
            updated_at = now()
        WHERE email = user_email
        AND email IN ('joelle@nguyen.eu', 'pearl@nguyen.eu')
        RETURNING 1
    )
    SELECT count(*) INTO updated_count FROM updated;
    
    RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION reset_user_password TO service_role;

-- Set default passwords for existing users
DO $$
BEGIN
    -- Reset password for joelle@nguyen.eu
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'joelle@nguyen.eu'
        AND encrypted_password IS NOT NULL
    ) THEN
        PERFORM reset_user_password('joelle@nguyen.eu', 'temporaryPassword123');
    END IF;
    
    -- Reset password for pearl@nguyen.eu
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'pearl@nguyen.eu'
        AND encrypted_password IS NOT NULL
    ) THEN
        PERFORM reset_user_password('pearl@nguyen.eu', 'temporaryPassword123');
    END IF;
END $$;