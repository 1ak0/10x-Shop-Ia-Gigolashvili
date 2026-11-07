import type { Category, Product, ProductsResponse } from "../types/product";
import { SHOP_CATEGORIES, isShopCategory } from "../utils/catalog";
import { api } from "./ApiClient";

/*
 * DummyJSON has no "several categories at once" filter. 10X Shop sells only
 * fragrances, beauty and skin care (~13 products), so we load those categories
 * in parallel and do sort + pagination on the client. See DEBUG-LOG.md #2.
 */

interface ShopQuery {
  q: string;
  category: string;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const categories = await api.get<Category[]>("/products/categories", signal);
  return categories.filter((category) => isShopCategory(category.slug));
}

export async function fetchShopProducts({ q, category }: ShopQuery, signal?: AbortSignal): Promise<Product[]> {
  if (q) {
    const result = await api.get<ProductsResponse>(`/products/search?q=${encodeURIComponent(q)}&limit=0`, signal);
    return result.products.filter(
      (product) => isShopCategory(product.category) && (!category || product.category === category),
    );
  }

  const slugs: readonly string[] = category ? [category] : SHOP_CATEGORIES;
  const responses = await Promise.all(
    slugs.map((slug) => api.get<ProductsResponse>(`/products/category/${slug}?limit=0`, signal)),
  );
  return responses.flatMap((response) => response.products);
}

export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return api.get<Product>(`/products/${id}`, signal);
}

/** Up to 4 other products from the same category. */
export async function fetchRelatedProducts(category: string, excludeId: number, signal?: AbortSignal): Promise<Product[]> {
  const result = await api.get<ProductsResponse>(`/products/category/${category}?limit=5`, signal);
  return result.products.filter((product) => product.id !== excludeId).slice(0, 4);
}
