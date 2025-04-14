-- Drop all newsletter related objects
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;
DROP FUNCTION IF EXISTS confirm_newsletter_subscription CASCADE;
DROP FUNCTION IF EXISTS unsubscribe_from_newsletter CASCADE;

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    confirmed boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public storage access"
    ON newsletter_subscribers
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON newsletter_subscribers TO anon;
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO service_role;