-- Migration: On-sale flag for product pages (storefront /onsale only)

ALTER TABLE public.product_pages
  ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.product_pages.is_on_sale IS
  'When true, page appears on the storefront onsale page and is hidden from the home catalog';
