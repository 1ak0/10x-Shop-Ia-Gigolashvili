/** Every localStorage key the app uses — one place, no typos. */
export const STORAGE_KEYS = {
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  user: "shop_user",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
