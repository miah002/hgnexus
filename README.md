# HG Nexus

Storefront for **HIGHGROUNDS\*** — Philippine tech resale (consoles, handhelds, laptops, PC parts).

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript. Every route is statically
prerendered.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Pages

| Route          | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `/`            | Full-bleed product bands, trust principles, buyback section   |
| `/shop`        | Catalog grid, sectioned by category                            |
| `/shop/[slug]` | Single unit: specs, test log, grade, warranty                  |
| `/sell`        | "We buy your old tech" — the sourcing engine                   |

## Before going live

1. **Set the Messenger link.** `lib/site.ts` has `messenger` and `facebook` pointing at
   `REPLACE_WITH_PAGE_USERNAME`. Every call to action on the site routes through these, so
   nothing converts until they are real.
2. **Add product photos.** Drop files in `public/products/`, then set `image` on the product in
   `lib/products.ts` (e.g. `image: "/products/ps5-disc.jpg"`). Until then a placeholder glyph
   renders. Shoot the actual unit on a plain dark or plain light background, centered — the
   layout is built around large product photography and stays sparse without it.
3. **Check prices** in `lib/products.ts` against current market before publishing.

## Managing inventory

All stock lives in `lib/products.ts`. Add a unit by appending to the `products` array. Mark one
sold with `status: "sold"` — it drops off `/shop` while its page stays reachable.

- Statuses: `available`, `incoming`, `reserved`, `sold`
- Grades: `New`, `A`, `B`, `C` — buyer-facing copy for each is in `gradeCopy`

## Design system

Brand tokens are defined once in `app/globals.css` under `@theme`:

| Token     | Hex       | Use                            |
| --------- | --------- | ------------------------------ |
| `summit`  | `#0E1214` | Page background                |
| `panel`   | `#1C2429` | Cards, panels                  |
| `gold`    | `#C9A227` | One accent per view, maximum   |
| `verdant` | `#1E9E6A` | Structural marks (test checks) |
| `signal`  | `#DC4030` | Markdowns and urgency only     |
| `steel`   | `#8B949C` | Secondary text                 |
| `ash`     | `#F4F4F2` | Light bands, primary text      |
| `mist`    | `#E6E6E2` | Tile surfaces on light bands   |

Type: Space Grotesk (display) + Inter (body), loaded via `next/font`.

House rules: one gold element per view, gold never on white, no gradients, glows or RGB.

Layout follows a reference storefront: marketing pages use full-bleed bands with the product
name bottom-left and a status pill bottom-right; the shop uses a denser catalog grid with small
type. Type stays small and quiet — only centered statements run large.

## Deploying

Import the repo on Vercel — it detects Next.js with no configuration needed. Any static host
works too, since every route prerenders.
