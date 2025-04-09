/*
  # Fix trigger configuration and add more logging
  
  1. Changes
    - Add more detailed logging
    - Fix service role key access
    - Ensure proper permissions
    - Add error tracking table
*/

-- Create error tracking table
CREATE TABLE IF NOT EXISTS contact_request_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_request_id uuid REFERENCES contact_requests(id),
    event_type text NOT NULL,
    status text,
    message text,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on the logs table
ALTER TABLE contact_request_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read logs
CREATE POLICY "Allow authenticated users to read logs"
    ON contact_request_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a function to log events
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
        details
    ) VALUES (
        p_contact_request_id,
        p_event_type,
        p_status,
        p_message,
        p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger function with improved logging
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text;
    response_status int;
    response_body text;
BEGIN
    -- Log start of processing
    PERFORM log_contact_request_event(
        NEW.id,
        'TRIGGER_START',
        'processing',
        'Starting to process contact request'
    );

    -- Get service role key
    BEGIN
        service_role_key := current_setting('supabase.service_role_key', true);
        IF service_role_key IS NULL THEN
            RAISE EXCEPTION 'Service role key not found';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        PERFORM log_contact_request_event(
            NEW.id,
            'ERROR',
            'failed',
            'Failed to get service role key',
            jsonb_build_object('error', SQLERRM)
        );
        RAISE WARNING 'Failed to get service role key: %', SQLERRM;
        RETURN NEW;
    END;

    -- Log attempt to call edge function
    PERFORM log_contact_request_event(
        NEW.id,
        'EDGE_FUNCTION_CALL',
        'attempting',
        'Attempting to call edge function'
    );

    -- Call the Edge Function
    BEGIN
        SELECT
            status, content
        INTO
            response_status, response_body
        FROM
            extensions.http((
                'POST',
                supabase_url || '/functions/v1/contact-notification',
                ARRAY[
                    ('Authorization', 'Bearer ' || service_role_key),
                    ('Content-Type', 'application/json')
                ],
                'application/json',
                jsonb_build_object('record', row_to_json(NEW))::text
            ));

        -- Log the response
        PERFORM log_contact_request_event(
            NEW.id,
            'EDGE_FUNCTION_RESPONSE',
            CASE 
                WHEN response_status BETWEEN 200 AND 299 THEN 'success'
                ELSE 'failed'
            END,
            'Received response from edge function',
            jsonb_build_object(
                'status', response_status,
                'body', response_body
            )
        );

    EXCEPTION WHEN OTHERS THEN
        PERFORM log_contact_request_event(
            NEW.id,
            'ERROR',
            'failed',
            'Failed to call edge function',
            jsonb_build_object('error', SQLERRM)
        );
        RAISE WARNING 'Failed to call edge function: %', SQLERRM;
    END;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log any unexpected errors
    PERFORM log_contact_request_event(
        NEW.id,
        'ERROR',
        'failed',
        'Unexpected error in trigger',
        jsonb_build_object(
            'error', SQLERRM,
            'state', SQLSTATE
        )
    );
    RAISE WARNING 'Unexpected error in handle_new_contact_request: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
CREATE TRIGGER on_contact_request_created
    AFTER INSERT ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_contact_request();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON TABLE contact_request_logs TO postgres, authenticated, service_role;

-- Verify everything is set up correctly
DO $$
BEGIN
    -- Verify extensions
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'http'
    ) THEN
        RAISE EXCEPTION 'HTTP extension is not installed';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
    ) THEN
        RAISE EXCEPTION 'pg_net extension is not installed';
    END IF;

    -- Verify trigger function
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'handle_new_contact_request'
    ) THEN
        RAISE EXCEPTION 'handle_new_contact_request function does not exist';
    END IF;

    -- Verify trigger
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_contact_request_created'
    ) THEN
        RAISE EXCEPTION 'on_contact_request_created trigger does not exist';
    END IF;

    -- Verify logging function
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'log_contact_request_event'
    ) THEN
        RAISE EXCEPTION 'log_contact_request_event function does not exist';
    END IF;
END $$;