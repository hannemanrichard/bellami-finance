-- Add size-filter toggle and lead objective to curated onsale pages.

ALTER TABLE public.onsale_pages
  ADD COLUMN IF NOT EXISTS is_size_filtered boolean NOT NULL DEFAULT true;

ALTER TABLE public.onsale_pages
  ADD COLUMN IF NOT EXISTS objective text NOT NULL DEFAULT 'onsale_conversion';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'onsale_pages_objective_check'
  ) THEN
    ALTER TABLE public.onsale_pages
      ADD CONSTRAINT onsale_pages_objective_check
      CHECK (
        objective IN (
          'onsale_conversion',
          'onsale_traffic',
          'onsale_message'
        )
      );
  END IF;
END $$;

COMMENT ON COLUMN public.onsale_pages.is_size_filtered IS
  'When true, storefront shows size filter and requires stocked inventory; when false, only name/phone and all collection pages are shown.';

COMMENT ON COLUMN public.onsale_pages.objective IS
  'Lead objective written when a shopper orders from this collection page.';
