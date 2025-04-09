/*
  # Fix contact request logging
  
  1. Changes
    - Create contact_request_logs table if not exists
    - Add proper indexes for performance
    - Update logging function with better error handling
*/

-- Create contact_request_logs table if not exists
CREATE TABLE IF NOT EXISTS contact_request_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_request_id uuid REFERENCES contact_requests(id),
    event_type text NOT NULL,
    status text,
    message text,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS contact_request_logs_contact_request_id_idx 
ON contact_request_logs(contact_request_id);

CREATE INDEX IF NOT EXISTS contact_request_logs_created_at_idx 
ON contact_request_logs(created_at DESC);

-- Enable RLS
ALTER TABLE contact_request_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read logs" ON contact_request_logs;
DROP POLICY IF EXISTS "Allow service role to insert logs" ON contact_request_logs;

-- Create policy for authenticated users to read logs
CREATE POLICY "Allow authenticated users to read logs"
    ON contact_request_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for service role to insert logs
CREATE POLICY "Allow service role to insert logs"
    ON contact_request_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create or replace logging function with better error handling
CREATE OR REPLACE FUNCTION log_contact_request_event(
    p_contact_request_id uuid,
    p_event_type text,
    p_status text,
    p_message text,
    p_details jsonb DEFAULT NULL
) RETURNS void AS $$
BEGIN
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message,
        details,
        created_at
    ) VALUES (
        p_contact_request_id,
        p_event_type,
        p_status,
        p_message,
        p_details,
        now()
    );
EXCEPTION WHEN OTHERS THEN
    -- Log error to PostgreSQL logs but don't fail
    RAISE WARNING 'Failed to log contact request event: % %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON TABLE contact_request_logs TO postgres, authenticated, service_role;

-- Verify setup
DO $$
BEGIN
    -- Verify table exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'contact_request_logs'
    ) THEN
        RAISE EXCEPTION 'contact_request_logs table does not exist';
    END IF;

    -- Verify logging function
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'log_contact_request_event'
    ) THEN
        RAISE EXCEPTION 'log_contact_request_event function does not exist';
    END IF;

    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'contact_request_logs'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on contact_request_logs';
    END IF;
END $$;