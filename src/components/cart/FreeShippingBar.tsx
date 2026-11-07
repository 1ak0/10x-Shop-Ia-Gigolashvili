import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";
import { TruckIcon } from "../ui/Icons";

/** "You're $23.40 away from free delivery" + progress towards the $100 threshold. */
export function FreeShippingBar({ cart }: { cart: Cart }) {
  const remaining = cart.amountToFreeShipping();
  const unlocked = cart.qualifiesForFreeShipping();
  const progress = Math.min(100, (cart.merchandiseTotal() / Cart.FREE_SHIPPING_FROM) * 100);

  return (
    <div className="rounded-xl bg-muted px-4 py-3">
      <p className="flex items-center gap-2 text-sm">
        <TruckIcon className={unlocked ? "text-success" : "text-gold"} />
        {unlocked ? (
          <span>
            <strong className="font-semibold text-success">Free delivery unlocked</strong> — on us.
          </span>
        ) : (
          <span>
            You're <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free delivery.
          </span>
        )}
      </p>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${unlocked ? "bg-success" : "bg-gold"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
