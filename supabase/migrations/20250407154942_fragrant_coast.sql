-- Reset password for both admin users to a known temporary password
SELECT create_admin_user('joelle@nguyen.eu', 'Admin123!');
SELECT create_admin_user('pearl@nguyen.eu', 'Admin123!');

-- Verify the update
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email IN ('joelle@nguyen.eu', 'pearl@nguyen.eu')
        AND verify_admin_password(email, 'Admin123!')
    ) THEN
        RAISE EXCEPTION 'Failed to reset admin passwords';
    END IF;
END $$;