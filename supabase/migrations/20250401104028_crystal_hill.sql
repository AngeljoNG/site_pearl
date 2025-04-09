-- Drop existing function and recreate it with proper error handling
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a';
    http_response extensions.http_response;
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
        jsonb_build_object('contact_id', NEW.id)
    );

    -- Make the HTTP request and store the response
    http_response := extensions.http((
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
            WHEN http_response.status BETWEEN 200 AND 299 THEN 'success'
            ELSE 'failed'
        END,
        CASE 
            WHEN http_response.status BETWEEN 200 AND 299 THEN 'Successfully called notification function'
            ELSE 'Failed to call notification function'
        END,
        jsonb_build_object(
            'status', http_response.status,
            'response', http_response.content,
            'headers', http_response.headers
        )
    );

    -- If the response status is not successful, raise an exception
    IF http_response.status < 200 OR http_response.status >= 300 THEN
        RAISE EXCEPTION 'Edge function returned status %: %', 
            http_response.status, 
            http_response.content;
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

-- Verify setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_contact_request_created'
    ) THEN
        RAISE EXCEPTION 'Trigger was not created successfully';
    END IF;
END $$;