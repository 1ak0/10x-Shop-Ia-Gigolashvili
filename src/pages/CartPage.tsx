import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartLine } from "../components/cart/CartLine";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Button } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { InfoIcon } from "../components/ui/Icons";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import type { CartItem } from "../types/cart";
import { getStateMessage } from "../utils/guards";

export default function CartPage() {
  const { items, cart, promoCode, setQuantity, removeItem, clear, applyPromo, removePromo } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = getStateMessage(location.state); // e.g. sent here from an empty checkout

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleRemove = (item: CartItem) => {
    removeItem(item.productId);
    showToast("Removed from cart", "info");
  };

  const handleClear = () => {
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clear();
      showToast("Your cart has been cleared.", "info");
    }
  };

  const handlePromoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoError(null);
      setPromoInput("");
      showToast("Promo code applied ✓");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  if (cart.isEmpty) {
    return (
      <div className="container-page">
        {redirectMessage && (
          <p className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-ink-soft">
            <InfoIcon className="shrink-0 text-info" /> {redirectMessage}
          </p>
        )}
        <StatusMessage title="Your cart is empty." description="Discover our fragrances, make-up and skin care.">
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow text-accent">Your bag</p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Shopping cart</h1>

      <div className="mt-8 grid items-start gap-8 *:min-w-0 lg:grid-cols-[1fr_24rem] lg:gap-12">
        <section aria-label="Cart items">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <CartLine key={item.productId} item={item} onQuantityChange={setQuantity} onRemove={handleRemove} />
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="focus-ring rounded-sm text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
              ← Continue shopping
            </Link>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Clear cart
            </Button>
          </div>
        </section>

        <div className="lg:sticky lg:top-32">
          <OrderSummary cart={cart} promoCode={promoCode} onRemovePromo={removePromo}>
            {!cart.hasPromo && (
              <form onSubmit={handlePromoSubmit} noValidate>
                <label htmlFor="promo" className="mb-1.5 block text-sm font-medium">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    value={promoInput}
                    onChange={(event) => {
                      setPromoInput(event.target.value);
                      setPromoError(null);
                    }}
                    placeholder="e.g. 10X10"
                    aria-invalid={promoError ? true : undefined}
                    aria-describedby={promoError ? "promo-error" : undefined}
                    className={`focus-ring h-11 min-w-0 flex-1 rounded-full border bg-surface px-4 text-sm uppercase placeholder:normal-case placeholder:text-ink-soft/70 ${
                      promoError ? "border-danger" : "border-line"
                    }`}
                  />
                  <Button type="submit" variant="secondary" disabled={!promoInput.trim()}>
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p id="promo-error" className="mt-1.5 text-sm text-danger">
                    {promoError}
                  </p>
                )}
              </form>
            )}

            {/* Guests are redirected to /login by ProtectedRoute — no second check needed here. */}
            <Button size="lg" fullWidth onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
