-- Drop all newsletter related objects
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP FUNCTION IF EXISTS subscribe_to_newsletter CASCADE;
DROP FUNCTION IF EXISTS confirm_newsletter_subscription CASCADE;
DROP FUNCTION IF EXISTS unsubscribe_from_newsletter CASCADE;