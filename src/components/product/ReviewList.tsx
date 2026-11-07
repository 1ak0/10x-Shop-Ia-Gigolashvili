import type { Review } from "../../types/product";
import { formatDate } from "../../utils/format";
import { RatingStars } from "../ui/RatingStars";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-ink-soft">No reviews yet — be the first to share your thoughts.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {reviews.map((review) => (
        // Reviews have no id in DummyJSON; author + date is unique enough here.
        <li key={`${review.reviewerName}-${review.date}`} className="py-5 first:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{review.reviewerName}</p>
            <time dateTime={review.date} className="text-xs text-ink-soft">
              {formatDate(review.date)}
            </time>
          </div>
          <div className="mt-1">
            <RatingStars rating={review.rating} size={14} />
          </div>
          <p className="mt-2 text-ink-soft">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
