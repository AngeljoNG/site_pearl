-- Drop existing functions and policies
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;

-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
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

    -- Insert new subscriber or update existing one
    INSERT INTO newsletter_subscribers (
        email,
        confirmation_token,
        confirmed,
        created_at,
        confirmed_at,
        unsubscribed_at
    ) VALUES (
        p_email,
        v_confirmation_token,
        false,
        now(),
        NULL,
        NULL
    )
    ON CONFLICT (email) DO UPDATE SET
        confirmation_token = EXCLUDED.confirmation_token,
        confirmed = false,
        created_at = EXCLUDED.created_at,
        confirmed_at = NULL,
        unsubscribed_at = NULL
    WHERE 
        newsletter_subscribers.confirmed = false 
        OR newsletter_subscribers.unsubscribed_at IS NOT NULL
    RETURNING id INTO v_subscriber_id;

    IF v_subscriber_id IS NULL THEN
        RAISE EXCEPTION 'Email already subscribed';
    END IF;

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

-- Create RLS policies
CREATE POLICY "Allow public to subscribe"
    ON newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (
        email IS NOT NULL
        AND confirmed = false
        AND unsubscribed_at IS NULL
    );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO public;
GRANT EXECUTE ON FUNCTION confirm_newsletter_subscription TO public;
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter TO public;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmation_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmed ON newsletter_subscribers(confirmed);