/*
  # Update admin password
  
  1. Changes
    - Reset admin password to new secure value
    - Ensure proper password hashing
*/

-- Update admin password
SELECT create_admin_user('pearl@nguyen.eu', 'Admin123!');

-- Verify the update
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = 'pearl@nguyen.eu'
        AND verify_admin_password('pearl@nguyen.eu', 'Admin123!')
    ) THEN
        RAISE EXCEPTION 'Failed to update admin password';
    END IF;
END $$;