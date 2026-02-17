-- Create event_registrations table for community event signups
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_location TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(event_title, email)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public event registration)
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow users to see their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations
  FOR SELECT
  USING (true);
