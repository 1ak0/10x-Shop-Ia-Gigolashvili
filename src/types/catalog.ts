export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc" | "title-asc";

/** Catalog filters — they live in the URL (?q=&category=&sort=&page=). */
export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}
