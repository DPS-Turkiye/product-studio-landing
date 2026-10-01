import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../next.config";

const expectedHeaderKeys = [
  "Strict-Transport-Security",
  "X-XSS-Protection",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy",
];

describe("security headers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends the production header set on every path", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const headers = await nextConfig.headers?.();
    const rule = headers?.find((entry) => entry.source === "/(.*)");

    expect(rule?.headers.map((header) => header.key)).toEqual(
      expectedHeaderKeys,
    );
  });

  it("skips security headers outside production", async () => {
    vi.stubEnv("NODE_ENV", "test");

    await expect(nextConfig.headers?.()).resolves.toEqual([]);
  });
});
