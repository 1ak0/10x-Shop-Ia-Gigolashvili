import { fetchRelatedProducts } from "../../api/products.api";
import { useFetch } from "../../hooks/useFetch";
import type { Product } from "../../types/product";
import { ProductGrid } from "./ProductGrid";

interface RelatedProductsProps {
  category: string;
  productId: number;
  onAdd: (product: Product) => void;
}

/** Reuses the same ProductGrid / ProductCard as the catalog. */
export function RelatedProducts({ category, productId, onAdd }: RelatedProductsProps) {
  const { state } = useFetch(
    (signal) => fetchRelatedProducts(category, productId, signal),
    `${category}|${productId}`,
  );

  // Related products are a nice-to-have: on loading / error / empty we simply show nothing.
  if (state.status !== "success" || state.data.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-20">
      <p className="eyebrow text-accent">You may also like</p>
      <h2 id="related-heading" className="mt-1 mb-6 text-3xl font-semibold sm:text-4xl">
        From the same collection
      </h2>
      <ProductGrid products={state.data} onAdd={onAdd} />
    </section>
  );
}
