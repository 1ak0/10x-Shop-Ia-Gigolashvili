import type { CartItem } from "./cart";

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

/** Checkout form fields — no payment data is collected in this project. */
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: number; // Date.now() when the order is placed
  number: string; // "10X-00001"
  items: CartItem[];
  shipping: ShippingInfo;
  promoCode: string | null;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string; // ISO date
}
