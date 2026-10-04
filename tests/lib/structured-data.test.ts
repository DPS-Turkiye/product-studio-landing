import { site } from "@/lib/content";
import {
  batchList,
  faqPage,
  mentorList,
  organizationId,
  pageGraph,
  partnershipService,
  programEntity,
  programId,
  serializeJsonLd,
  siteGraph,
  teamList,
} from "@/lib/structured-data";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Batch, Mentor } from "@/lib/content";

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
    const open = site.applications.open;
    site.applications.open = true;

    try {
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
          availability: "https://schema.org/InStock",
        },
      });
    } finally {
      site.applications.open = open;
    }
  });

  it("marks a closed program as out of stock", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const open = site.applications.open;
    site.applications.open = false;

    try {
      expect(
        programEntity("Build products.", [], "https://example.com/apply-now")
          .offers.availability,
      ).toBe("https://schema.org/OutOfStock");
    } finally {
      site.applications.open = open;
    }
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

    const pictured = pageGraph({
      locale: "en",
      href: "/apply",
      title: "Apply",
      description: "Join.",
      image: "/images/hero.jpg",
      mainEntityId: "https://example.com/#program",
    });
    expect(pictured["@graph"][0]).toMatchObject({
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://example.com/images/hero.jpg",
      },
      mainEntity: { "@id": "https://example.com/#program" },
    });
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

  it("lists batches on their localized case pages", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const list = batchList(
      "tr",
      [
        {
          id: "batch-2",
          name: "Batch #2",
          season: { en: "Summer 2026", tr: "Yaz 2026" },
          status: "open",
          teams: [],
        },
      ],
      "https://example.com/tr/projeler",
      "Dönemler",
    );

    expect(list).toMatchObject({
      "@id": "https://example.com/tr/projeler#batches",
      name: "Dönemler",
    });
    expect(list.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Batch #2 · Yaz 2026",
        url: "https://example.com/tr/projeler/batch-2",
      },
    ]);
  });

  it("names a team by its challenge and omits a missing partner site", () => {
    const batch = {
      id: "batch-1",
      name: "Batch #1",
      season: "Summer 2025",
      status: "done",
      teams: [
        {
          id: "alpha",
          name: "Alpha",
          partner: { name: "Acme", website: "https://acme.test" },
          challenge: { en: "Ship it", tr: "Çıkar" },
          members: [],
        },
        {
          id: "beta",
          name: "Beta",
          partner: { name: "No site" },
          members: [],
        },
      ],
    } satisfies Batch;

    const list = teamList("en", batch, "https://example.com/cases/batch-1");
    const [withChallenge, namedOnly] = list.itemListElement;

    expect(withChallenge.item).toEqual({
      "@type": "CreativeWork",
      name: "Ship it",
      alternateName: "Alpha",
      contributor: {
        "@type": "Organization",
        name: "Acme",
        url: "https://acme.test",
      },
    });
    expect(namedOnly.item).toEqual({
      "@type": "CreativeWork",
      name: "Beta",
      contributor: { "@type": "Organization", name: "No site" },
    });
  });

  it("adds a mentor profile link only when one is published", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const mentors = [
      {
        name: "Ada",
        title: { en: "Mentor", tr: "Mentor" },
        linkedin: "https://linkedin.com/in/ada",
      },
      { name: "Grace", title: "Advisor" },
    ] satisfies Mentor[];

    const list = mentorList(
      "en",
      mentors,
      "https://example.com/about-us",
      "Mentors",
    );

    expect(list.itemListElement[0].item).toMatchObject({
      name: "Ada",
      jobTitle: "Mentor",
      sameAs: ["https://linkedin.com/in/ada"],
      affiliation: { "@id": "https://example.com/#organization" },
    });
    expect(list.itemListElement[1].item).not.toHaveProperty("sameAs");
    expect(list.itemListElement[1].item).toMatchObject({
      name: "Grace",
      jobTitle: "Advisor",
    });
  });

  it("describes the partnership as a service offered in Türkiye", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    expect(
      partnershipService(
        "Partner",
        "Bring a challenge.",
        "https://example.com/become-a-partner",
      ),
    ).toEqual({
      "@type": "Service",
      "@id": "https://example.com/become-a-partner#service",
      name: "Partner",
      description: "Bring a challenge.",
      url: "https://example.com/become-a-partner",
      serviceType: "Product development partnership",
      provider: { "@id": "https://example.com/#organization" },
      areaServed: { "@type": "Country", name: "Türkiye" },
    });
  });
});
