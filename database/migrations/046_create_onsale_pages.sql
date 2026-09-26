-- Migration: Curated on-sale collection pages (slug storefront routes)
-- Static /onsale still uses product_pages.is_on_sale independently.

CREATE TABLE IF NOT EXISTS public.onsale_pages (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  style integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS onsale_pages_slug_idx
  ON public.onsale_pages (slug);

CREATE INDEX IF NOT EXISTS onsale_pages_status_idx
  ON public.onsale_pages (status);

CREATE TABLE IF NOT EXISTS public.onsale_page_product_pages (
  onsale_page_id bigint NOT NULL
    REFERENCES public.onsale_pages (id) ON DELETE CASCADE,
  product_page_id bigint NOT NULL
    REFERENCES public.product_pages (id) ON DELETE CASCADE,
  display_order integer NULL,
  PRIMARY KEY (onsale_page_id, product_page_id)
);

CREATE INDEX IF NOT EXISTS onsale_page_product_pages_onsale_idx
  ON public.onsale_page_product_pages (onsale_page_id);

CREATE INDEX IF NOT EXISTS onsale_page_product_pages_page_idx
  ON public.onsale_page_product_pages (product_page_id);

COMMENT ON TABLE public.onsale_pages IS
  'Curated on-sale storefront collections at /onsale/[slug]';

COMMENT ON TABLE public.onsale_page_product_pages IS
  'Product pages belonging to an onsale_pages collection (one-to-many)';
