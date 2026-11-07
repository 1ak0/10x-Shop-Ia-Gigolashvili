export type StockTone = "ok" | "low" | "out";

export interface StockStatus {
  tone: StockTone;
  label: string;
}

export const LOW_STOCK_LIMIT = 5;

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return { tone: "out", label: "Out of stock" };
  if (stock <= LOW_STOCK_LIMIT) return { tone: "low", label: `Only ${stock} left!` };
  return { tone: "ok", label: "In stock" };
}
