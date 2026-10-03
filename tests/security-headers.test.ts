import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../next.config";

function headerValue(
  headers: { key: string; value: string }[] | undefined,
  key: string,
) {
  return headers?.find((header) => header.key === key)?.value;
}

const localHeaderKeys = [
  "X-XSS-Protection",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy",
  "Cross-Origin-Opener-Policy",
];

describe("security headers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends the local production header set on every path", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "");

    const headers = await nextConfig.headers?.();
    const rule = headers?.find((entry) => entry.source === "/(.*)");

    expect(rule?.headers.map((header) => header.key)).toEqual(localHeaderKeys);
    expect(headerValue(rule?.headers, "Content-Security-Policy")).toBe(
      "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
    );
    expect(headerValue(rule?.headers, "Cross-Origin-Opener-Policy")).toBe(
      "same-origin-allow-popups",
    );
  });

  it("adds transport security headers when Vercel exposes its system environment", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "1");

    const headers = await nextConfig.headers?.();
    const rule = headers?.find((entry) => entry.source === "/(.*)");

    expect(rule?.headers.map((header) => header.key)).toEqual([
      "Strict-Transport-Security",
      ...localHeaderKeys,
    ]);
    expect(headerValue(rule?.headers, "Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );
    expect(headerValue(rule?.headers, "Content-Security-Policy")).toBe(
      "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests",
    );
  });

  it("skips security headers outside production", async () => {
    vi.stubEnv("NODE_ENV", "test");

    await expect(nextConfig.headers?.()).resolves.toEqual([]);
  });
});
