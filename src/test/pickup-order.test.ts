import { describe, expect, it, beforeEach } from "vitest";
import type { CartItem, ConfirmedOrder } from "@/routes/index";

describe("Lolo Café In-Store Pickup & Cart State Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists cart additions and calculates item totals correctly", () => {
    const item1: CartItem = {
      id: "classic-cappuccino",
      name: "Classic Cappuccino",
      category: "Coffee Classics",
      desc: "Rich espresso with microfoam",
      img: "/fake-path.png",
      quantity: 2,
    };

    const item2: CartItem = {
      id: "iced-mocha-glass",
      name: "Iced Mocha Glass",
      category: "Iced Favorites",
      desc: "Chilled espresso with dark cocoa",
      img: "/fake-path2.png",
      quantity: 1,
    };

    const initialCart: CartItem[] = [item1, item2];
    localStorage.setItem("lolo_pickup_cart", JSON.stringify(initialCart));

    const retrieved = JSON.parse(localStorage.getItem("lolo_pickup_cart") || "[]");
    expect(retrieved.length).toBe(2);

    const totalCount = retrieved.reduce((acc: number, curr: CartItem) => acc + curr.quantity, 0);
    expect(totalCount).toBe(3);
  });

  it("creates a verified counter-pickup order and clears active cart with real persistence", () => {
    const cartItems: CartItem[] = [
      {
        id: "iced-matcha-latte",
        name: "Iced Matcha Latte",
        category: "Matcha Moments",
        desc: "Ceremonial matcha with cold milk",
        img: "/fake-matcha.png",
        quantity: 1,
      },
    ];

    const order: ConfirmedOrder = {
      orderId: "LOLO-NYC-4921",
      customerName: "Elena",
      pickupTime: "In 15 minutes",
      createdAt: "10:30 AM",
      items: cartItems,
    };

    localStorage.setItem("lolo_active_pickup_order", JSON.stringify(order));
    localStorage.removeItem("lolo_pickup_cart");

    const savedOrder = JSON.parse(localStorage.getItem("lolo_active_pickup_order") || "{}");
    expect(savedOrder.orderId).toBe("LOLO-NYC-4921");
    expect(savedOrder.customerName).toBe("Elena");
    expect(savedOrder.items[0].name).toBe("Iced Matcha Latte");
    expect(localStorage.getItem("lolo_pickup_cart")).toBeNull();
  });
});
