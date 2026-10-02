import Link from "next/link";
import { ProductTileMedia } from "@/components/product-media";
import { statusLabel, type Product } from "@/lib/products";
import { peso } from "@/lib/site";

export function ProductTile({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article>
      <Link href={`/shop/${product.slug}`} className="group block">
        <ProductTileMedia product={product} priority={priority} />

        <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-ash transition-colors duration-200 group-hover:text-gold sm:truncate">
              {product.name}
            </p>
            <p className="mt-0.5 text-[11px] text-steel">{product.variant}</p>
            <p className="mt-1.5 text-[13px] text-ash tabular-nums">{peso(product.price)}</p>
          </div>

          <p className="text-[11px] text-steel sm:shrink-0 sm:text-right">
            {statusLabel[product.status]}
          </p>
        </div>
      </Link>
    </article>
  );
}
