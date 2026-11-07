const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Rounds to cents — avoids 0.1 + 0.2 style floating point noise in totals. */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** price × (1 − discount / 100), rounded to 2 decimals. */
export function discountedPrice(price: number, discountPercentage: number): number {
  return roundMoney(price * (1 - discountPercentage / 100));
}

/** 1299 → "$1,299.00" */
export function formatPrice(amount: number, currency = "USD"): string {
  if (currency === "USD") return usd.format(amount);
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** "skin-care" → "Skin Care" */
export function formatCategory(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
