import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
}));

async function seo() {
  const { getLocale } = await import("next-intl/server");
  const { pageMetadata } = await import("@/lib/seo");
  return { getLocale: vi.mocked(getLocale), pageMetadata };
}

describe("page metadata", () => {
  beforeEach(async () => {
    const { getLocale } = await seo();
    getLocale.mockReset();
  });

  it("builds english alternates and open graph", async () => {
    const { getLocale, pageMetadata } = await seo();
    getLocale.mockResolvedValue("en");

    await expect(pageMetadata("/about", "About", "The story")).resolves.toEqual(
      {
        title: { absolute: "About" },
        description: "The story",
        alternates: {
          canonical: "/about",
          languages: {
            en: "/about",
            tr: "/tr/about",
            "x-default": "/about",
          },
        },
        openGraph: {
          title: "About",
          description: "The story",
          url: "/about",
          siteName: "Product Studio",
          locale: "en_US",
          type: "website",
        },
      },
    );
  });

  it("uses the turkish locale and keeps english as x-default", async () => {
    const { getLocale, pageMetadata } = await seo();
    getLocale.mockResolvedValue("tr");

    const metadata = await pageMetadata("/apply", "Başvur", "Form");

    expect(metadata.alternates).toMatchObject({
      canonical: "/tr/apply",
      languages: {
        en: "/apply",
        tr: "/tr/apply",
        "x-default": "/apply",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/tr/apply",
      locale: "tr_TR",
    });
  });
});
