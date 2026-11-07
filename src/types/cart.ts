import type { Product } from "./product";

/**
 * A cart line keeps a snapshot of the product fields it needs,
 * so the cart can be rendered from localStorage without another request.
 */
export type CartItem = Pick<Product, "title" | "thumbnail" | "price" | "discountPercentage" | "stock"> & {
  productId: number;
  quantity: number;
};

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
}

/** What happened when the user tried to add something to the cart. */
export type AddToCartResult = "added" | "limit-reached" | "out-of-stock";
