-- Migration: Affiliate-friendly flag on product pages

ALTER TABLE public.product_pages
  ADD COLUMN IF NOT EXISTS is_affiliate_friendly BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.product_pages.is_affiliate_friendly IS
  'When true, this product page is intended for affiliate partner use';
