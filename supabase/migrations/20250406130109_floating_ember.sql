/*
  # Fix change password function
  
  1. Changes
    - Drop existing function
    - Recreate with proper schema and permissions
    - Add better error handling
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS change_admin_password(text, text, text);
DROP FUNCTION IF EXISTS public.change_admin_password(text, text, text);

-- Create the function in the public schema
CREATE OR REPLACE FUNCTION public.change_admin_password(
    p_email text,
    p_current_password text,
    p_new_password text
) RETURNS boolean AS $$
DECLARE
    v_valid boolean;
BEGIN
    -- First verify the current password
    SELECT EXISTS (
        SELECT 1
        FROM admin_users
        WHERE email = p_email
        AND password_hash = crypt(p_current_password, password_hash)
    ) INTO v_valid;

    -- If current password is invalid, return false
    IF NOT v_valid THEN
        RETURN false;
    END IF;

    -- Update to new password
    UPDATE admin_users
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        updated_at = now()
    WHERE email = p_email;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.change_admin_password TO postgres, authenticated, service_role;

-- Verify function exists in public schema
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'change_admin_password'
        AND pronamespace = 'public'::regnamespace
    ) THEN
        RAISE EXCEPTION 'Function public.change_admin_password does not exist';
    END IF;
END $$;