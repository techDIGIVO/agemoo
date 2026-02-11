-- Remove overly permissive SELECT policy on newsletter_subscriptions
-- This policy allowed ANY authenticated user to view all subscriber emails
DROP POLICY IF EXISTS "Only authenticated users can view subscriptions" ON public.newsletter_subscriptions;

-- Newsletter subscriptions should not be publicly viewable
-- If admin access is needed in the future, implement proper role-based access control