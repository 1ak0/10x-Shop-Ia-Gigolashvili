import type { CartState } from "../types/cart";
import type { Order } from "../types/order";
import type { ReviewMap } from "../types/product";
import type { AuthUser, Theme } from "../types/user";
import { isAuthUser, isCartState, isOrderList, isReviewMap, isTheme } from "../utils/guards";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { StorageService } from "./StorageService";

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState);
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders, isOrderList);
export const reviewsStorage = new StorageService<ReviewMap>(STORAGE_KEYS.reviews, isReviewMap);
export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme);
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser);

/** Newest first. */
export function loadOrders(): Order[] {
  const orders = ordersStorage.get() ?? [];
  return [...orders].sort((a, b) => b.id - a.id);
}

export function saveOrder(order: Order): void {
  ordersStorage.set([...(ordersStorage.get() ?? []), order]);
}
