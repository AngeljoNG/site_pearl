-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

-- Create the trigger function with proper HTTP handling
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    v_response_status int;
    v_response_body text;
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
            'request_id', NEW.id,
            'request_type', NEW.request_type
        )
    );

    -- Make HTTP request to Edge Function
    SELECT
        status::int,
        content::text
    INTO
        v_response_status,
        v_response_body
    FROM
        http((
            'POST',
            'https://gwiyyjttieopbdcfnlga.supabase.co/functions/v1/contact-notification',
            ARRAY[
                ('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a'),
                ('Content-Type', 'application/json')
            ],
            'application/json',
            jsonb_build_object(
                'record', jsonb_build_object(
                    'id', NEW.id,
                    'name', NEW.name,
                    'email', NEW.email,
                    'phone', NEW.phone,
                    'request_type', NEW.request_type,
                    'message', NEW.message,
                    'created_at', NEW.created_at
                )
            )::text
        ));

    -- Log response
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
            WHEN v_response_status BETWEEN 200 AND 299 THEN 'success'
            ELSE 'failed'
        END,
        CASE 
            WHEN v_response_status BETWEEN 200 AND 299 THEN 'Successfully called Edge Function'
            ELSE 'Failed to call Edge Function'
        END,
        jsonb_build_object(
            'status', v_response_status,
            'response', v_response_body
        )
    );

    -- Update status based on response
    UPDATE contact_requests 
    SET status = CASE 
        WHEN v_response_status BETWEEN 200 AND 299 THEN 'sent'
        ELSE 'failed'
    END
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
            'state', SQLSTATE
        )
    );
    
    -- Update status to failed
    UPDATE contact_requests 
    SET status = 'failed'
    WHERE id = NEW.id;
    
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
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, authenticated, service_role;

-- Verify setup
DO $$
BEGIN
    -- Verify extensions
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'http'
    ) THEN
        RAISE EXCEPTION 'HTTP extension is not installed';
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