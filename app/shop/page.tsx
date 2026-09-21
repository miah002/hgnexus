import type { Metadata } from "next";
import Link from "next/link";
import { ProductTile } from "@/components/product-tile";
import { inStock, isUsed, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "New & sealed",
  description:
    "Brand new sealed consoles, handhelds and gadgets — imported and bench-tested on arrival before they ship.",
};

function Section({
  id,
  heading,
  items,
  priority = false,
}: {
  id: string;
  heading: string;
  items: Product[];
  priority?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[13px] text-ash">{heading}</h2>
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
        {items.map((product, i) => (
          <ProductTile key={product.slug} product={product} priority={priority && i === 0} />
        ))}
      </div>
    </section>
  );
}

export default function ShopPage() {
  const sealed = inStock().filter((p) => !isUsed(p));
  const consoles = sealed.filter((p) => p.category === "Console");
  const handhelds = sealed.filter((p) => p.category === "Handheld");
  const usedCount = inStock().filter(isUsed).length;

  return (
    <div className="px-5 pt-10 pb-24 sm:px-8">
      <p className="text-[11px] tracking-[0.18em] text-steel uppercase">
        New &amp; sealed · {sealed.length} {sealed.length === 1 ? "unit" : "units"}
      </p>
      <p className="mt-4 max-w-md text-[13px] leading-relaxed text-steel">
        Factory-sealed stock, imported direct. We open nothing before it sells — units are
        bench-tested on arrival, then sealed stock ships as it came.
      </p>

      <div className="mt-14 space-y-16">
        <Section id="consoles" heading="Consoles" items={consoles} priority />
        <Section id="handhelds" heading="Handhelds" items={handhelds} />
      </div>

      <p className="mt-20 max-w-md border-t rule pt-5 text-[13px] leading-relaxed text-steel">
        Looking for pre-owned instead?{" "}
        <Link href="/used" className="text-ash transition-colors duration-200 hover:text-gold">
          {usedCount} tested and graded {usedCount === 1 ? "unit" : "units"}
        </Link>{" "}
        listed, usually at a wider spread than new.
      </p>
    </div>
  );
}
