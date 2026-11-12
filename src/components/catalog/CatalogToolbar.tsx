import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortOption } from "../../types/catalog";
import type { Category } from "../../types/product";
import { SORT_CHOICES, isSortOption } from "../../utils/catalog";
import { SearchIcon } from "../ui/Icons";

interface CatalogToolbarProps {
  q: string;
  category: string;
  sort: SortOption;
  categories: Category[];
  onSearch: (q: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const selectClass =
  "focus-ring h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface pr-10 pl-4 text-sm text-ink transition-colors hover:border-ink/30";

// A small chevron drawn with an inline SVG background (uses currentColor-like neutral grey).
const chevron = {
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  backgroundSize: "16px",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23948779' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

export function CatalogToolbar({ q, category, sort, categories, onSearch, onCategoryChange, onSortChange }: CatalogToolbarProps) {
  // The input updates instantly; the URL (and the request) only after 400 ms of no typing.
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 400);

  // If the URL changes from outside (Back button, "Clear filters"), mirror it in the input.
  // Only react when `q` itself changed — and not when the change is our own debounced push.
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    if (q !== searchInput.trim() && q !== debouncedSearch.trim()) setSearchInput(q);
  }

  // Refs keep the effect below dependent on the debounced text only.
  const latest = useRef({ q, onSearch });
  useEffect(() => {
    latest.current = { q, onSearch };
  });

  useEffect(() => {
    const next = debouncedSearch.trim();
    if (next !== latest.current.q) latest.current.onSearch(next);
  }, [debouncedSearch]);

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_13rem]">
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
        <input
          id="catalog-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search perfume, mascara, lotion…"
          autoComplete="off"
          className="focus-ring h-12 w-full rounded-xl border border-line bg-surface pr-4 pl-11 text-sm text-ink transition-colors placeholder:text-ink-soft/70 hover:border-ink/30"
        />
      </div>

      <div>
        <label htmlFor="catalog-category" className="sr-only">
          Category
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={selectClass}
          style={chevron}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => {
            const value = event.target.value;
            if (isSortOption(value)) onSortChange(value);
          }}
          className={selectClass}
          style={chevron}
        >
          {SORT_CHOICES.map((choice) => (
            <option key={choice.value || "featured"} value={choice.value}>
              {choice.label === "Featured" ? "Sort: Featured" : choice.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
