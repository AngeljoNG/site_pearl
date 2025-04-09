-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to insert tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow users to read their own tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Service role can manage tokens" ON password_reset_tokens;

-- Create new policies with broader permissions
CREATE POLICY "Allow public storage access"
    ON password_reset_tokens
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Verify policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'password_reset_tokens'
        AND policyname = 'Allow public storage access'
    ) THEN
        RAISE EXCEPTION 'Policy was not created successfully';
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON password_reset_tokens TO anon;
GRANT ALL ON password_reset_tokens TO authenticated;
GRANT ALL ON password_reset_tokens TO service_role;

-- Verify table exists and RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'password_reset_tokens'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'Table password_reset_tokens does not exist or RLS is not enabled';
    END IF;
END $$;