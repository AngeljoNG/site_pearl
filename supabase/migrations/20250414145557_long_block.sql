-- Drop existing function
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;

-- Recreate the function with proper single row handling
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
    p_email text
) RETURNS SETOF uuid AS $$
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

    RETURN NEXT v_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify function exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'subscribe_to_newsletter'
    ) THEN
        RAISE EXCEPTION 'Function was not created successfully';
    END IF;
END $$;