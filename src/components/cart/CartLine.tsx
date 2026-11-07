import { Link } from "react-router-dom";
import { Cart } from "../../models/Cart";
import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/format";
import { TrashIcon } from "../ui/Icons";
import { QuantityStepper } from "../ui/QuantityStepper";

interface CartLineProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (item: CartItem) => void;
}

export function CartLine({ item, onQuantityChange, onRemove }: CartLineProps) {
  const unitPrice = Cart.unitPrice(item);

  return (
    <li className="flex gap-4 py-5">
      <Link
        to={`/products/${item.productId}`}
        className="focus-ring block size-24 shrink-0 overflow-hidden rounded-xl border border-line bg-photo sm:size-28"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          width={112}
          height={112}
          loading="lazy"
          className="size-full object-contain p-2 mix-blend-multiply"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="focus-ring rounded-sm font-display text-xl leading-snug font-semibold break-words hover:text-accent"
          >
            {item.title}
          </Link>
          <p className="mt-1 text-sm text-ink-soft">
            {formatPrice(unitPrice)} each
            {item.discountPercentage >= 1 && (
              <span className="ml-2 text-ink-soft/80 line-through">{formatPrice(item.price)}</span>
            )}
          </p>
          {item.quantity >= item.stock && <p className="mt-1 text-xs text-warning">Maximum available quantity</p>}
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={item.stock}
            onChange={(quantity) => onQuantityChange(item.productId, quantity)}
            label={`Quantity of ${item.title}`}
          />
          <div className="flex items-center gap-3">
            <p className="font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</p>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="focus-ring grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label={`Remove ${item.title} from cart`}
            >
              <TrashIcon width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
