import type { CatalogParams, SortOption } from "../types/catalog";
import type { Product } from "../types/product";
import { discountedPrice } from "./format";

export const PAGE_SIZE = 8;

/** The shop sells perfume and cosmetics only — these DummyJSON categories. */
export const SHOP_CATEGORIES = ["fragrances", "beauty", "skin-care"] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export function isShopCategory(value: string): value is ShopCategory {
  return (SHOP_CATEGORIES as readonly string[]).includes(value);
}

export const SORT_CHOICES: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A→Z" },
];

export function isSortOption(value: string): value is SortOption {
  return SORT_CHOICES.some((choice) => choice.value === value);
}

/** URL → validated params. Anything unknown falls back to a safe default. */
export function parseCatalogParams(searchParams: URLSearchParams): CatalogParams {
  const q = (searchParams.get("q") ?? "").trim();
  const categoryRaw = searchParams.get("category") ?? "";
  const sortRaw = searchParams.get("sort") ?? "";
  const pageRaw = Number(searchParams.get("page") ?? "1");

  return {
    q,
    category: isShopCategory(categoryRaw) ? categoryRaw : "",
    sort: isSortOption(sortRaw) ? sortRaw : "",
    page: Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

/** Pure sort — returns a new array, never mutates the input. Sorts by the price the customer pays. */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  const finalPrice = (p: Product) => discountedPrice(p.price, p.discountPercentage);

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => finalPrice(a) - finalPrice(b));
    case "price-desc":
      return copy.sort((a, b) => finalPrice(b) - finalPrice(a));
    case "rating-desc":
      return copy.sort((a, b) => b.rating - a.rating);
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "":
      return copy;
  }
}

export interface PageSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
}

/** skip = (page − 1) × size, totalPages = ceil(total / size). Out-of-range pages are clamped. */
export function paginate<T>(list: T[], page: number, pageSize = PAGE_SIZE): PageSlice<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;
  const items = list.slice(skip, skip + pageSize);

  return {
    items,
    page: safePage,
    totalPages,
    total,
    from: total === 0 ? 0 : skip + 1,
    to: skip + items.length,
  };
}
