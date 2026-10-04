import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
}));

async function seo() {
  const { getLocale } = await import("next-intl/server");
  const { brandedTitle, pageMetadata } = await import("@/lib/seo");
  return { brandedTitle, getLocale: vi.mocked(getLocale), pageMetadata };
}

describe("page metadata", () => {
  beforeEach(async () => {
    const { getLocale } = await seo();
    getLocale.mockReset();
  });

  it("builds english alternates, robots and open graph", async () => {
    const { getLocale, pageMetadata } = await seo();
    getLocale.mockResolvedValue("en");

    await expect(pageMetadata("/about", "About", "The story")).resolves.toEqual(
      {
        title: { absolute: "About" },
        description: "The story",
        alternates: {
          canonical: "/about-us",
          languages: {
            en: "/about-us",
            tr: "/tr/hakkimizda",
            "x-default": "/about-us",
          },
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
        openGraph: {
          title: "About",
          description: "The story",
          url: "/about-us",
          siteName: "Product Studio",
          locale: "en_US",
          alternateLocale: ["tr_TR"],
          type: "website",
          images: [
            {
              url: "/og/en.png",
              width: 1200,
              height: 630,
              alt: "Product Studio",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: "About",
          description: "The story",
          images: ["/og/en.png"],
        },
      },
    );
  });

  it("uses the turkish locale and keeps english as x-default", async () => {
    const { getLocale, pageMetadata } = await seo();
    getLocale.mockResolvedValue("tr");

    const metadata = await pageMetadata("/apply", "Başvur", "Form");

    expect(metadata.alternates).toMatchObject({
      canonical: "/tr/basvur",
      languages: {
        en: "/apply-now",
        tr: "/tr/basvur",
        "x-default": "/apply-now",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/tr/basvur",
      locale: "tr_TR",
      alternateLocale: ["en_US"],
    });
  });

  it("builds a branded document title", async () => {
    const { brandedTitle } = await seo();
    expect(brandedTitle("Batch #2 · Summer 2026")).toBe(
      "Batch #2 · Summer 2026 — Product Studio",
    );
  });
});
