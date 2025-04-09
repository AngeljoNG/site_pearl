/*
  # Fix HTTP request in trigger function
  
  1. Changes
    - Use direct http function call
    - Simplify request structure
    - Better error handling
*/

-- Drop existing function and recreate it
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a';
    response_status int;
    response_body text;
BEGIN
    -- Log start of processing
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message,
        details
    ) VALUES (
        NEW.id,
        'TRIGGER_START',
        'processing',
        'Starting to process contact request',
        jsonb_build_object(
            'contact_id', NEW.id,
            'url', supabase_url || '/functions/v1/contact-notification'
        )
    );

    -- Call the Edge Function using net.http_post
    SELECT 
        status,
        content
    INTO 
        response_status,
        response_body
    FROM net.http_post(
        url := supabase_url || '/functions/v1/contact-notification',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || service_role_key,
            'Content-Type', 'application/json'
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
    );

    -- Log the response
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message,
        details
    ) VALUES (
        NEW.id,
        'EDGE_FUNCTION_RESPONSE',
        CASE 
            WHEN response_status BETWEEN 200 AND 299 THEN 'success'
            ELSE 'failed'
        END,
        CASE 
            WHEN response_status BETWEEN 200 AND 299 THEN 'Successfully called notification function'
            ELSE 'Failed to call notification function'
        END,
        jsonb_build_object(
            'status', response_status,
            'response', response_body
        )
    );

    -- If the response status is not successful, raise a warning but don't fail
    IF response_status < 200 OR response_status >= 300 THEN
        RAISE WARNING 'Edge function returned non-success status %: %', 
            response_status, 
            response_body;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log any errors
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message,
        details
    ) VALUES (
        NEW.id,
        'ERROR',
        'failed',
        'Error in trigger: ' || SQLERRM,
        jsonb_build_object(
            'error', SQLERRM,
            'state', SQLSTATE,
            'contact_id', NEW.id
        )
    );
    
    -- Don't throw the error, just log it
    RAISE WARNING 'Error in contact notification trigger: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
CREATE TRIGGER on_contact_request_created
    AFTER INSERT ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_contact_request();

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA net TO postgres, authenticated, service_role;

-- Verify setup
DO $$
BEGIN
    -- Verify extensions
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
    ) THEN
        RAISE EXCEPTION 'pg_net extension is not installed';
    END IF;

    -- Verify trigger
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_contact_request_created'
    ) THEN
        RAISE EXCEPTION 'Trigger was not created successfully';
    END IF;
END $$;