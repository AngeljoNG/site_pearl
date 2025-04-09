/*
  # Fix authentication configuration

  1. Updates
    - Ensure auth schema is properly configured
    - Set up proper constraints for auth users
    - Enable required extensions
    - Update existing users

  2. Security
    - Maintain existing security policies
    - Ensure proper password encryption
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Make sure the auth.users table has the correct structure
DO $$ 
BEGIN
  -- Only run if table exists but needs updates
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
  ) THEN
    -- Add any missing columns
    BEGIN
      ALTER TABLE auth.users 
        ADD COLUMN IF NOT EXISTS encrypted_password text,
        ADD COLUMN IF NOT EXISTS email_confirmed_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS last_sign_in_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS raw_app_meta_data jsonb,
        ADD COLUMN IF NOT EXISTS raw_user_meta_data jsonb,
        ADD COLUMN IF NOT EXISTS is_super_admin boolean,
        ADD COLUMN IF NOT EXISTS created_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS phone text,
        ADD COLUMN IF NOT EXISTS phone_confirmed_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS confirmation_token text,
        ADD COLUMN IF NOT EXISTS email_change_token text,
        ADD COLUMN IF NOT EXISTS recovery_token text;
    EXCEPTION WHEN duplicate_column THEN
      -- Column already exists, ignore
    END;
  END IF;
END $$;

-- Update existing users
DO $$ 
BEGIN
  -- Update joelle@nguyen.eu
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'joelle@nguyen.eu'
  ) THEN
    UPDATE auth.users
    SET 
      encrypted_password = crypt('temporaryPassword123', gen_salt('bf')),
      email_confirmed_at = NOW(),
      updated_at = NOW()
    WHERE email = 'joelle@nguyen.eu';
  ELSE
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      'joelle@nguyen.eu',
      crypt('temporaryPassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;

  -- Update pearl@nguyen.eu
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'pearl@nguyen.eu'
  ) THEN
    UPDATE auth.users
    SET 
      encrypted_password = crypt('temporaryPassword123', gen_salt('bf')),
      email_confirmed_at = NOW(),
      updated_at = NOW()
    WHERE email = 'pearl@nguyen.eu';
  ELSE
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      'pearl@nguyen.eu',
      crypt('temporaryPassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;