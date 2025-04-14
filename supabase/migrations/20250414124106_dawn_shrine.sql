-- Drop existing functions and policies
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;
DROP POLICY IF EXISTS "Allow public to subscribe" ON newsletter_subscribers;

-- Recreate the subscribe function with better error handling
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
    p_email text
) RETURNS uuid AS $$
DECLARE
    v_subscriber_id uuid;
    v_confirmation_token text;
    v_existing_subscriber newsletter_subscribers%ROWTYPE;
BEGIN
    -- Check if subscriber exists
    SELECT * INTO v_existing_subscriber
    FROM newsletter_subscribers
    WHERE email = p_email;

    -- Generate new confirmation token
    v_confirmation_token := encode(gen_random_bytes(32), 'hex');

    IF v_existing_subscriber.id IS NOT NULL THEN
        -- If already confirmed and not unsubscribed, raise error
        IF v_existing_subscriber.confirmed AND v_existing_subscriber.unsubscribed_at IS NULL THEN
            RAISE EXCEPTION 'Email already subscribed';
        END IF;

        -- If unsubscribed, raise error
        IF v_existing_subscriber.unsubscribed_at IS NOT NULL THEN
            RAISE EXCEPTION 'Email previously unsubscribed';
        END IF;

        -- Update existing unconfirmed subscription
        UPDATE newsletter_subscribers
        SET
            confirmation_token = v_confirmation_token,
            created_at = now()
        WHERE id = v_existing_subscriber.id
        RETURNING id INTO v_subscriber_id;
    ELSE
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
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Email already exists';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Subscription error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new RLS policy
CREATE POLICY "Allow public to subscribe"
    ON newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (
        email IS NOT NULL
        AND confirmed = false
        AND unsubscribed_at IS NULL
        AND NOT EXISTS (
            SELECT 1
            FROM newsletter_subscribers
            WHERE 
                newsletter_subscribers.email = NEW.email
                AND confirmed = true
                AND unsubscribed_at IS NULL
        )
    );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO public;