-- Drop existing policy
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;

-- Create new policy without referencing NEW
CREATE POLICY "Allow public storage access"
    ON newsletter_subscribers
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Verify policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'newsletter_subscribers'
        AND policyname = 'Allow public storage access'
    ) THEN
        RAISE EXCEPTION 'Policy was not created successfully';
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON newsletter_subscribers TO anon;
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO service_role;