import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Every new page starts at the top (React Router keeps the old scroll position otherwise). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
