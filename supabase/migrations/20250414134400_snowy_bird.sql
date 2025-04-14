-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read contact requests" ON contact_requests;

-- Create contact_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    request_type text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now(),
    status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to insert contact requests"
    ON contact_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact requests"
    ON contact_requests
    FOR SELECT
    TO authenticated
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

-- Grant necessary permissions
GRANT ALL ON contact_requests TO anon;
GRANT ALL ON contact_requests TO authenticated;
GRANT ALL ON contact_requests TO service_role;

-- Verify setup
DO $$
BEGIN
    -- Verify table exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'contact_requests'
    ) THEN
        RAISE EXCEPTION 'contact_requests table does not exist';
    END IF;

    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'contact_requests'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on contact_requests';
    END IF;

    -- Verify policies exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'contact_requests'
        AND (policyname = 'Allow public to insert contact requests'
             OR policyname = 'Allow authenticated users to read contact requests')
    ) THEN
        RAISE EXCEPTION 'Policies were not created successfully';
    END IF;
END $$;