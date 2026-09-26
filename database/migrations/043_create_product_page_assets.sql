-- Migration: Per–product-page media library (affiliate zip download source)
-- Does not replace hero_media, product_page_images, or product_page_testimonials.

CREATE TABLE IF NOT EXISTS public.product_page_assets (
  id bigserial PRIMARY KEY,
  product_page_id bigint NOT NULL REFERENCES public.product_pages (id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  file_name text NULL
);

CREATE INDEX IF NOT EXISTS product_page_assets_page_idx
  ON public.product_page_assets (product_page_id);

COMMENT ON TABLE public.product_page_assets IS
  'Reusable media library for a product page (affiliate downloads); separate from hero/gallery/testimonials';
