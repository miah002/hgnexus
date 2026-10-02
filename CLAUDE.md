# HG Nexus — project context

Storefront for **HIGHGROUNDS+ NEXUS**, a Philippine tech resale business (consoles, handhelds,
laptops, PC parts) run by a single operator out of Santo Tomas, Batangas. This file is the
handoff for anyone — human or agent — picking up web development.

The brand was "HIGHGROUNDS\*" until the owner added NEXUS and switched to a brush wordmark with
a plus sign. Older reference material may still use the old name; never reintroduce it.

Scope: **this website only.** Business strategy, pricing research and sourcing live elsewhere.

---

## Stack and commands

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript. Every route is statically
prerendered; there is no server, no database, no API.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # must pass before any commit
npm run lint
npx tsc --noEmit
```

## Layout of the code

```
app/
  layout.tsx          Fonts, metadata, header/footer, skip link
  globals.css         Brand tokens (@theme) + .label/.rule/.pill utilities
  page.tsx            Home — full-bleed bands + grid + statement sections
  shop/page.tsx       New & sealed catalog
  shop/[slug]/page.tsx  Product detail (long-scroll panels)
  used/page.tsx       Pre-owned catalog + grading explainer
  sell/page.tsx       "We buy your old tech" — the sourcing engine
  fonts/HGNexus-Brush.ttf   Display face, loaded in layout.tsx (see Typography)
components/
  logo.tsx            The lockup image, white on transparent
  site-header.tsx     Logo + paired-column nav + unit counter
  site-footer.tsx     Logo, link columns, meta row
  product-band.tsx    Full-bleed band: name bottom-left, status pill bottom-right
  product-tile.tsx    Catalog grid tile: name, variant, price, status
  product-media.tsx   Image or placeholder glyph, band and tile variants
  cta.tsx             CtaLink + StatusPill (pill-shaped)
  marquee.tsx         Announcement ticker
lib/
  products.ts         SINGLE SOURCE OF TRUTH for inventory
  site.ts             Brand constants, Messenger link, peso() formatter
public/products/      Product photography
public/brand/logo.png HIGHGROUNDS+ NEXUS lockup, white on transparent, 948px wide
tools/font/           Script + specimen that generate HGNexus-Brush.ttf
```

## Data model

**All inventory lives in `lib/products.ts`.** There is no CMS. Adding a unit means appending to
the `products` array; nothing else needs touching.

Two fields drive routing and layout, both derived rather than set twice:

- **`grade`** — `"New"` means sealed stock and routes to `/shop`. `A`/`B`/`C` means pre-owned and
  routes to `/used`. Derived by `isUsed()`. Never add a separate new/used flag.
- **`image`** — a unit with a photo earns a full-bleed band on the home page. A unit without one
  appears in the compact "Also in stock" grid instead. Set the photo and it promotes itself.

`status` is one of `available` · `incoming` · `preorder` · `reserved` · `sold`. Sold units drop
off the catalogs but their pages stay reachable. Labels live in `statusLabel` (catalog) and
`actionLabel` (band pills).

## Adding product photos

This is the main outstanding work. Photos go in `public/products/`, then set the `image` field:

```ts
image: "/products/ps5-disc.jpg",
```

Resize to roughly 1400px on the long edge and save as JPEG around quality 82 — the existing
`ps5-disc.jpg` is the reference for weight (~90KB). Shoot or crop on a plain background, product
centred, consistent angle across a colourway set.

Reference material the owner supplies lives in their local `HG Nexus\Reference` folder, split by
brand. Read from there directly rather than asking them to re-upload.

## Design system

Brand tokens are defined once in `app/globals.css` under `@theme`. Never hardcode a hex.

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

### Typography and brand assets

Three faces, each with one job:

- **Inter** — body text.
- **Space Grotesk** (`font-display`) — UI headings, prices, nav, and the `.label` letterspaced-caps
  treatment.
- **HG Nexus Brush** (`font-brush`) — large statement headlines only, 36px and up. Capitals are
  enforced by CSS because its lowercase is a smaller small-cap form, and faux bold/italic is
  disabled because it is a single weight. Never use it for body text, product names or prices.

**The brush font is a traced draft, not a designed typeface.** It was vectorised from a specimen
whose glyphs are only ~45px tall, so edges are soft and the dry-brush texture is smoothed away.
It has no ligatures or alternates (the specimen only sampled them), no kerning, and two glyphs the
specimen lacked were synthesised: `₱` (the traced `P` plus two bars) and `:`. Its uppercase `I` is
the dotted form from the specimen. To improve it, re-run `tools/font/build_font.py` against a
higher-resolution specimen; the script hard-codes this specimen's pixel layout, so a different
layout needs its row coordinates updated.

**The logo is an image, not text.** Use `<Logo />` (`public/brand/logo.png`). The lockup was lifted
from the brand specimen: white on transparent, so dark backgrounds only, and sharp up to about
its native 948px width. Do not retype the wordmark in the brush font — the logo's `I` is plain,
the font's is dotted, and the NEXUS bars are part of the artwork.

**Font variables must be applied to `<html>`, not `<body>`.** The theme tokens in `globals.css`
(`--font-display`, `--font-brush`) are resolved at `:root`. When `next/font` variables sat on
`<body>` they were invisible there, the whole chain silently became invalid, and every face fell
back to the system sans stack with no error. Check after any font change with
`document.fonts` in the browser — it should list Inter, Space Grotesk and brush as loaded.

**House rules**, from the brand spec:

- One gold element per view. Gold never on white.
- Green is a brand colour, not a trust signal.
- Red for markdowns and urgency only.
- No gradients, glows, drop shadows, bevels, 3D, neon or RGB.
- The brand spec's 18px floor is for the 1080px social graphics, not this site. On the site, body
  copy runs 13–16px and labels 11px; treat those as floors and never go smaller.

**Layout language**, modelled on a reference storefront the owner chose (Analogue):

- Marketing pages use full-bleed bands, each its own background, alternating dark and light.
  Product name bottom-left, status pill bottom-right.
- Catalog pages use a denser grid with small type — name, variant, price below the tile, stock
  status right-aligned.
- Type stays small and quiet. Only centred statements run large.
- Buttons are pills (`.pill`), never rectangles.

`.pill` lives in `@layer components` on purpose, so Tailwind border and colour utilities override
it. Moving it to `utilities` breaks every outlined pill.

## Content rules — do not break these

The business differentiates on honesty, and the site states these claims explicitly. Violating
them is both a brand failure and a consumer-protection exposure under Philippine DTI e-commerce
rules.

- **Product photos must show the actual unit** for pre-owned stock. The `/used` page says so in
  as many words. Never substitute a stock photo of a different unit.
- **Never use AI-generated product imagery.** Renders invent button layouts, ports and logos that
  will not match what ships. Manufacturer-supplied assets for sealed stock are fine.
- **Only claim a completed test log for stock in hand.** Product pages say "What we tested" for
  units held, "What we check before it ships" otherwise. That switch is driven by `status`.
- **Pre-order listings must state lead time** on the listing itself.
- **Never invent specifications.** If a spec is not verified, leave it out.

## Verification before committing

A pushed build that fails is worse than a slow one. Every change:

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` — all clean
2. Load the affected pages in a real browser at 375px, 768px and 1440px
3. Check the console for errors and confirm no horizontal overflow

