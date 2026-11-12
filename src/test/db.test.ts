import { describe, expect, it } from "vitest";
import { getTenantData, DEFAULT_TENANT_ID } from "@/lib/db";

describe("Neon Database Integration", () => {
  it("defines the expected default tenant id", () => {
    expect(DEFAULT_TENANT_ID).toBe("e1081b0e-95ff-4f50-b67e-f40c8aad1855");
  });

  it("handles offline or query gracefully without throwing", async () => {
    const result = await getTenantData("non-existent-tenant-id");
    expect(result).toHaveProperty("tenant");
    expect(result).toHaveProperty("products");
    expect(Array.isArray(result.products)).toBe(true);
  });
});
