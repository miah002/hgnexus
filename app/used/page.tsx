import type { Metadata } from "next";
import { ProductTile } from "@/components/product-tile";
import { CtaLink } from "@/components/cta";
import { gradeCopy, inStock, isUsed } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pre-owned",
  description:
    "Pre-owned consoles and hardware, bench-tested and graded against a published scale, with a 7-day DOA replacement window.",
};

const grades = ["A", "B", "C"] as const;

const checks = [
  "Full function pass on every unit before it is listed",
  "Drives read, sticks checked for drift, storage validated",
  "Serial number photographed and logged",
  "Photographed as the actual unit, never a stock image",
];

export default function UsedPage() {
  const units = inStock().filter(isUsed);

  return (
    <>
      <div className="px-5 pt-10 pb-20 sm:px-8">
        <p className="text-[11px] tracking-[0.18em] text-steel uppercase">
          Pre-owned · {units.length} {units.length === 1 ? "unit" : "units"}
        </p>
        <p className="mt-4 max-w-md text-[13px] leading-relaxed text-steel">
          One-of-one stock. Each unit is bench-tested, graded against the scale below, and
          photographed as itself — what you see is the unit you receive.
        </p>

        {units.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
            {units.map((product, i) => (
              <ProductTile key={product.slug} product={product} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="mt-14 max-w-md border-t rule pt-5 text-[13px] leading-relaxed text-steel">
            Nothing pre-owned in stock right now. Tell us the model and budget and we will source
            it — most of our units come from office pull-outs and auctions before they ever get
            listed.
          </p>
        )}
      </div>

      <section
        id="grades"
        className="scroll-mt-24 bg-ash px-5 py-24 sm:px-8 sm:py-28"
        aria-labelledby="grades-heading"
      >
        <h2
          id="grades-heading"
          className="text-center text-[11px] tracking-[0.18em] text-summit/55 uppercase"
        >
          How we grade
        </h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
          {grades.map((g) => (
            <div key={g} className="border-t border-summit/20 pt-5">
              <h3 className="text-sm text-summit">Grade {g}</h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-summit/65">{gradeCopy[g]}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-lg text-center text-[13px] leading-relaxed text-summit/65">
          Grades describe cosmetic condition only. Every unit we sell is fully functional unless
          the listing says otherwise, and anything that fails testing is stripped for parts rather
          than sold.
        </p>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="checks-heading">
        <h2
          id="checks-heading"
          className="text-center text-[11px] tracking-[0.18em] text-steel uppercase"
        >
          Every unit
        </h2>
        <ul className="mx-auto mt-10 max-w-md space-y-3">
          {checks.map((item) => (
            <li key={item} className="flex gap-3 text-[13px] text-ash">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                strokeWidth="1.5"
                className="mt-0.5 h-4 w-4 shrink-0 stroke-verdant"
                aria-hidden="true"
              >
                <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-md text-center text-[13px] leading-relaxed text-steel">
          Backed by 7-day DOA replacement. Inspection before payment is welcome at meet-up — we
          would rather you check than wonder.
        </p>
        <div className="mt-10 flex justify-center">
          <CtaLink href={site.messenger}>Ask about a unit</CtaLink>
        </div>
      </section>
    </>
  );
}
