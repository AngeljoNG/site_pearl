/*
  # Fix admin passwords
  
  1. Changes
    - Reset Pearl's password to temporary one
    - Ensure Joelle's password is not modified
*/

-- Only reset Pearl's password, leaving Joelle's unchanged
DO $$
BEGIN
    -- Only update Pearl's password
    UPDATE admin_users
    SET 
        password_hash = crypt('Admin123!', gen_salt('bf')),
        updated_at = now()
    WHERE email = 'pearl@nguyen.eu';

    -- Verify Pearl's password was updated
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = 'pearl@nguyen.eu'
        AND verify_admin_password('pearl@nguyen.eu', 'Admin123!')
    ) THEN
        RAISE EXCEPTION 'Failed to reset Pearl''s password';
    END IF;
END $$;