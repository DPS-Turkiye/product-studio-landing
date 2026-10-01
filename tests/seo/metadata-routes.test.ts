import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("metadata routes", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists public routes in both locales with an x-default alternate", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const entries = sitemap();
    const home = entries.find((entry) => entry.url === "https://example.com/");

    expect(home).toEqual({
      url: "https://example.com/",
      lastModified: expect.any(Date),
      alternates: {
        languages: {
          en: "https://example.com/",
          tr: "https://example.com/tr",
          "x-default": "https://example.com/",
        },
      },
    });
    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://example.com/",
        "https://example.com/cases",
        "https://example.com/about",
        "https://example.com/partner",
        "https://example.com/apply",
        "https://example.com/cases/batch-2",
      ]),
    );
  });

  it("allows crawling and points at the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://example.com/sitemap.xml",
    });
  });
});
