-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

-- Create the trigger function with fixed row reference
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    v_payload jsonb;
BEGIN
    -- Construct the payload using TG_ARGV[0] instead of NEW
    v_payload := jsonb_build_object(
        'record', jsonb_build_object(
            'id', TG_ARGV[0].id,
            'name', TG_ARGV[0].name,
            'email', TG_ARGV[0].email,
            'phone', TG_ARGV[0].phone,
            'request_type', TG_ARGV[0].request_type,
            'message', TG_ARGV[0].message,
            'created_at', TG_ARGV[0].created_at
        )
    );

    -- Log start of processing
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        TG_ARGV[0].id,
        'TRIGGER_START',
        'processing',
        'Starting to process contact request'
    );

    -- Call the Edge Function using http extension
    PERFORM http((
        'POST',
        'https://gwiyyjttieopbdcfnlga.supabase.co/functions/v1/contact-notification',
        ARRAY[
            ('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a'),
            ('Content-Type', 'application/json')
        ],
        'application/json',
        v_payload::text
    ));

    -- Log success
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        TG_ARGV[0].id,
        'NOTIFICATION_SENT',
        'success',
        'Successfully sent notification'
    );

    RETURN TG_ARGV[0];
EXCEPTION WHEN OTHERS THEN
    -- Log any errors
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message,
        details
    ) VALUES (
        TG_ARGV[0].id,
        'ERROR',
        'failed',
        'Error in trigger: ' || SQLERRM,
        jsonb_build_object(
            'error', SQLERRM,
            'state', SQLSTATE
        )
    );
    
    RAISE WARNING 'Error in contact notification trigger: % %', SQLERRM, SQLSTATE;
    RETURN TG_ARGV[0];
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger with proper argument passing
CREATE TRIGGER on_contact_request_created
    AFTER INSERT ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_contact_request(NEW);

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "http";

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, authenticated, service_role;