-- ============================================================
-- VYBE — Fix Database Error Saving New User
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Ensure public.profiles exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  instagram_username TEXT,
  allow_anonymous BOOLEAN DEFAULT TRUE,
  profile_theme TEXT DEFAULT 'dark' CHECK (profile_theme IN ('dark', 'light', 'gradient')),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Robust handle_new_user function with explicit schema and error-trapping
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  user_name TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Extract username from metadata if provided
  user_name := LOWER(COALESCE(NEW.raw_user_meta_data->>'username', ''));
  user_name := REGEXP_REPLACE(user_name, '[^a-z0-9_]', '', 'g');

  -- Fallback to email prefix
  IF char_length(user_name) < 3 THEN
    user_name := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '', 'g'));
  END IF;

  -- Ensure minimum 3 characters
  IF char_length(user_name) < 3 THEN
    user_name := 'user' || SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 1 FOR 6);
  END IF;

  -- Truncate to 25 chars
  user_name := SUBSTRING(user_name FROM 1 FOR 25);
  final_username := user_name;

  -- Resolve duplicate usernames
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := SUBSTRING(user_name FROM 1 FOR 20) || counter::TEXT;
  END LOOP;

  -- Insert profile
  INSERT INTO public.profiles (
    user_id,
    username,
    display_name,
    avatar_url,
    allow_anonymous,
    profile_theme,
    is_public
  )
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', final_username),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    TRUE,
    'dark',
    TRUE
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Prevent trigger failure from aborting user registration
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 3. Re-create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
