-- Function to change admin password with correct parameter order
CREATE OR REPLACE FUNCTION change_admin_password(
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
GRANT EXECUTE ON FUNCTION change_admin_password TO postgres, authenticated, service_role;