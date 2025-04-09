/*
  # Fix contact form trigger configuration
  
  1. Changes
    - Enable required extensions
    - Create trigger function with proper URL handling
    - Update trigger on contact_requests table
*/

-- Enable required extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;

-- Create or replace the trigger function with hardcoded URL
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
DECLARE
  supabase_url text := 'https://gwiyyjttieopbdcfnlga.supabase.co';
  service_role_key text := current_setting('supabase.service_role_key', true);
BEGIN
  -- Call the Edge Function using extensions schema
  PERFORM
    extensions.http_post(
      url := supabase_url || '/functions/v1/contact-notification',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || service_role_key,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))::text
    );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent insert
    RAISE WARNING 'Error in handle_new_contact_request: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
CREATE TRIGGER on_contact_request_created
  AFTER INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_contact_request();