import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";
import { BagIcon, CloseIcon, MenuIcon, UserIcon } from "../ui/Icons";
import { ThemeToggle } from "../ui/ThemeToggle";

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `focus-ring relative rounded-sm py-2 text-sm tracking-wide transition-colors ${
    isActive
      ? "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent"
      : "text-ink-soft hover:text-ink"
  }`;
}

function mobileLinkClass({ isActive }: { isActive: boolean }): string {
  return `focus-ring flex min-h-12 items-center rounded-xl px-4 text-base transition-colors ${
    isActive ? "bg-muted font-medium text-ink" : "text-ink-soft hover:bg-muted hover:text-ink"
  }`;
}

export function Header() {
  const { isLoggedIn, displayName, logout } = useAuth();
  const { itemCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // The mobile menu remembers which page it was opened on, so any navigation closes it.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isMenuOpen = menuOpenedAt === location.pathname;

  function handleLogout() {
    logout();
    setMenuOpenedAt(null);
    showToast("You have been logged out.", "info");
    navigate("/");
  }

  const links = (className: typeof navLinkClass) => (
    <>
      <NavLink to="/" end className={className}>
        Catalog
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/orders" className={className}>
            Orders
          </NavLink>
          <NavLink to="/profile" className={className}>
            Profile
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <p className="bg-accent px-4 py-2 text-center text-xs tracking-wide text-on-accent">
        Complimentary delivery on orders over {formatPrice(Cart.FREE_SHIPPING_FROM)}
        <span className="hidden sm:inline"> · Use code {Cart.PROMO_CODE} for 10% off</span>
      </p>

      <div className="container-page flex h-16 items-center gap-3 sm:h-[4.5rem]">
        <button
          type="button"
          className="focus-ring -ml-2 grid size-11 place-items-center rounded-full text-ink md:hidden"
          onClick={() => setMenuOpenedAt(isMenuOpen ? null : location.pathname)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="focus-ring flex flex-col rounded-sm leading-none" aria-label="10X Shop — home">
          <span className="font-display text-[1.65rem] font-semibold tracking-tight">10X Shop</span>
          <span className="eyebrow mt-0.5 text-[0.58rem] text-gold">Parfumerie · Beauty</span>
        </Link>

        <nav aria-label="Main" className="ml-10 hidden items-center gap-7 md:flex">
          {links(navLinkClass)}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/profile"
                className="focus-ring flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-muted hover:text-ink"
              >
                <UserIcon />
                <span className="max-w-32 truncate">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="focus-ring min-h-11 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-muted hover:text-ink"
              >
                Log out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="focus-ring hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-muted hover:text-ink md:flex"
            >
              <UserIcon />
              Log in
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `focus-ring relative grid size-11 place-items-center rounded-full transition-colors hover:bg-muted ${
                isActive ? "text-accent" : "text-ink"
              }`
            }
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          >
            <BagIcon width={22} height={22} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-semibold text-on-accent tabular-nums">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-fade-in border-t border-line bg-bg md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links(mobileLinkClass)}
            <NavLink to="/cart" className={mobileLinkClass}>
              Cart {itemCount > 0 && `(${itemCount})`}
            </NavLink>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="focus-ring flex min-h-12 items-center rounded-xl px-4 text-left text-base text-ink-soft hover:bg-muted hover:text-ink"
              >
                Log out ({displayName})
              </button>
            ) : (
              <NavLink to="/login" className={mobileLinkClass}>
                Log in
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
