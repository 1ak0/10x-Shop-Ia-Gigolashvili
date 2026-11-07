import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchProduct } from "../api/products.api";
import { NotFound } from "../components/NotFound";
import { ProductGallery } from "../components/product/ProductGallery";
import { RelatedProducts } from "../components/product/RelatedProducts";
import { ReviewForm } from "../components/product/ReviewForm";
import { ReviewList } from "../components/product/ReviewList";
import { Button } from "../components/ui/Button";
import { ArrowLeftIcon, CheckIcon, TruckIcon } from "../components/ui/Icons";
import { Price } from "../components/ui/Price";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { RatingStars } from "../components/ui/RatingStars";
import { Spinner } from "../components/ui/Spinner";
import { StatusMessage } from "../components/ui/StatusMessage";
import { StockBadge } from "../components/ui/StockBadge";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useFetch } from "../hooks/useFetch";
import { Cart } from "../models/Cart";
import { reviewsStorage } from "../models/storage";
import type { Product, Review } from "../types/product";
import { isShopCategory } from "../utils/catalog";
import { formatCategory, formatPrice, pluralize } from "../utils/format";
import type { ReviewFormValues } from "../utils/validation";

type Tab = "description" | "reviews";

/** Validates :id first — /products/abc shows 404 without sending a request. */
export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) return <NotFound />;

  // key={productId}: moving to another product (e.g. from "related") gives fresh local state.
  return <ProductLoader key={productId} productId={productId} />;
}

function ProductLoader({ productId }: { productId: number }) {
  // productId is part of the key → a new id triggers a new request (classic "page changes, data doesn't" bug).
  const { state, retry } = useFetch((signal) => fetchProduct(productId, signal), `product-${productId}`);

  if (state.status === "loading") return <Spinner label="Loading product…" />;

  if (state.status === "error") {
    if (state.code === 404) return <NotFound />;
    return (
      <StatusMessage tone="error" title="We couldn't load this product" description={state.message}>
        <Button onClick={retry}>Try again</Button>
      </StatusMessage>
    );
  }

  // The store only sells perfume & cosmetics — other DummyJSON products are "not found" here.
  if (!isShopCategory(state.data.category)) return <NotFound />;

  return <ProductView product={state.data} />;
}

