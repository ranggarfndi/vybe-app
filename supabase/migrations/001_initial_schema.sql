-- ============================================================
-- VYBE — Migration SQL (No-Auth, Direct IG & Drops)
-- Salin dan Jalankan di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- 1. Enable extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-initializing (Clean Setup)
DROP TABLE IF EXISTS public.responses CASCADE;
DROP TABLE IF EXISTS public.drops CASCADE;

-- 3. Create DROPS table (No auth.users dependency)
CREATE TABLE public.drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_username TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'SEND_ME_A_SONG',
  question TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'sunshine',
  initial_song_title TEXT,
  initial_song_artist TEXT,
  initial_song_artwork TEXT,
  initial_song_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query
CREATE INDEX idx_drops_ig ON public.drops(instagram_username);
CREATE INDEX idx_drops_created ON public.drops(created_at DESC);

-- 4. Create RESPONSES table
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  message TEXT,
  music_provider TEXT DEFAULT 'spotify',
  music_url TEXT,
  song_title TEXT,
  song_artist TEXT,
  song_artwork_url TEXT,
  preview_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for responses
CREATE INDEX idx_responses_drop_id ON public.responses(drop_id);
CREATE INDEX idx_responses_created ON public.responses(created_at DESC);

-- 5. Enable RLS (Row Level Security) with open policies
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Drops RLS Policies
CREATE POLICY "Anyone can create drops" ON public.drops FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can view active drops" ON public.drops FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update drops" ON public.drops FOR UPDATE USING (TRUE);

-- Responses RLS Policies
CREATE POLICY "Anyone can submit response" ON public.responses FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can view responses" ON public.responses FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update response" ON public.responses FOR UPDATE USING (TRUE);
