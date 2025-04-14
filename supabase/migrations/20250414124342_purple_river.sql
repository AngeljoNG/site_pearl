-- Drop existing functions and policies
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;

-- Function to subscribe to newsletter with better error handling
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
    p_email text
) RETURNS uuid AS $$
DECLARE
    v_subscriber_id uuid;
    v_confirmation_token text;
    v_existing_subscriber newsletter_subscribers%ROWTYPE;
BEGIN
    -- Check if subscriber exists and get their status
    SELECT * INTO v_existing_subscriber
    FROM newsletter_subscribers
    WHERE email = p_email;

    -- Handle existing subscriber cases
    IF v_existing_subscriber.id IS NOT NULL THEN
        IF v_existing_subscriber.confirmed AND v_existing_subscriber.unsubscribed_at IS NULL THEN
            RAISE EXCEPTION 'Email already subscribed';
        END IF;

        -- Generate new confirmation token
        v_confirmation_token := encode(gen_random_bytes(32), 'hex');

        -- Update existing record
        UPDATE newsletter_subscribers
        SET
            confirmation_token = v_confirmation_token,
            confirmed = false,
            created_at = now(),
            confirmed_at = NULL,
            unsubscribed_at = NULL
        WHERE id = v_existing_subscriber.id
        RETURNING id INTO v_subscriber_id;
    ELSE
        -- Generate confirmation token for new subscriber
        v_confirmation_token := encode(gen_random_bytes(32), 'hex');

        -- Insert new subscriber
        INSERT INTO newsletter_subscribers (
            email,
            confirmation_token,
            confirmed,
            created_at
        ) VALUES (
            p_email,
            v_confirmation_token,
            false,
            now()
        )
        RETURNING id INTO v_subscriber_id;
    END IF;

    RETURN v_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policy
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