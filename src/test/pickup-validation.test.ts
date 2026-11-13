import { describe, expect, it } from "vitest";
import { adjustQuantity, restoreCart } from "@/lib/pickup";

const catalog = [
  { id: "coffee", name: "Coffee", category: "Coffee", desc: "Coffee", img: "/coffee.png" },
];
describe("Pickup bag validation", () => {
  it("rejects invalid storage and unknown products", () => {
    expect(restoreCart("{broken", catalog)).toEqual([]);
    expect(restoreCart('{"id":"coffee"}', catalog)).toEqual([]);
    expect(restoreCart('[{"id":"unknown","quantity":2}]', catalog)).toEqual([]);
  });
  it("uses catalog data rather than untrusted stored names and image URLs", () => {
    expect(
      restoreCart(
        '[{"id":"coffee","quantity":2,"name":"Forged","img":"https://example.com/tracker"}]',
        catalog,
      ),
    ).toEqual([{ ...catalog[0], quantity: 2 }]);
  });
  it("bounds quantities and rejects fractional and negative values", () => {
    expect(restoreCart('[{"id":"coffee","quantity":999}]', catalog)[0]?.quantity).toBe(20);
    for (const quantity of [-1, 0, 1.5, "3"]) {
      expect(restoreCart(JSON.stringify([{ id: "coffee", quantity }]), catalog)).toEqual([]);
    }
  });
  it("removes the last item and caps increases", () => {
    const cart = [{ ...catalog[0]!, quantity: 1 }];
    expect(adjustQuantity(cart, "coffee", -1)).toEqual([]);
    expect(adjustQuantity([{ ...catalog[0]!, quantity: 20 }], "coffee", 1)[0]?.quantity).toBe(20);
    expect(cart[0]?.quantity).toBe(1);
  });
});
