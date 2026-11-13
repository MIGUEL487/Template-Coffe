export interface CartItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  img: string;
  quantity: number;
}

export const CART_KEY = "lolo_pickup_cart";

/** Restore only known products and bounded integer quantities, never stored markup or URLs. */
export function restoreCart(raw: string | null, catalog: Omit<CartItem, "quantity">[]): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    const quantities = new Map<string, number>();
    for (const value of parsed) {
      if (!value || typeof value !== "object") continue;
      const item = value as Record<string, unknown>;
      if (
        typeof item["id"] !== "string" ||
        typeof item["quantity"] !== "number" ||
        !Number.isInteger(item["quantity"])
      )
        continue;
      if (item["quantity"] > 0) quantities.set(item["id"], Math.min(20, item["quantity"]));
    }
    return catalog
      .filter((p) => quantities.has(p.id))
      .map((p) => ({ ...p, quantity: quantities.get(p.id)! }));
  } catch {
    return [];
  }
}

export function adjustQuantity(cart: CartItem[], id: string, delta: number): CartItem[] {
  return cart
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.min(20, item.quantity + delta) } : item,
    )
    .filter((item) => item.quantity > 0);
}
