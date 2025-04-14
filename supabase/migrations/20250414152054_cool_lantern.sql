-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP FUNCTION IF EXISTS handle_new_contact_request CASCADE;

-- Create the trigger function with async notification
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
BEGIN
    -- First update the status to processing
    UPDATE contact_requests 
    SET status = 'processing' 
    WHERE id = NEW.id;

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

    -- Use pg_notify to handle the notification asynchronously
    -- This prevents the trigger from waiting for the HTTP response
    PERFORM pg_notify(
        'contact_notifications',
        json_build_object(
            'id', NEW.id,
            'name', NEW.name,
            'email', NEW.email,
            'phone', NEW.phone,
            'request_type', NEW.request_type,
            'message', NEW.message,
            'created_at', NEW.created_at,
            'service_role_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a'
        )::text
    );

    -- Log notification queued
    INSERT INTO contact_request_logs (
        contact_request_id,
        event_type,
        status,
        message
    ) VALUES (
        NEW.id,
        'NOTIFICATION_QUEUED',
        'pending',
        'Contact notification queued for processing'
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_request_logs_request_id ON contact_request_logs(contact_request_id);
CREATE INDEX IF NOT EXISTS idx_contact_request_logs_created_at ON contact_request_logs(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON contact_requests TO anon;
GRANT ALL ON contact_requests TO authenticated;
GRANT ALL ON contact_requests TO service_role;
GRANT ALL ON contact_request_logs TO anon;
GRANT ALL ON contact_request_logs TO authenticated;
GRANT ALL ON contact_request_logs TO service_role;