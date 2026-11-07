import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { NotFound } from "../components/NotFound";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { Button } from "../components/ui/Button";
import { ArrowLeftIcon, CheckIcon } from "../components/ui/Icons";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNow } from "../hooks/useNow";
import { Cart } from "../models/Cart";
import { OrderModel } from "../models/Order";
import { loadOrders } from "../models/storage";
import { formatDate, formatPrice } from "../utils/format";
import { isRecord } from "../utils/guards";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const now = useNow(30_000);

  const [order] = useState(() => loadOrders().find((candidate) => String(candidate.id) === id) ?? null);
  const justPlaced = isRecord(location.state) && location.state.justPlaced === true;

  if (!order) return <NotFound />;

  const model = OrderModel.from(order);
  const status = model.getStatus(now);
  const currentStep = OrderModel.STATUSES.indexOf(status);

  const handleReorder = () => {
    const results = order.items.map((item) => addItem({ ...item }));
    const added = results.filter((result) => result === "added").length;
    if (added === order.items.length) showToast("Items added to cart ✓");
    else if (added > 0) showToast("Some items were added — others are limited by stock.", "info");
    else showToast("These items are already in your cart at the maximum quantity.", "error");
    navigate("/cart");
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <Link to="/orders" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-ink-soft hover:text-ink">
        <ArrowLeftIcon width={18} height={18} /> All orders
      </Link>

      {justPlaced && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-success/12 px-4 py-3 text-sm text-success">
          <CheckIcon width={18} height={18} /> Thank you! Your order has been placed.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Order #{order.number}</h1>
          <p className="mt-1 text-ink-soft">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {/* Status timeline: Processing ✓ → Shipped ✓ → Delivered ○ */}
      <ol className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-surface p-5">
        {OrderModel.STATUSES.map((step, index) => {
          const done = index <= currentStep;
          return (
            <li key={step} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`grid size-9 place-items-center rounded-full border text-sm ${
                  done ? "border-accent bg-accent text-on-accent" : "border-line text-ink-soft"
                }`}
              >
                {done ? <CheckIcon width={16} height={16} /> : index + 1}
              </span>
              <span className={`text-xs sm:text-sm ${done ? "font-medium text-ink" : "text-ink-soft"}`}>{step}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid items-start gap-8 *:min-w-0 lg:grid-cols-[1fr_22rem]">
        <section aria-label="Items" className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Price</th>
                <th className="px-4 py-3 text-right font-medium">Qty</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-3">
                    <Link to={`/products/${item.productId}`} className="focus-ring flex items-center gap-3 rounded-sm hover:text-accent">
                      <img
                        src={item.thumbnail}
                        alt=""
                        width={44}
                        height={44}
                        loading="lazy"
                        className="size-11 shrink-0 rounded-lg bg-photo object-contain p-1"
                      />
                      <span className="line-clamp-2">{item.title}</span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums sm:table-cell">{formatPrice(Cart.unitPrice(item))}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{formatPrice(Cart.lineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
            <h2 className="text-xl font-semibold">Delivery address</h2>
            <p className="mt-2 font-medium">{order.shipping.fullName}</p>
            <p className="text-ink-soft">
              {order.shipping.address}, {order.shipping.city}
            </p>
            <p className="text-ink-soft">{order.shipping.email}</p>
            <p className="mt-3 text-xs text-ink-soft">Payment: demo order — no payment taken.</p>
          </div>

          <dl className="space-y-2 rounded-2xl border border-line bg-surface p-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Discount ({order.promoCode})</dt>
                <dd className="text-success tabular-nums">−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="tabular-nums">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>

          <Button fullWidth onClick={handleReorder}>
            Reorder
          </Button>
        </aside>
      </div>
    </div>
  );
}
