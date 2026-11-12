export interface NeonAuthConfig {
  baseUrl: string;
  jwksUrl: string;
}

export const neonAuth: NeonAuthConfig = {
  baseUrl:
    process.env.NEON_AUTH_BASE_URL ||
    "https://ep-crimson-pond-b6netkss.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth",
  jwksUrl:
    process.env.NEON_AUTH_JWKS_URL ||
    "https://ep-crimson-pond-b6netkss.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json",
};

export async function verifyNeonAuthHealth(): Promise<boolean> {
  if (!neonAuth.jwksUrl) return false;
  try {
    const res = await fetch(neonAuth.jwksUrl);
    return res.ok;
  } catch {
    return false;
  }
}
