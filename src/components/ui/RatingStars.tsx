import { StarIcon } from "./Icons";

interface RatingStarsProps {
  rating: number;
  size?: number;
}

/** Five stars, filled to the nearest whole star. */
export function RatingStars({ rating, size = 16 }: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <span className="inline-flex items-center gap-0.5 text-gold" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rounded} width={size} height={size} />
      ))}
    </span>
  );
}

/** Compact "★ 4.7" used on product cards. */
export function RatingInline({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink">
      <StarIcon width={14} height={14} className="text-gold" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="sr-only">out of 5</span>
    </span>
  );
}
