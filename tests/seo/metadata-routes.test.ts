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
    const about = entries.find(
      (entry) => entry.url === "https://example.com/about-us",
    );
    const aboutTr = entries.find(
      (entry) => entry.url === "https://example.com/tr/hakkimizda",
    );

    expect(about?.alternates).toEqual({
      languages: {
        en: "https://example.com/about-us",
        tr: "https://example.com/tr/hakkimizda",
        "x-default": "https://example.com/about-us",
      },
    });
    expect(aboutTr?.alternates).toEqual(about?.alternates);
    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://example.com/",
        "https://example.com/tr",
        "https://example.com/cases",
        "https://example.com/tr/projeler",
        "https://example.com/about-us",
        "https://example.com/tr/hakkimizda",
        "https://example.com/become-a-partner",
        "https://example.com/tr/partner-ol",
        "https://example.com/apply-now",
        "https://example.com/tr/basvur",
        "https://example.com/cases/batch-2",
        "https://example.com/tr/projeler/batch-2",
      ]),
    );
  });

  it("allows crawling and points at the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      sitemap: "https://example.com/sitemap.xml",
    });
  });
});
