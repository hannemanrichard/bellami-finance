-- Speed up onsale size filtering: scope pages → items by size → stocked inventory.

CREATE INDEX IF NOT EXISTS items_size_idx
  ON public.items (size);

CREATE INDEX IF NOT EXISTS product_page_items_item_id_idx
  ON public.product_page_items (item_id);

CREATE INDEX IF NOT EXISTS product_page_items_page_id_idx
  ON public.product_page_items (product_page_id);

CREATE INDEX IF NOT EXISTS inventory_item_id_qty_idx
  ON public.inventory (item_id)
  WHERE quantity >= 1;
