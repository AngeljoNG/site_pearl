-- Reset password only for Pearl's account
SELECT create_admin_user('pearl@nguyen.eu', 'Admin123!');

-- Verify the update
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = 'pearl@nguyen.eu'
        AND verify_admin_password('pearl@nguyen.eu', 'Admin123!')
    ) THEN
        RAISE EXCEPTION 'Failed to reset Pearl''s password';
    END IF;
END $$;