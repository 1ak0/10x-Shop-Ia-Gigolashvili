import type { ReactNode } from "react";
import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";
import { FreeShippingBar } from "./FreeShippingBar";

interface OrderSummaryProps {
  cart: Cart;
  promoCode: string | null;
  onRemovePromo?: () => void;
  title?: string;
  /** Extra content (promo form, checkout button) — composition through children. */
  children?: ReactNode;
}

function Row({ label, value, className = "" }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-medium tabular-nums">{value}</dd>
    </div>
  );
}

export function OrderSummary({ cart, promoCode, onRemovePromo, title = "Order summary", children }: OrderSummaryProps) {
  const shipping = cart.shipping();

  return (
    <section aria-labelledby="summary-heading" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 id="summary-heading" className="text-2xl font-semibold">
        {title}
      </h2>

      <dl className="mt-5 space-y-3 text-sm">
        <Row label={`Subtotal (${cart.itemCount} ${cart.itemCount === 1 ? "item" : "items"})`} value={formatPrice(cart.subtotal())} />

        {cart.hasPromo && (
          <Row
            label={
              <span className="flex flex-wrap items-center gap-x-2">
                Discount ({promoCode} −{Cart.PROMO_RATE * 100}%)
                {onRemovePromo && (
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="focus-ring rounded text-xs text-accent underline underline-offset-2 hover:no-underline"
                  >
                    Remove
                  </button>
                )}
              </span>
            }
            value={<span className="text-success">−{formatPrice(cart.discount())}</span>}
          />
        )}

        <Row label="Delivery" value={shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)} />
      </dl>

      {!cart.isEmpty && (
        <div className="mt-4">
          <FreeShippingBar cart={cart} />
        </div>
      )}

      <dl className="mt-5 border-t border-line pt-4">
        <Row
          label={<span className="text-base font-medium text-ink">Total</span>}
          value={<span className="font-display text-2xl font-semibold">{formatPrice(cart.total())}</span>}
          className="items-baseline"
        />
      </dl>

      {children && <div className="mt-5 space-y-3">{children}</div>}
    </section>
  );
}
