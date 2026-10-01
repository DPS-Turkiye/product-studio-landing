import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("metadata routes", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists both locales and an x-default alternate", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(sitemap()).toEqual([
      {
        url: "https://example.com/",
        lastModified: expect.any(Date),
        alternates: {
          languages: {
            en: "https://example.com/",
            tr: "https://example.com/tr",
            "x-default": "https://example.com/",
          },
        },
      },
    ]);
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
