import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";

export const EMPTY_CART: CartState = { items: [], promoCode: null };

export type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

/** Product → cart line snapshot. */
export function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    quantity,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function assertNever(action: never): never {
  throw new Error(`Unhandled cart action: ${JSON.stringify(action)}`);
}

/**
 * Pure function: (old state, action) → new state.
 * Never mutates, never touches localStorage (CartProvider persists in an effect).
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item } = action;
      if (item.quantity < 1) return state;

      const existing = state.items.find((line) => line.productId === item.productId);
      const nextQuantity = (existing?.quantity ?? 0) + item.quantity;
      if (nextQuantity > item.stock) return state; // never more than in stock

      if (existing) {
        return {
          ...state,
          items: state.items.map((line) =>
            line.productId === item.productId ? { ...line, ...item, quantity: nextQuantity } : line,
          ),
        };
      }
      return { ...state, items: [...state.items, { ...item }] };
    }

    case "SET_QTY":
      return {
        ...state,
        items: state.items.map((line) =>
          line.productId === action.productId
            ? { ...line, quantity: clamp(Math.floor(action.qty), 1, Math.max(1, line.stock)) }
            : line,
        ),
      };

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((line) => line.productId !== action.productId) };

    case "CLEAR":
      return EMPTY_CART;

    case "APPLY_PROMO":
      return { ...state, promoCode: action.code.trim().toUpperCase() };

    case "REMOVE_PROMO":
      return { ...state, promoCode: null };

    default:
      return assertNever(action);
  }
}
