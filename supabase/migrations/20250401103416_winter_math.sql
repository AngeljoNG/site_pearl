/*
  # Fix contact notification trigger
  
  1. Changes
    - Simplify trigger function
    - Add better error handling
    - Ensure proper logging
*/

-- Drop existing function and recreate it
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a';
BEGIN
    -- Log start of processing
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        NEW.id,
        'TRIGGER_START',
        'processing',
        'Starting to process contact request'
    );

    -- Call the Edge Function
    PERFORM extensions.http((
        'POST',
        supabase_url || '/functions/v1/contact-notification',
        ARRAY[
            ('Authorization', 'Bearer ' || service_role_key),
            ('Content-Type', 'application/json')
        ],
        'application/json',
        jsonb_build_object('record', row_to_json(NEW))::text
    ));

    -- Log successful trigger execution
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        NEW.id,
        'TRIGGER_COMPLETE',
        'success',
        'Successfully called notification function'
    );

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