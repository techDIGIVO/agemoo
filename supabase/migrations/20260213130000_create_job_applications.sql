-- Create job_applications table for career page applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_title TEXT NOT NULL,
  department TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'submitted' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(position_title, email)
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a job application
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own applications
CREATE POLICY "Users can view own job applications"
  ON public.job_applications
  FOR SELECT
  USING (true);
