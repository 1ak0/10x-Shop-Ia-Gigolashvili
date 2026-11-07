import type { OrderStatus } from "../types/order";

const STYLES: Record<OrderStatus, string> = {
  Processing: "bg-ink-soft/12 text-ink-soft",
  Shipped: "bg-info/12 text-info",
  Delivered: "bg-success/12 text-success",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
