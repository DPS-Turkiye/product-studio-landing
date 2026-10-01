import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("site url", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the configured public url without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://productstudio.com.tr/");
    vi.stubEnv("VERCEL_URL", "ignored.vercel.app");

    expect(getSiteUrl()).toBe("https://productstudio.com.tr");
    expect(absoluteUrl("/sitemap.xml")).toBe(
      "https://productstudio.com.tr/sitemap.xml",
    );
  });

  it("falls back to the vercel host", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    vi.stubEnv("VERCEL_URL", "product-studio.vercel.app");

    expect(getSiteUrl()).toBe("https://product-studio.vercel.app");
  });

  it("falls back to localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "");

    expect(getSiteUrl()).toBe("http://localhost:3000");
    expect(absoluteUrl("/apply")).toBe("http://localhost:3000/apply");
  });
});
