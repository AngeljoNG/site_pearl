-- Drop existing function
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;

-- Recreate the function with proper single row handling
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

    -- Generate confirmation token
    v_confirmation_token := encode(gen_random_bytes(32), 'hex');

    IF v_existing_subscriber.id IS NOT NULL THEN
        -- If already confirmed and not unsubscribed, raise error
        IF v_existing_subscriber.confirmed AND v_existing_subscriber.unsubscribed_at IS NULL THEN
            RAISE EXCEPTION 'Email already subscribed';
        END IF;

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

    -- Return the single UUID
    RETURN v_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO public;

-- Verify function exists and returns correct type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'subscribe_to_newsletter'
        AND prorettype = 'uuid'::regtype
    ) THEN
        RAISE EXCEPTION 'Function was not created successfully with correct return type';
    END IF;
END $$;