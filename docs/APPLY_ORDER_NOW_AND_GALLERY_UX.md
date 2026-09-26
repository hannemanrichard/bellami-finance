# Storefront UX: Order Now sticky button + gallery (no zoom)

Apply these changes on project clones so product pages match the current behavior.

**Scope (recent session):**
1. Sticky **Order Now** — submit when lead fields are filled; otherwise animated scroll to the start of the form
2. Product image carousel — swipe / arrows only; no zoom, lightbox, or click-to-enlarge

---

## Files touched

| Action | Path |
|--------|------|
| **Create** | `src/shared/utils/animatedScroll.ts` |
| **Edit** | `src/features/products/presentation/ProductPageView.tsx` |
| **Edit** | `src/features/products/presentation/OrderProductForm.tsx` |
| **Edit** | `src/features/products/presentation/NewProductGallery.tsx` |

No DB migrations, env vars, or package installs required.

---

## 1. Create `src/shared/utils/animatedScroll.ts`

Eased scroll helper (ease-in-out cubic, default ~700ms):

```ts
type AnimatedScrollOptions = {
  durationMs?: number;
  offsetPx?: number;
  block?: "start" | "center";
};

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const getTargetScrollY = (
  element: HTMLElement,
  block: "start" | "center",
  offsetPx: number
): number => {
  const rect = element.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;

  if (block === "center") {
    return absoluteTop - window.innerHeight / 2 + rect.height / 2 - offsetPx;
  }

  return absoluteTop - offsetPx;
};

export const animatedScrollToElement = (
  element: HTMLElement,
  options: AnimatedScrollOptions = {}
): Promise<void> => {
  const { durationMs = 700, offsetPx = 0, block = "center" } = options;
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    Math.min(
      getTargetScrollY(element, block, offsetPx),
      document.documentElement.scrollHeight - window.innerHeight
    )
  );
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) {
    return Promise.resolve();
  }

  const startTime = performance.now();

  return new Promise((resolve) => {
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      resolve();
    };

    requestAnimationFrame(step);
  });
};
```

---

## 2. Edit `OrderProductForm.tsx`

Give the form a stable DOM id so the sticky button can find it:

```tsx
<form
  id="order-product-form"
  onSubmit={form.handleSubmit(handleSubmit)}
  className="space-y-6"
>
```

Keep existing submit button id: `id="order-now-submit-button"`.

Confirm the lead section wrapper still has `id="lead-form-section"` (in `ProductPageView` / `LeadFormSection`).

---

## 3. Edit `ProductPageView.tsx`

### Imports

Add:

```ts
import { animatedScrollToElement } from "@/shared/utils/animatedScroll";
```

### Sticky button logic

Replace `handleStickyButtonClick` (and add helper) with:

```ts
const areLeadFieldsFilled = (form: HTMLFormElement): boolean => {
  const data = new FormData(form);
  const requiredFields = ["fullName", "phone", "commune", "wilaya"] as const;

  return requiredFields.every((field) => {
    const value = data.get(field);
    return typeof value === "string" && value.trim().length > 0;
  });
};

const handleStickyButtonClick = () => {
  const form = document.getElementById(
    "order-product-form"
  ) as HTMLFormElement | null;
  const leadFormSection = document.getElementById("lead-form-section");
  const scrollTarget = leadFormSection ?? form;

  // Fields filled → animated scroll to form start + submit
  if (form && areLeadFieldsFilled(form)) {
    if (scrollTarget) {
      void animatedScrollToElement(scrollTarget, {
        block: "start",
        durationMs: 700,
      });
    }
    form.requestSubmit();
    return;
  }

  // Fields empty → animated scroll to form start only
  if (scrollTarget) {
    void animatedScrollToElement(scrollTarget, {
      block: "start",
      durationMs: 700,
    }).then(() => {
      const submitButton = document.getElementById(
        "order-now-submit-button"
      ) as HTMLElement | null;
      submitButton?.focus({ preventScroll: true });
    });
    return;
  }

  router.push(`?form=visible`, { scroll: false });
  setIsLeadFormVisible(true);
};
```

### Expected behavior

| State | Sticky **Order Now** does |
|-------|---------------------------|
| `fullName`, `phone`, `commune`, `wilaya` all non-empty | Eased scroll to **start** of `#lead-form-section`, then `requestSubmit()` |
| Any of those empty | Eased scroll to **start** of form; focus submit with `preventScroll` |
| Form missing from DOM | Fallback `?form=visible` |

Do **not** use native `scrollIntoView({ behavior: "smooth" })` alone — focus can cancel it. Use `animatedScrollToElement` + `focus({ preventScroll: true })`.

---

## 4. Edit `NewProductGallery.tsx` — disable zoom

### Remove

- `yet-another-react-lightbox` import and CSS
- `Zoom` plugin
- `isLightboxOpen` state
- `<Lightbox … />` block
- Click handlers that open lightbox on images
- Floating Maximize / zoom button
- `cursor-zoom-in` class
- Unused icons: `Maximize2`, `ZoomIn`

### Main slide images

Make images non-interactive (swipe still works via Embla on the track):

```tsx
<div className="relative w-full pointer-events-none select-none">
  <Image
    src={url}
    alt={`${headline} - ${index + 1}`}
    width={800}
    height={1035}
    priority={index === 0}
    draggable={false}
    className="w-full h-auto object-contain max-h-[70vh] rounded-md mx-auto block"
    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 550px, 660px"
  />
</div>
```

### Keep

- Embla swipe
- Prev / next arrow buttons
- Index indicator
- Desktop thumbnail strip (select slide only — not zoom)

### Expected behavior

- Users can **swipe** or use **arrows** / thumbnails
- Images are **not clickable**
- No lightbox / pinch-zoom overlay

---

## 5. Verify on a clone

1. Open a product page with multiple gallery images.
2. Confirm swipe works; clicking the main image does nothing (no zoom).
3. Scroll down past the form; tap sticky **Order Now** with empty fields → animates to the **top of the form**.
4. Fill name, phone, commune, wilaya; tap sticky **Order Now** → scrolls to form start and submits (validation / success same as in-form button).

---

## Optional: copy from this repo

If the clone shares the same tree, copy these files wholesale from this project:

```text
src/shared/utils/animatedScroll.ts
src/features/products/presentation/ProductPageView.tsx
src/features/products/presentation/OrderProductForm.tsx
src/features/products/presentation/NewProductGallery.tsx
```

Then run the app and smoke-test the checklist above.
