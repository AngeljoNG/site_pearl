/*
  # Fix contact form trigger configuration
  
  1. Changes
    - Enable required extensions
    - Create trigger function with proper URL handling
    - Update trigger on contact_requests table
    - Add proper error handling and logging
*/

-- Enable required extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;

-- Create or replace the trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
  supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
  service_role_key text := current_setting('supabase.service_role_key', true);
  response_status int;
  response_body text;
BEGIN
  -- Log the attempt
  RAISE NOTICE 'Attempting to send notification for contact request %', NEW.id;

  -- Call the Edge Function using extensions schema
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
  RAISE NOTICE 'Edge function response: Status %, Body %', response_status, response_body;

  -- Check response status
  IF response_status >= 200 AND response_status < 300 THEN
    RAISE NOTICE 'Successfully sent notification for contact request %', NEW.id;
  ELSE
    RAISE WARNING 'Failed to send notification for contact request %. Status: %, Response: %',
      NEW.id, response_status, response_body;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent insert
    RAISE WARNING 'Error in handle_new_contact_request: % %', SQLERRM, SQLSTATE;
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

-- Verify the function exists and is properly configured
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'handle_new_contact_request'
  ) THEN
    RAISE EXCEPTION 'handle_new_contact_request function does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_contact_request_created'
  ) THEN
    RAISE EXCEPTION 'on_contact_request_created trigger does not exist';
  END IF;
END $$;