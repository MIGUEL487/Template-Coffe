import { describe, expect, it } from "vitest";
import { getTenantData, DEFAULT_TENANT_ID } from "@/lib/db";
import { verifyNeonAuthHealth, neonAuth } from "@/lib/auth";

describe("Neon Services End-to-End Validation", () => {
  it("queries the provisioned Postgres service and retrieves the cafe tenant and products", async () => {
    const data = await getTenantData(DEFAULT_TENANT_ID);
    expect(data.tenant).not.toBeNull();
    expect(data.tenant?.id).toBe(DEFAULT_TENANT_ID);
    expect(data.tenant?.trade_name).toContain("TESTE B");
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0]).toHaveProperty("name");
    expect(data.products[0]).toHaveProperty("price_cents");
  });

  it("proves the Neon Auth service JWKS endpoint is reachable", async () => {
    expect(neonAuth.jwksUrl).toBeTruthy();
    const isHealthy = await verifyNeonAuthHealth();
    expect(isHealthy).toBe(true);
  });
});
