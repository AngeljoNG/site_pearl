/*
  # Add database trigger for contact form notifications
  
  1. Changes
    - Create function to handle new contact requests
    - Create trigger to call the function
*/

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
BEGIN
  -- Call the Edge Function
  PERFORM
    net.http_post(
      url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/contact-notification'),
      headers := jsonb_build_object(
        'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
CREATE TRIGGER on_contact_request_created
  AFTER INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_contact_request();