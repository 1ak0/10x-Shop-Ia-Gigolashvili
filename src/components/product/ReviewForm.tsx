import { useState, type FormEvent } from "react";
import { hasErrors, validateReview, type FormErrors, type ReviewFormValues } from "../../utils/validation";
import { Button } from "../ui/Button";
import { StarIcon } from "../ui/Icons";

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => void;
}

const EMPTY: ReviewFormValues = { rating: 0, comment: "" };

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewFormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors<ReviewFormValues>>({});
  const [hoverRating, setHoverRating] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateReview(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    onSubmit({ rating: values.rating, comment: values.comment.trim() });
    setValues(EMPTY);
  }

  const shownRating = hoverRating || values.rating;

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-muted/50 p-5">
      <h3 className="text-2xl font-semibold">Write a review</h3>

      <fieldset className="mt-4">
        <legend className="mb-1.5 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValues((v) => ({ ...v, rating: star }))}
              onMouseEnter={() => setHoverRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={values.rating === star}
              className="focus-ring grid size-11 place-items-center rounded-full text-gold transition-transform hover:scale-110"
            >
              <StarIcon filled={star <= shownRating} width={24} height={24} />
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1 text-sm text-danger">{errors.rating}</p>}
      </fieldset>

      <div className="mt-4">
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium">
          Your review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={values.comment}
          onChange={(event) => setValues((v) => ({ ...v, comment: event.target.value }))}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          placeholder="How does it wear? Would you buy it again?"
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-[0.95rem] focus:outline-none focus-visible:ring-2 ${
            errors.comment ? "border-danger focus-visible:ring-danger/25" : "border-line focus-visible:border-accent focus-visible:ring-accent/20"
          }`}
        />
        {errors.comment && (
          <p id="review-comment-error" className="mt-1 text-sm text-danger">
            {errors.comment}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-4">
        Submit review
      </Button>
    </form>
  );
}