UI work is not done until it has been looked at. Type-checking proves the code compiles, not that
the page looks right.

## Current state

Live inventory: one pre-owned PS5 (photographed), three sealed Anbernic RG DS Plus, two Retroid
Pocket Duo Lite configurations. Six units, five without photos.

**`lib/products.ts` is known to be stale. The owner has said to hold changes — do not edit
prices, status or specs without an explicit instruction.** What is wrong, for when they say go:

- **Anbernic RG DS Plus ×3** — listed at ₱9,500 and `incoming`. The units are now in hand and the
  owner has decided on ₱7,500 (the official local seller lists at ₱8,000; landed cost was ₱6,510
  per unit). Status becomes `available`.
- **Retroid** — the listings describe the base Duo Lite (4GB/64GB at ₱16,000 and 6GB/128GB at
  ₱17,500). What the owner actually ordered is the **Duo Lite Plus, 8GB/128GB**: Dragonwing Q-7790
  with Adreno 722, Android 16, Wi-Fi 6E, Bluetooth 5.4, 27W charging. Landed cost is roughly
  ₱15,000–16,000 per unit and the suggested price was about ₱20,000. The listings should be replaced,
  one per colourway (they are one-of-one), not edited. Quantity (3 or 5) is not settled.

**Brand open question:** the specimen is monochrome, so the palette above was not part of the
rebrand. It is unchanged; confirm with the owner before altering it.

**Outstanding, in priority order:**

1. **Set the Messenger link.** `lib/site.ts` has `messenger` and `facebook` pointing at
   `REPLACE_WITH_PAGE_USERNAME`. Every call to action on the site routes through these, so
   nothing converts until they are real. One-line fix, highest impact.
2. **Add the Anbernic and Retroid photos** from the owner's `Reference` folder.
3. **Deploy.** Import the repo on Vercel; it detects Next.js with no configuration.
4. Consider a sold archive so past units stay visible as a track record — useful for a new seller
   with no reviews yet.

## Notes

- The owner is a technical consultant (SQL, integrations) but not a frontend developer. Explain
  frontend decisions plainly; assume fluency with data models and business logic.
- Prices are in Philippine pesos, formatted through `peso()` in `lib/site.ts`.
- There is no cart or checkout by design — BIR registration is still pending, so every CTA routes
  to Facebook Messenger.
