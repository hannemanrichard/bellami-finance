-- Track which storefront route produced a lead (e.g. /onsale/newpage).

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source text NULL;

COMMENT ON COLUMN public.leads.source IS
  'Storefront route that created the lead, e.g. /onsale or /onsale/{slug}.';

CREATE INDEX IF NOT EXISTS leads_source_idx
  ON public.leads (source)
  WHERE source IS NOT NULL;