function ProductView({ product }: { product: Product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getQuantity, addProduct, cart } = useCart();
  const { displayName, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>(() => reviewsStorage.get()?.[String(product.id)] ?? []);

  const inCart = getQuantity(product.id);
  const available = Math.max(0, product.stock - inCart);
  const isOutOfStock = product.stock <= 0;

  // Local reviews (newest first) + reviews from the API.
  const allReviews = useMemo(() => [...localReviews, ...product.reviews], [localReviews, product.reviews]);
  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return product.rating;
    return allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
  }, [allReviews, product.rating]);

  const handleBack = () => {
    // location.key is "default" when this is the first page of the visit (opened from a link / refresh).
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  };

  const handleAddToCart = () => {
    const result = addProduct(product, quantity);
    if (result === "added") {
      setFeedback(`Added ${pluralize(quantity, "item")} to your cart.`);
      showToast(`${product.title} added to cart ✓`);
      setQuantity(1);
    } else if (result === "limit-reached") {
      setFeedback(`Only ${product.stock} in stock — you already have ${inCart} in your cart.`);
      showToast("Not enough stock for that quantity.", "error");
    } else {
      setFeedback("Sorry, this product is out of stock.");
    }
  };

  const handleReviewSubmit = useCallback(
    (values: ReviewFormValues) => {
      const review: Review = {
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString(),
        reviewerName: isLoggedIn ? displayName : "Guest",
      };
      const next = [review, ...localReviews];
      setLocalReviews(next);
      reviewsStorage.set({ ...(reviewsStorage.get() ?? {}), [String(product.id)]: next });
      showToast("Review added ✓");
    },
    [displayName, isLoggedIn, localReviews, product.id, showToast],
  );

  const handleRelatedAdd = useCallback(
    (related: Product) => {
      const result = addProduct(related, 1);
      showToast(result === "added" ? `${related.title} added to cart ✓` : "Not enough stock for that product.", result === "added" ? "success" : "error");
    },
    [addProduct, showToast],
  );

  const tabClass = (value: Tab) =>
    `focus-ring -mb-px border-b-2 px-1 pb-3 text-sm font-medium tracking-wide transition-colors ${
      tab === value ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink"
    }`;

  return (
    <div className="container-page py-8 sm:py-12">
      <button
        type="button"
        onClick={handleBack}
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeftIcon width={18} height={18} /> Back to catalog
      </button>

      <div className="mt-4 grid gap-10 *:min-w-0 md:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images.length > 0 ? product.images : [product.thumbnail]} title={product.title} />

        <div className="flex flex-col">
          <p className="eyebrow text-ink-soft">
            {product.brand && <span className="text-gold">{product.brand} · </span>}
            <Link to={`/?category=${product.category}`} className="focus-ring rounded-sm hover:text-ink">
              {formatCategory(product.category)}
            </Link>
          </p>
          <h1 className="mt-2 text-4xl leading-tight font-semibold sm:text-5xl">{product.title}</h1>

          <button
            type="button"
            onClick={() => setTab("reviews")}
            className="focus-ring mt-3 inline-flex w-fit items-center gap-2 rounded-sm text-sm text-ink-soft hover:text-ink"
          >
            <RatingStars rating={averageRating} />
            <span>
              {averageRating.toFixed(1)} · {pluralize(allReviews.length, "review")}
            </span>
          </button>

          <div className="mt-6">
            <Price price={product.price} discountPercentage={product.discountPercentage} size="lg" />
          </div>

          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={Math.max(1, available)}
              onChange={setQuantity}
              disabled={isOutOfStock || available === 0}
            />
            <Button size="lg" className="flex-1 sm:flex-none sm:px-10" onClick={handleAddToCart} disabled={isOutOfStock || available === 0}>
              {isOutOfStock ? "Out of stock" : available === 0 ? "All in your cart" : "Add to cart"}
            </Button>
          </div>

          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-ink-soft">
            {feedback && (
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon width={16} height={16} className="text-success" /> {feedback}{" "}
                <Link to="/cart" className="focus-ring rounded-sm text-accent underline underline-offset-2">
                  View cart
                </Link>
              </span>
            )}
          </p>

          <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted px-4 py-3 text-sm">
            <TruckIcon className="mt-0.5 shrink-0 text-gold" />
            <p className="text-ink-soft">
              <span className="font-medium text-ink">Free delivery</span> on orders over {formatPrice(Cart.FREE_SHIPPING_FROM)}.{" "}
              {!cart.isEmpty && !cart.qualifiesForFreeShipping() && `You're ${formatPrice(cart.amountToFreeShipping())} away.`}
              {cart.qualifiesForFreeShipping() && "Your bag already qualifies."}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div role="tablist" aria-label="Product information" className="flex gap-8 border-b border-line">
          <button type="button" role="tab" id="tab-description" aria-selected={tab === "description"} aria-controls="panel-description" className={tabClass("description")} onClick={() => setTab("description")}>
            Description
          </button>
          <button type="button" role="tab" id="tab-reviews" aria-selected={tab === "reviews"} aria-controls="panel-reviews" className={tabClass("reviews")} onClick={() => setTab("reviews")}>
            Reviews ({allReviews.length})
          </button>
        </div>

        {tab === "description" ? (
          <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" className="max-w-3xl py-8 leading-relaxed text-ink-soft">
            <p>{product.description}</p>
            <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {product.brand && (
                <div className="flex justify-between border-b border-line pb-2">
                  <dt>Brand</dt>
                  <dd className="font-medium text-ink">{product.brand}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-line pb-2">
                <dt>Category</dt>
                <dd className="font-medium text-ink">{formatCategory(product.category)}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt>In stock</dt>
                <dd className="font-medium text-ink">{product.stock}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt>Rating</dt>
                <dd className="font-medium text-ink">{product.rating.toFixed(1)} / 5</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="grid gap-10 py-8 lg:grid-cols-[1fr_24rem]">
            <ReviewList reviews={allReviews} />
            <ReviewForm onSubmit={handleReviewSubmit} />
          </div>
        )}
      </section>

      <RelatedProducts category={product.category} productId={product.id} onAdd={handleRelatedAdd} />
    </div>
  );
}
