import type { CartItem } from "../types/cart";
import { discountedPrice, roundMoney } from "../utils/format";

export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

/**
 * All cart maths in one UI-free, testable class.
 * React state stays the source of truth — a Cart is created from it with useMemo.
 */
export class Cart implements ICart {
  /** Free delivery on orders over $100 (after the promo discount). */
  static readonly FREE_SHIPPING_FROM = 100;
  static readonly SHIPPING_COST = 9.99;
  static readonly PROMO_CODE = "10X10";
  static readonly PROMO_RATE = 0.1;

  constructor(
    private readonly items: CartItem[],
    private readonly promoCode: string | null,
  ) {}

  static isValidPromo(code: string): boolean {
    return code.trim().toUpperCase() === Cart.PROMO_CODE;
  }

  static unitPrice(item: CartItem): number {
    return discountedPrice(item.price, item.discountPercentage);
  }

  static lineTotal(item: CartItem): number {
    return roundMoney(Cart.unitPrice(item) * item.quantity);
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get hasPromo(): boolean {
    return this.promoCode !== null && Cart.isValidPromo(this.promoCode);
  }

  /** Σ discounted unit price × quantity */
  subtotal(): number {
    return roundMoney(this.items.reduce((sum, item) => sum + Cart.lineTotal(item), 0));
  }

  discount(): number {
    return this.hasPromo ? roundMoney(this.subtotal() * Cart.PROMO_RATE) : 0;
  }

  /** What the free-delivery threshold is compared against. */
  merchandiseTotal(): number {
    return roundMoney(this.subtotal() - this.discount());
  }

  qualifiesForFreeShipping(): boolean {
    return this.merchandiseTotal() >= Cart.FREE_SHIPPING_FROM;
  }

  amountToFreeShipping(): number {
    return roundMoney(Math.max(0, Cart.FREE_SHIPPING_FROM - this.merchandiseTotal()));
  }

  shipping(): number {
    if (this.isEmpty || this.qualifiesForFreeShipping()) return 0;
    return Cart.SHIPPING_COST;
  }

  total(): number {
    return roundMoney(this.merchandiseTotal() + this.shipping());
  }
}
