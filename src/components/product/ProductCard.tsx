import { memo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatCategory } from "../../utils/format";
import { Button } from "../ui/Button";
import { Price } from "../ui/Price";
import { RatingInline } from "../ui/RatingStars";
import { StockBadge } from "../ui/StockBadge";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function ProductCardBase({ product, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:shadow-soft dark:hover:border-ink/25 dark:hover:shadow-none">
      <div className="relative aspect-square overflow-hidden bg-photo">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width={300}
          height={300}
          className="size-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="eyebrow truncate text-ink-soft">
          {formatCategory(product.category)}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>

        {/* The link's ::after covers the whole card, so the card is clickable — but only one real link exists. */}
        <h3 className="text-xl leading-snug font-semibold">
          <Link
            to={`/products/${product.id}`}
            className="focus-ring rounded-sm transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent"
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between gap-2">
          <RatingInline rating={product.rating} />
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-1">
          <Price price={product.price} discountPercentage={product.discountPercentage} />
        </div>

        <Button
          variant="secondary"
          fullWidth
          className="relative z-10 mt-auto"
          onClick={() => onAdd(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}

/** memo: in a grid of cards only the card whose props changed re-renders. */
export const ProductCard = memo(ProductCardBase);
