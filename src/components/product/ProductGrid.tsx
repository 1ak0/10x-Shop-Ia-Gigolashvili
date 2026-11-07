import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

/** Mobile 1 → tablet 2–3 → desktop 4 columns. */
export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        // key = product.id: stable and unique, so React can reuse cards when the list is re-sorted.
        <li key={product.id} className="flex *:w-full">
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  );
}
