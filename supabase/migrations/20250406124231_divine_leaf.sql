-- Function to change admin password
CREATE OR REPLACE FUNCTION change_admin_password(
    p_email text,
    p_current_password text,
    p_new_password text
) RETURNS boolean AS $$
BEGIN
    -- First verify the current password
    IF NOT verify_admin_password(p_email, p_current_password) THEN
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
GRANT EXECUTE ON FUNCTION change_admin_password TO postgres, authenticated, service_role;