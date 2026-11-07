import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "../ErrorBoundary";
import { Spinner } from "../ui/Spinner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

/** One layout for every route: Header + page (<Outlet />) + Footer. */
export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />

      <main id="main" className="flex-1">
        {/* key={pathname}: navigating to another page resets a crashed boundary. */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
