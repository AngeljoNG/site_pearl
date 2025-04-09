/*
  # Add authorized users

  1. Create authorized users
    - Add initial admin users with specific emails
    - Set up secure passwords
*/

-- Create users with secure passwords
DO $$
BEGIN
  -- Create user: joelle@nguyen.eu
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'joelle@nguyen.eu'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'joelle@nguyen.eu',
      crypt('temporaryPassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;

  -- Create user: pearl@nguyen.eu
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'pearl@nguyen.eu'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pearl@nguyen.eu',
      crypt('temporaryPassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;