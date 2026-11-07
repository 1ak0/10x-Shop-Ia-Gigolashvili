import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Button } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { CheckIcon } from "../components/ui/Icons";
import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Cart } from "../models/Cart";
import { OrderModel } from "../models/Order";
import { loadOrders, saveOrder } from "../models/storage";
import type { Order, ShippingInfo } from "../types/order";
import { formatPrice } from "../utils/format";
import { hasErrors, validateCheckout, type FormErrors } from "../utils/validation";

const FIELDS: ReadonlyArray<{ name: keyof ShippingInfo; label: string; type?: string; autoComplete: string }> = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
];

export default function CheckoutPage() {
  const { items, cart, promoCode, clear } = useCart();
  const { user } = useAuth();

  // Controlled form: every input value lives in React state.
  const [values, setValues] = useState<ShippingInfo>(() => ({
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() || user.username : "",
    email: user?.email ?? "",
    address: "",
    city: "",
  }));
  const [errors, setErrors] = useState<FormErrors<ShippingInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as the user edits it.
    if (name in errors) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // no page reload

    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setIsSubmitting(true); // disables "Place order" — no double orders
    await new Promise((resolve) => window.setTimeout(resolve, 700)); // simulated processing

    const order = OrderModel.create({
      cart,
      items,
      promoCode,
      shipping: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
      },
      sequence: loadOrders().length + 1,
    }).toJSON();

    saveOrder(order);
    setPlacedOrder(order);
    clear(); // badge in the header updates immediately
    setIsSubmitting(false);
  }

  // 1) Order just placed → confirmation (checked first, because the cart is now empty).
  if (placedOrder) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-lg animate-fade-in rounded-[2rem] border border-line bg-surface p-8 text-center sm:p-12">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success">
            <CheckIcon width={30} height={30} />
          </span>
          <h1 className="mt-6 text-4xl font-semibold">Thank you!</h1>
          <p className="mt-2 text-ink-soft">Your order has been placed.</p>

          <dl className="mt-8 space-y-2 rounded-xl bg-muted p-5 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Order number</dt>
              <dd className="font-medium">#{placedOrder.number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivering to</dt>
              <dd className="text-right font-medium">
                {placedOrder.shipping.address}, {placedOrder.shipping.city}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="font-medium">{placedOrder.shippingCost === 0 ? "Free" : formatPrice(placedOrder.shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold">{formatPrice(placedOrder.total)}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={`/orders/${placedOrder.id}`} state={{ justPlaced: true }} className={buttonClasses("primary")}>
              View order
            </Link>
            <Link to="/" className={buttonClasses("secondary")}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2) Nothing to buy → back to the cart with an explanation.
  if (cart.isEmpty) {
    return <Navigate to="/cart" replace state={{ message: "Your cart is empty — add something before checking out." }} />;
  }

  // 3) The form.
  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow text-accent">Almost there</p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid items-start gap-8 *:min-w-0 lg:grid-cols-[1fr_24rem] lg:gap-12">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <h2 className="text-2xl font-semibold">Delivery details</h2>
          <p className="mt-1 text-sm text-ink-soft">This is a demo store — no payment is taken.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <TextField
                key={field.name}
                id={field.name}
                name={field.name}
                label={field.label}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                value={values[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
                className={field.name === "address" ? "sm:col-span-2" : ""}
              />
            ))}
          </div>

          <Button type="submit" size="lg" fullWidth className="mt-8" disabled={isSubmitting}>
            {isSubmitting ? "Placing order…" : `Place order · ${formatPrice(cart.total())}`}
          </Button>
        </form>

        <div className="lg:sticky lg:top-32">
          <OrderSummary cart={cart} promoCode={promoCode}>
            <ul className="divide-y divide-line border-t border-line">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 py-3 text-sm">
                  <img
                    src={item.thumbnail}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className="size-12 shrink-0 rounded-lg border border-line bg-photo object-contain p-1"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {item.title} <span className="text-ink-soft">× {item.quantity}</span>
                  </span>
                  <span className="font-medium tabular-nums">{formatPrice(Cart.lineTotal(item))}</span>
                </li>
              ))}
            </ul>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
