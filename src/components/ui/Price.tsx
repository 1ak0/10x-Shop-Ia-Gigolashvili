import { discountedPrice, formatPrice } from "../../utils/format";

interface PriceProps {
  price: number;
  discountPercentage: number;
  size?: "md" | "lg";
}

/** Final price large, original price struck through, and a "−9%" badge (only when ≥ 1%). */
export function Price({ price, discountPercentage, size = "md" }: PriceProps) {
  const hasDiscount = discountPercentage >= 1;
  const finalPrice = hasDiscount ? discountedPrice(price, discountPercentage) : price;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-semibold text-ink ${size === "lg" ? "text-3xl" : "text-lg"}`}>{formatPrice(finalPrice)}</span>
      {hasDiscount && (
        <>
          <span className={`text-ink-soft line-through ${size === "lg" ? "text-base" : "text-sm"}`}>
            <span className="sr-only">Original price </span>
            {formatPrice(price)}
          </span>
          <span className="rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
            −{Math.round(discountPercentage)}%
          </span>
        </>
      )}
    </div>
  );
}
