import { Link } from "react-router-dom";
import { buttonClasses } from "./ui/buttonStyles";

/** Shared by the * route, unknown products and unknown orders. */
export function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center sm:py-32">
      <p className="font-display text-8xl font-semibold text-accent/25">404</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-soft">The page you are looking for does not exist.</p>
      <Link to="/" className={buttonClasses("primary", "lg", "mt-8")}>
        Go to catalog
      </Link>
    </section>
  );
}
