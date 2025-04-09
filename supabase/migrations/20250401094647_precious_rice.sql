/*
  # Fix HTTP request construction
  
  1. Changes
    - Fix HTTP request type casting
    - Update trigger function to use correct HTTP request format
*/

-- Create or replace the trigger function with fixed HTTP request
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
    supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
    service_role_key text;
    http_request extensions.http_request;
    http_response extensions.http_response;
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

    -- Construct HTTP request properly
    http_request := extensions.http_request(
        url := supabase_url || '/functions/v1/contact-notification',
        method := 'POST',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || service_role_key,
            'Content-Type', 'application/json'
        ),
        body := jsonb_build_object('record', row_to_json(NEW))::text
    );

    -- Call the Edge Function
    BEGIN
        http_response := extensions.http(http_request);

        -- Log the response
        PERFORM log_contact_request_event(
            NEW.id,
            'EDGE_FUNCTION_RESPONSE',
            CASE 
                WHEN http_response.status BETWEEN 200 AND 299 THEN 'success'
                ELSE 'failed'
            END,
            'Received response from edge function',
            jsonb_build_object(
                'status', http_response.status,
                'body', http_response.content
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