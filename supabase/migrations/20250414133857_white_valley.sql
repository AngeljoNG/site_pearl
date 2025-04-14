-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

-- Create the trigger function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a';
    request_data jsonb;
BEGIN
    -- Construct request data
    request_data := jsonb_build_object(
        'record', jsonb_build_object(
            'id', NEW.id,
            'name', NEW.name,
            'email', NEW.email,
            'phone', NEW.phone,
            'request_type', NEW.request_type,
            'message', NEW.message,
            'created_at', NEW.created_at
        )
    );

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

    -- Make HTTP request to Edge Function
    PERFORM
        net.http_post(
            url := supabase_url || '/functions/v1/contact-notification',
            headers := jsonb_build_object(
                'Authorization', 'Bearer ' || service_role_key,
                'Content-Type', 'application/json'
            ),
            body := request_data
        );

    -- Log successful call
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        NEW.id,
        'EDGE_FUNCTION_CALLED',
        'success',
        'Successfully called Edge Function'
    );

    -- Update contact request status
    UPDATE contact_requests
    SET status = 'processing'
    WHERE id = NEW.id;

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
    
    RAISE WARNING 'Error in contact notification trigger: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
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
    -- Verify trigger function
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'handle_new_contact_request'
    ) THEN
        RAISE EXCEPTION 'Trigger function was not created successfully';
    END IF;

    -- Verify trigger
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_contact_request_created'
    ) THEN
        RAISE EXCEPTION 'Trigger was not created successfully';
    END IF;

    -- Verify pg_net extension
    IF NOT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'pg_net'
    ) THEN
        RAISE EXCEPTION 'pg_net extension is not installed';
    END IF;
END $$;