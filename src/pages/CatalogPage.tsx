import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, fetchShopProducts } from "../api/products.api";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { Hero } from "../components/catalog/Hero";
import { ProductGridSkeleton } from "../components/product/ProductCardSkeleton";
import { ProductGrid } from "../components/product/ProductGrid";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useFetch } from "../hooks/useFetch";
import type { SortOption } from "../types/catalog";
import type { Category, Product } from "../types/product";
import { SHOP_CATEGORIES, paginate, parseCatalogParams, sortProducts } from "../utils/catalog";
import { formatCategory, pluralize } from "../utils/format";

// Used when /products/categories fails, so the filter still works.
const FALLBACK_CATEGORIES: Category[] = SHOP_CATEGORIES.map((slug) => ({
  slug,
  name: formatCategory(slug),
  url: `https://dummyjson.com/products/category/${slug}`,
}));

const TITLES: Record<string, string> = {
  fragrances: "Fragrances",
  beauty: "Make-up & beauty",
  "skin-care": "Skin care",
};

export default function CatalogPage() {
  // The URL is the single source of truth for q / category / sort / page.
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseCatalogParams(searchParams);
  const { addProduct } = useCart();
  const { showToast } = useToast();

  const { state: categoriesState } = useFetch(fetchCategories, "categories");
  const categories = categoriesState.status === "success" ? categoriesState.data : FALLBACK_CATEGORIES;

  const { state: productsState, retry } = useFetch(
    (signal) => fetchShopProducts({ q: params.q, category: params.category }, signal),
    `q=${params.q}|category=${params.category}`,
  );

  // Sorting and paging are derived from the loaded list — no extra state, no extra request.
  const view = useMemo(() => {
    if (productsState.status !== "success") return null;
    return paginate(sortProducts(productsState.data, params.sort), params.page);
  }, [productsState, params.sort, params.page]);

  /** Changes some URL params; any filter change sends the user back to page 1. */
  const updateParams = useCallback(
    (changes: Record<string, string | null>, options: { resetPage?: boolean; replace?: boolean } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
          }
          if (options.resetPage ?? true) next.delete("page");
          return next;
        },
        { replace: options.replace ?? false },
      );
    },
    [setSearchParams],
  );

  const handleAdd = useCallback(
    (product: Product) => {
      const result = addProduct(product, 1);
      if (result === "added") showToast(`${product.title} added to cart ✓`);
      else if (result === "limit-reached") showToast(`You already have all ${product.stock} in your cart.`, "error");
      else showToast("Sorry, this product is out of stock.", "error");
    },
    [addProduct, showToast],
  );

  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = Boolean(params.q || params.category || params.sort);
  const showHero = !params.q && !params.category && params.page === 1;
  const heading = params.q ? `Results for “${params.q}”` : params.category ? (TITLES[params.category] ?? "Catalog") : "Catalog";

  return (
    <>
      {showHero && <Hero />}

      <section className="container-page pt-10 sm:pt-14" aria-labelledby="catalog-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow text-accent">Shop the collection</p>
            <h2 id="catalog-heading" className="mt-1 text-4xl font-semibold sm:text-5xl">
              {heading}
            </h2>
          </div>
          {view && <p className="text-sm text-ink-soft">{pluralize(view.total, "product")}</p>}
        </div>

        <CatalogToolbar
          q={params.q}
          category={params.category}
          sort={params.sort}
          categories={categories}
          onSearch={(q) => updateParams({ q }, { replace: true })}
          onCategoryChange={(category) => updateParams({ category })}
          onSortChange={(sort: SortOption) => updateParams({ sort })}
        />

        <div className="mt-8">
          {productsState.status === "loading" && <ProductGridSkeleton />}

          {productsState.status === "error" && (
            <StatusMessage tone="error" title="We couldn't load the collection" description={productsState.message}>
              <Button onClick={retry}>Try again</Button>
            </StatusMessage>
          )}

          {view && view.total === 0 && (
            <StatusMessage title="No products found." description="Try another word or remove a filter.">
              {hasFilters && (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </StatusMessage>
          )}

          {view && view.total > 0 && (
            <>
              <ProductGrid products={view.items} onAdd={handleAdd} />
              <div className="mt-10 flex flex-col items-center gap-4">
                <Pagination page={view.page} totalPages={view.totalPages} onChange={handlePageChange} />
                <p className="text-sm text-ink-soft">
                  Showing {view.from}–{view.to} of {view.total}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
