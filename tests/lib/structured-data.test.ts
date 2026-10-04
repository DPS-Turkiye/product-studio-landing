import { site } from "@/lib/content";
import {
  faqPage,
  organizationId,
  pageGraph,
  programEntity,
  programId,
  serializeJsonLd,
  siteGraph,
} from "@/lib/structured-data";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("structured data", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("describes the organization without empty social profiles", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const graph = siteGraph("A program in Ankara.");
    const organization = graph["@graph"][0];

    expect(organization).toMatchObject({
      "@type": "EducationalOrganization",
      "@id": "https://example.com/#organization",
      name: "Product Studio",
      url: "https://example.com",
      email: site.contactEmail,
      sameAs: [site.social.linkedin],
      address: {
        addressLocality: "Ankara",
        addressCountry: "TR",
      },
    });
    expect(graph["@graph"][1]).toMatchObject({
      "@type": "WebSite",
      publisher: { "@id": organizationId() },
      inLanguage: ["en", "tr"],
    });
  });

  it("marks the program as a free on-site course of study", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(
      programEntity(
        "Build products.",
        ["Product Manager"],
        "https://example.com/apply-now",
      ),
    ).toMatchObject({
      "@type": "EducationalOccupationalProgram",
      "@id": programId(),
      timeToComplete: `P${site.applications.durationWeeks}W`,
      educationalProgramMode: "https://schema.org/Onsite",
      offers: {
        price: "0",
        priceCurrency: "TRY",
        availability: site.applications.open
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    });
  });

  it("builds breadcrumbs only when the trail has a parent", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const home = pageGraph({
      locale: "en",
      href: "/",
      title: "Home",
      description: "Intro",
      crumbs: [{ href: "/", label: "Home" }],
    });
    expect(home["@graph"]).toHaveLength(1);

    const about = pageGraph({
      locale: "tr",
      href: "/about",
      title: "Hakkımızda",
      description: "Hikâye",
      crumbs: [
        { href: "/", label: "Ana sayfa" },
        { href: "/about", label: "Hakkımızda" },
      ],
    });
    const webpage = about["@graph"][0] as { breadcrumb: { "@id": string } };
    const breadcrumbs = about["@graph"][1] as {
      "@id": string;
      itemListElement: { position: number; name: string; item: string }[];
    };

    expect(webpage.breadcrumb["@id"]).toBe(breadcrumbs["@id"]);
    expect(breadcrumbs.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana sayfa",
        item: "https://example.com/tr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hakkımızda",
        item: "https://example.com/tr/hakkimizda",
      },
    ]);
  });

  it("copies visible questions into FAQ markup and escapes markup characters", () => {
    expect(
      faqPage(
        [{ q: "Is it free?", a: "Yes." }],
        "https://example.com/apply-now#faq",
      ).mainEntity,
    ).toEqual([
      {
        "@type": "Question",
        name: "Is it free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes." },
      },
    ]);
    expect(serializeJsonLd({ text: "</script>" })).toBe(
      '{"text":"\\u003c/script>"}',
    );
  });
});
