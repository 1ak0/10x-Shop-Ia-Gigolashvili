import { Link } from "react-router-dom";
import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";

const footerLink = "focus-ring rounded-sm text-ink-soft transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-semibold">10X Shop</p>
          <p className="eyebrow mt-1 text-gold">Parfumerie · Beauty</p>
          <p className="mt-4 text-sm text-ink-soft">
            A small, curated edit of fragrance, make-up and skin care. Free delivery on every order over{" "}
            {formatPrice(Cart.FREE_SHIPPING_FROM)}.
          </p>
        </div>

        <div>
          <p className="eyebrow text-ink">Shop</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/?category=fragrances" className={footerLink}>
                Fragrances
              </Link>
            </li>
            <li>
              <Link to="/?category=beauty" className={footerLink}>
                Make-up &amp; beauty
              </Link>
            </li>
            <li>
              <Link to="/?category=skin-care" className={footerLink}>
                Skin care
              </Link>
            </li>
                        <li>
              <Link to="/?category=womens-jewellery" className={footerLink}>
                Jewellery &amp; accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink">Service</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>Free delivery over {formatPrice(Cart.FREE_SHIPPING_FROM)}</li>
            <li>
              Code <span className="font-medium text-ink">{Cart.PROMO_CODE}</span> — 10% off
            </li>
            <li>
              <Link to="/orders" className={footerLink}>
                Track your orders
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-ink-soft">
          © 2026 10X Shop · 10X Front-end graduation project · Product data from DummyJSON. No real payments are taken.
        </p>
      </div>
    </footer>
  );
}
