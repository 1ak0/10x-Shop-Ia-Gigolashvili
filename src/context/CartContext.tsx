import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { Cart } from "../models/Cart";
import { cartStorage } from "../models/storage";
import type { AddToCartResult, CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { EMPTY_CART, cartReducer, toCartItem } from "./cart.reducer";

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  cart: Cart;
  itemCount: number;
  getQuantity: (productId: number) => number;
  addItem: (item: CartItem) => AddToCartResult;
  addProduct: (product: Product, quantity?: number) => AddToCartResult;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Lazy init: read shop_cart once, on the first render only.
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART, (initial) => cartStorage.get() ?? initial);

  // Persist after every change — the reducer itself stays pure.
  useEffect(() => {
    cartStorage.set(state);
  }, [state]);

  // A ref lets addItem read the latest items while keeping a stable identity,
  // so memoised ProductCards do not re-render every time the cart changes.
  const itemsRef = useRef(state.items);
  useEffect(() => {
    itemsRef.current = state.items;
  }, [state.items]);

  const addItem = useCallback((item: CartItem): AddToCartResult => {
    if (item.stock <= 0) return "out-of-stock";
    const inCart = itemsRef.current.find((line) => line.productId === item.productId)?.quantity ?? 0;
    if (inCart + item.quantity > item.stock) return "limit-reached";
    dispatch({ type: "ADD_ITEM", item });
    return "added";
  }, []);

  const addProduct = useCallback(
    (product: Product, quantity = 1) => addItem(toCartItem(product, quantity)),
    [addItem],
  );

  const setQuantity = useCallback((productId: number, qty: number) => {
    dispatch({ type: "SET_QTY", productId, qty });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const applyPromo = useCallback((code: string) => {
    if (!Cart.isValidPromo(code)) return false;
    dispatch({ type: "APPLY_PROMO", code });
    return true;
  }, []);

  const removePromo = useCallback(() => dispatch({ type: "REMOVE_PROMO" }), []);

  const value = useMemo<CartContextValue>(() => {
    const cart = new Cart(state.items, state.promoCode);
    return {
      items: state.items,
      promoCode: state.promoCode,
      cart,
      itemCount: cart.itemCount,
      getQuantity: (productId) => state.items.find((line) => line.productId === productId)?.quantity ?? 0,
      addItem,
      addProduct,
      setQuantity,
      removeItem,
      clear,
      applyPromo,
      removePromo,
    };
  }, [state, addItem, addProduct, setQuantity, removeItem, clear, applyPromo, removePromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
