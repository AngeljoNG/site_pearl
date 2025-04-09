/*
  # Fix authentication setup

  1. Changes
    - Ensure auth schema is properly configured
    - Set up proper user authentication settings
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update auth settings
ALTER TABLE auth.users 
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN encrypted_password SET NOT NULL;

-- Ensure email confirmations are disabled
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN ('joelle@nguyen.eu', 'pearl@nguyen.eu')
AND email_confirmed_at IS NULL;

-- Update user passwords if needed
UPDATE auth.users
SET encrypted_password = crypt('temporaryPassword123', gen_salt('bf'))
WHERE email IN ('joelle@nguyen.eu', 'pearl@nguyen.eu')
AND encrypted_password IS NULL;