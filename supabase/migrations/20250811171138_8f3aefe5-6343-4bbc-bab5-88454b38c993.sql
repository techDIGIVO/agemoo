-- Strengthen RLS for community_members to prevent data exposure
-- 1) Add user_id column (nullable to avoid breaking existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_members'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.community_members ADD COLUMN user_id uuid;
  END IF;
END $$;

-- 2) Ensure RLS is enabled (idempotent)
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- 3) Index for performance on user_id
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);

-- 4) Replace overly permissive policies
DROP POLICY IF EXISTS "Only authenticated users can view community members" ON public.community_members;
DROP POLICY IF EXISTS "Anyone can join the community" ON public.community_members;

-- 5) Principle of least privilege policies
CREATE POLICY "Users can view their own community member record"
ON public.community_members
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own community member record"
ON public.community_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community member record"
ON public.community_members
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community member record"
ON public.community_members
FOR DELETE
USING (auth.uid() = user_id);

-- 6) Ensure updated_at is maintained automatically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_community_members_updated_at'
  ) THEN
    CREATE TRIGGER set_community_members_updated_at
    BEFORE UPDATE ON public.community_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;