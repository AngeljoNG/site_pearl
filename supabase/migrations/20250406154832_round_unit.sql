/*
  # Fix password reset tokens RLS policies
  
  1. Changes
    - Update RLS policies for password_reset_tokens table
    - Allow public to insert tokens
    - Restrict access based on email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage tokens" ON password_reset_tokens;

-- Create new policies
CREATE POLICY "Allow public to insert tokens"
    ON password_reset_tokens
    FOR INSERT
    TO public
    WITH CHECK (
        email IN (
            SELECT email 
            FROM admin_users
        )
    );

CREATE POLICY "Allow users to read their own tokens"
    ON password_reset_tokens
    FOR SELECT
    TO public
    USING (
        email IN (
            SELECT email 
            FROM admin_users
        )
    );

-- Verify policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'password_reset_tokens'
        AND policyname = 'Allow public to insert tokens'
    ) THEN
        RAISE EXCEPTION 'Insert policy was not created successfully';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'password_reset_tokens'
        AND policyname = 'Allow users to read their own tokens'
    ) THEN
        RAISE EXCEPTION 'Select policy was not created successfully';
    END IF;
END $$;