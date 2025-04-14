-- Drop unused functions and triggers
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

-- Drop unused extensions
DROP EXTENSION IF EXISTS "http";
DROP EXTENSION IF EXISTS "pg_net";

-- Keep only necessary tables and their policies
CREATE TABLE IF NOT EXISTS contact_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    request_type text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now(),
    status text DEFAULT 'sent'
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
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