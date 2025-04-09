/*
  # Fix service role key configuration
  
  1. Changes
    - Set up service role key properly
    - Update trigger function to use environment variable
*/

-- Create a function to get the service role key
CREATE OR REPLACE FUNCTION get_service_role_key()
RETURNS text AS $$
BEGIN
    -- First try getting it from custom settings
    RETURN COALESCE(
        current_setting('app.settings.service_role_key', true),
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aXl5anR0aWVvcGJkY2ZubGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzE4MTQyMCwiZXhwIjoyMDU4NzU3NDIwfQ.e096fda0116a4832546aacc047d3b1ec7c38e4222144aa0c41e730eb6088a84a'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger function to use the new function
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

    -- Get service role key using the new function
    BEGIN
        service_role_key := get_service_role_key();
        IF service_role_key IS NULL THEN
            RAISE EXCEPTION 'Service role key not found';
        END IF;

        -- Log successful key retrieval
        PERFORM log_contact_request_event(
            NEW.id,
            'KEY_RETRIEVAL',
            'success',
            'Successfully retrieved service role key'
        );
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
        'Attempting to call edge function',
        jsonb_build_object(
            'url', supabase_url || '/functions/v1/contact-notification'
        )
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