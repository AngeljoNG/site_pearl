/*
  # Add password reset functionality
  
  1. New Tables
    - `password_reset_tokens`
      - `id` (uuid, primary key)
      - `email` (text)
      - `token` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Functions
    - `create_password_reset_token`: Creates a reset token for a user
    - `reset_password_with_token`: Resets password using a valid token
*/

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    token text NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    used_at timestamptz,
    CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES admin_users(email) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage tokens
CREATE POLICY "Service role can manage tokens"
    ON password_reset_tokens
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to create a password reset token
CREATE OR REPLACE FUNCTION create_password_reset_token(
    p_email text
) RETURNS text AS $$
DECLARE
    v_token text;
    v_expires_at timestamptz;
BEGIN
    -- Verify email exists in admin_users
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = p_email) THEN
        RETURN NULL;
    END IF;

    -- Generate random token
    v_token := encode(gen_random_bytes(32), 'hex');
    
    -- Set expiration to 1 hour from now
    v_expires_at := now() + interval '1 hour';

    -- Insert new token
    INSERT INTO password_reset_tokens (
        email,
        token,
        expires_at
    ) VALUES (
        p_email,
        v_token,
        v_expires_at
    );

    RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset password using token
CREATE OR REPLACE FUNCTION reset_password_with_token(
    p_email text,
    p_token text,
    p_new_password text
) RETURNS boolean AS $$
DECLARE
    v_valid boolean;
BEGIN
    -- Verify token is valid and not expired
    SELECT EXISTS (
        SELECT 1
        FROM password_reset_tokens
        WHERE email = p_email
        AND token = p_token
        AND expires_at > now()
        AND used_at IS NULL
    ) INTO v_valid;

    -- If token is invalid or expired, return false
    IF NOT v_valid THEN
        RETURN false;
    END IF;

    -- Mark token as used
    UPDATE password_reset_tokens
    SET used_at = now()
    WHERE email = p_email
    AND token = p_token;

    -- Update password
    UPDATE admin_users
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        updated_at = now()
    WHERE email = p_email;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_password_reset_token TO postgres, authenticated, service_role;
GRANT EXECUTE ON FUNCTION reset_password_with_token TO postgres, authenticated, service_role;