-- Drop the duplicate foreign key constraint on services.vendor_id
-- The original services_vendor_id_fkey references auth.users(id) which is correct.
-- A second constraint services_vendor_id_fkey1 was added (likely referencing profiles(id))
-- which causes inserts to fail when the profile row doesn't yet exist.

DO $$
BEGIN
  -- Drop the duplicate FK if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'services_vendor_id_fkey1'
      AND table_name = 'services'
  ) THEN
    ALTER TABLE public.services DROP CONSTRAINT services_vendor_id_fkey1;
    RAISE NOTICE 'Dropped services_vendor_id_fkey1';
  END IF;

  -- Also check bookings for duplicate FKs
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_vendor_id_fkey1'
      AND table_name = 'bookings'
  ) THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_vendor_id_fkey1;
    RAISE NOTICE 'Dropped bookings_vendor_id_fkey1';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_client_id_fkey1'
      AND table_name = 'bookings'
  ) THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_client_id_fkey1;
    RAISE NOTICE 'Dropped bookings_client_id_fkey1';
  END IF;

  -- Check gear table too
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'gear_vendor_id_fkey1'
      AND table_name = 'gear'
  ) THEN
    ALTER TABLE public.gear DROP CONSTRAINT gear_vendor_id_fkey1;
    RAISE NOTICE 'Dropped gear_vendor_id_fkey1';
  END IF;
END $$;
