/*
  # Add newsletter subscription system
  
  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `confirmed` (boolean)
      - `confirmation_token` (text)
      - `created_at` (timestamptz)
      - `confirmed_at` (timestamptz)
      - `unsubscribed_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public access
    - Add function for subscription management
*/

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    confirmed boolean DEFAULT false,
    confirmation_token text,
    created_at timestamptz DEFAULT now(),
    confirmed_at timestamptz,
    unsubscribed_at timestamptz
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to subscribe"
    ON newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (
        email IS NOT NULL
        AND confirmed = false
        AND unsubscribed_at IS NULL
    );

-- Function to subscribe to newsletter
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
    p_email text
) RETURNS uuid AS $$
DECLARE
    v_subscriber_id uuid;
    v_confirmation_token text;
BEGIN
    -- Generate confirmation token
    v_confirmation_token := encode(gen_random_bytes(32), 'hex');

    -- Insert or update subscriber
    INSERT INTO newsletter_subscribers (
        email,
        confirmation_token
    ) VALUES (
        p_email,
        v_confirmation_token
    )
    ON CONFLICT (email) DO UPDATE SET
        confirmation_token = v_confirmation_token,
        confirmed = false,
        unsubscribed_at = NULL,
        confirmed_at = NULL
    RETURNING id INTO v_subscriber_id;

    RETURN v_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm subscription
CREATE OR REPLACE FUNCTION confirm_newsletter_subscription(
    p_email text,
    p_token text
) RETURNS boolean AS $$
BEGIN
    UPDATE newsletter_subscribers
    SET 
        confirmed = true,
        confirmed_at = now(),
        confirmation_token = NULL
    WHERE 
        email = p_email
        AND confirmation_token = p_token
        AND confirmed = false
        AND unsubscribed_at IS NULL;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unsubscribe
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter(
    p_email text,
    p_token text
) RETURNS boolean AS $$
BEGIN
    UPDATE newsletter_subscribers
    SET unsubscribed_at = now()
    WHERE 
        email = p_email
        AND confirmation_token = p_token;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO public;
GRANT EXECUTE ON FUNCTION confirm_newsletter_subscription TO public;
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter TO public;