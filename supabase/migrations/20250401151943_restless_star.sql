/*
  # Simplify contact notification system
  
  1. Changes
    - Remove complex HTTP trigger
    - Use pg_notify for simple notification
    - Keep logging for debugging
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Drop existing function and recreate it
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
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
            'name', NEW.name,
            'email', NEW.email
        )
    );

    -- Send notification with contact request data
    PERFORM pg_notify(
        'contact_requests',
        jsonb_build_object(
            'id', NEW.id,
            'name', NEW.name,
            'email', NEW.email,
            'phone', NEW.phone,
            'request_type', NEW.request_type,
            'message', NEW.message,
            'created_at', NEW.created_at
        )::text
    );

    -- Log notification sent
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        NEW.id,
        'NOTIFICATION_SENT',
        'success',
        'Successfully sent notification'
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
            'state', SQLSTATE,
            'contact_id', NEW.id
        )
    );
    
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, authenticated, service_role;