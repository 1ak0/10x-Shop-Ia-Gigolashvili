import { useEffect, useState } from "react";

/** Current time, refreshed every `intervalMs` — lets order statuses move on without a reload. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    // Without this cleanup the interval would keep running (and leak) after leaving the page.
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}
