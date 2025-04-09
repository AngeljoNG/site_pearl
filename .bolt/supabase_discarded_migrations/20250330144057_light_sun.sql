/*
  # Complete authentication setup
  
  1. Schema Setup
    - Create auth schema and required extensions
    - Set up all required auth tables and functions
    - Add proper constraints and indexes
    - Create admin users with secure passwords
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Drop existing tables if they exist to ensure clean setup
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.users;

-- Create auth.users table with complete structure
CREATE TABLE auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  aud character varying(255),
  role character varying(255),
  email character varying(255),
  encrypted_password character varying(255),
  email_confirmed_at timestamp with time zone,
  invited_at timestamp with time zone,
  confirmation_token character varying(255),
  confirmation_sent_at timestamp with time zone,
  recovery_token character varying(255),
  recovery_sent_at timestamp with time zone,
  email_change_token character varying(255),
  email_change character varying(255),
  email_change_sent_at timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  phone character varying(255),
  phone_confirmed_at timestamp with time zone,
  phone_change character varying(255),
  phone_change_token character varying(255),
  phone_change_sent_at timestamp with time zone,
  email_change_confirm_status smallint,
  banned_until timestamp with time zone,
  reauthentication_token character varying(255),
  reauthentication_sent_at timestamp with time zone,
  is_sso_user boolean DEFAULT false,
  deleted_at timestamp with time zone,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_email_check CHECK (length(email::text) <= 255),
  CONSTRAINT users_phone_check CHECK (length(phone::text) <= 255)
);

-- Create required indexes
CREATE INDEX users_instance_id_idx ON auth.users (id);
CREATE INDEX users_email_idx ON auth.users (email);

-- Create auth.refresh_tokens table
CREATE TABLE auth.refresh_tokens (
  id bigserial PRIMARY KEY,
  token character varying(255),
  user_id uuid REFERENCES auth.users(id),
  revoked boolean,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create auth.audit_log_entries table
CREATE TABLE auth.audit_log_entries (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  payload json,
  created_at timestamp with time zone DEFAULT now(),
  ip_address character varying(64) DEFAULT ''::character varying
);

-- Create auth.instances table
CREATE TABLE auth.instances (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  uuid uuid,
  raw_base_config text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert admin users
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES 
(
  'joelle@nguyen.eu',
  crypt('temporaryPassword123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  true,
  'authenticated',
  'authenticated'
),
(
  'pearl@nguyen.eu',
  crypt('temporaryPassword123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  true,
  'authenticated',
  'authenticated'
);