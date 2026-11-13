import { neon } from "@neondatabase/serverless";

export interface TenantProduct {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  is_available: boolean;
  image_url: string | null;
}

export interface TenantInfo {
  id: string;
  slug: string;
  business_type: string;
  trade_name: string;
  tagline: string;
  brand_theme: {
    primary?: string;
    secondary?: string;
    accent?: string;
    surface?: string;
    text?: string;
  } | null;
  currency: string;
}

export interface TenantData {
  tenant: TenantInfo | null;
  products: TenantProduct[];
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DEFAULT_TENANT_ID = "e1081b0e-95ff-4f50-b67e-f40c8aad1855";

export function getDb() {
  const connectionString = process.env["DATABASE_URL"] || process.env["NEON_DATABASE_URL"];

  if (!connectionString) {
    return null;
  }

  return neon(connectionString, { disableWarningInBrowsers: true });
}

export async function getTenantData(targetTenantId?: string): Promise<TenantData> {
  const tenantId = targetTenantId || process.env["DEFAULT_TENANT_ID"] || DEFAULT_TENANT_ID;

  if (!UUID_REGEX.test(tenantId)) {
    return { tenant: null, products: [] };
  }

  const sql = getDb();
  if (!sql) {
    return { tenant: null, products: [] };
  }

  try {
    const tenants = await sql`
      SELECT id, slug, business_type, trade_name, tagline, brand_theme, currency
      FROM saas_tenants
      WHERE id = ${tenantId}
      LIMIT 1
    `;

    if (!tenants || tenants.length === 0) {
      return { tenant: null, products: [] };
    }

    const rawTenant = tenants[0] as {
      id: string;
      slug: string;
      business_type: string;
      trade_name: string;
      tagline: string;
      brand_theme: string | object | null;
      currency: string;
    };

    let brandTheme = null;
    if (typeof rawTenant.brand_theme === "string") {
      try {
        brandTheme = JSON.parse(rawTenant.brand_theme);
      } catch {
        brandTheme = null;
      }
    } else if (typeof rawTenant.brand_theme === "object") {
      brandTheme = rawTenant.brand_theme as TenantInfo["brand_theme"];
    }

    const tenant: TenantInfo = {
      id: rawTenant.id,
      slug: rawTenant.slug,
      business_type: rawTenant.business_type,
      trade_name: rawTenant.trade_name,
      tagline: rawTenant.tagline,
      brand_theme: brandTheme,
      currency: rawTenant.currency || "BRL",
    };

    const rawProducts = await sql`
      SELECT id, name, description, price_cents, category, is_available, image_url
      FROM saas_products
      WHERE tenant_id = ${tenantId} AND is_available = true
      ORDER BY created_at ASC
    `;

    const products: TenantProduct[] = (rawProducts || []).map((p: Record<string, unknown>) => ({
      id: String(p["id"]),
      name: String(p["name"]),
      description: String(p["description"] || ""),
      price_cents: Number(p["price_cents"]) || 0,
      category: String(p["category"] || ""),
      is_available: Boolean(p["is_available"]),
      image_url: p["image_url"] ? String(p["image_url"]) : null,
    }));

    return { tenant, products };
  } catch (error) {
    console.error("Failed to query Neon database:", error);
    return { tenant: null, products: [] };
  }
}
