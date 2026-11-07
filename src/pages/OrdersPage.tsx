import { useState } from "react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { buttonClasses } from "../components/ui/buttonStyles";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useNow } from "../hooks/useNow";
import { OrderModel } from "../models/Order";
import { loadOrders } from "../models/storage";
import { formatDate, formatPrice, pluralize } from "../utils/format";

export default function OrdersPage() {
  const [orders] = useState(loadOrders); // read shop_orders once, newest first
  const now = useNow(30_000);

  if (orders.length === 0) {
    return (
      <div className="container-page">
        <StatusMessage title="You have no orders yet." description="When you place an order it will appear here.">
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow text-accent">Your account</p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Orders</h1>

      <ul className="mt-8 grid gap-4">
        {orders.map((order) => {
          const model = OrderModel.from(order);
          return (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="focus-ring flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-soft sm:flex-row sm:items-center sm:p-6"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.productId}
                      src={item.thumbnail}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="size-14 rounded-full border-2 border-surface bg-photo object-contain p-1"
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-display text-2xl font-semibold">#{order.number}</p>
                  <p className="text-sm text-ink-soft">
                    {formatDate(order.placedAt)} · {pluralize(model.itemCount, "item")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
                  <OrderStatusBadge status={model.getStatus(now)} />
                  <p className="font-semibold tabular-nums">{formatPrice(order.total)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
