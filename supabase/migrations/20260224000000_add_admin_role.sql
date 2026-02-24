-- ============================================================
-- Migration: Add admin role to profiles + admin-aware RLS
-- ============================================================

-- 1. Add role column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Add check constraint
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- 2. Helper function: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 3. Update RLS policies to allow admin full access
-- ============================================================

-- ---- profiles ----
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ---- services ----
-- Admins can see ALL services (including inactive)
CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any service"
  ON public.services FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete any service"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- ---- gear ----
CREATE POLICY "Admins can view all gear"
  ON public.gear FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any gear"
  ON public.gear FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete any gear"
  ON public.gear FOR DELETE
  USING (public.is_admin());

-- ---- bookings ----
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any booking"
  ON public.bookings FOR UPDATE
  USING (public.is_admin());

-- ---- applications ----
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any application"
  ON public.applications FOR UPDATE
  USING (public.is_admin());

-- ---- conversations ----
CREATE POLICY "Admins can view all conversations"
  ON public.conversations FOR SELECT
  USING (public.is_admin());

-- ---- messages ----
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.is_admin());

-- ---- newsletter_subscriptions ----
CREATE POLICY "Admins can view all subscriptions"
  ON public.newsletter_subscriptions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update subscriptions"
  ON public.newsletter_subscriptions FOR UPDATE
  USING (public.is_admin());

-- ---- community_members ----
CREATE POLICY "Admins can view all community members"
  ON public.community_members FOR SELECT
  USING (public.is_admin());

-- ---- contact_messages ----
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin());

-- ---- blog_posts ----
CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any blog post"
  ON public.blog_posts FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete any blog post"
  ON public.blog_posts FOR DELETE
  USING (public.is_admin());

-- ---- reviews ----
CREATE POLICY "Admins can view all reviews"
  ON public.reviews FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can delete any review"
  ON public.reviews FOR DELETE
  USING (public.is_admin());

-- ---- event_registrations ----
CREATE POLICY "Admins can update event registrations"
  ON public.event_registrations FOR UPDATE
  USING (public.is_admin());

-- ---- job_applications ----
CREATE POLICY "Admins can update job applications"
  ON public.job_applications FOR UPDATE
  USING (public.is_admin());
