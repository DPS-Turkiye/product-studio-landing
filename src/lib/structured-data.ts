import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { loc, site } from "@/lib/content";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import type { Batch, Mentor } from "@/lib/content";
import type { Href } from "@/lib/seo";

type Locale = (typeof routing.locales)[number];

export type Crumb = {
  href: Href;
  label: string;
};

function asLocale(locale: string): Locale {
  return locale === "tr" ? "tr" : "en";
}

export function organizationId() {
  return `${getSiteUrl()}/#organization`;
}

export function websiteId() {
  return `${getSiteUrl()}/#website`;
}

export function programId() {
  return `${getSiteUrl()}/#program`;
}

export function pageUrl(locale: string, href: Href) {
  return absoluteUrl(getPathname({ locale: asLocale(locale), href }));
}

export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function socialProfiles() {
  return [
    site.social.linkedin,
    site.social.instagram,
    site.social.youtube,
  ].filter((url) => url.length > 0);
}

export function siteGraph(description: string) {
  const url = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": organizationId(),
        name: "Product Studio",
        url,
        description,
        email: site.contactEmail,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/logo-email.png"),
          width: 640,
          height: 309,
        },
        image: absoluteUrl("/images/hero.jpg"),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ankara",
          addressCountry: "TR",
        },
        areaServed: {
          "@type": "Country",
          name: "Türkiye",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: site.contactEmail,
          contactType: "customer support",
          availableLanguage: ["English", "Turkish"],
          areaServed: "TR",
        },
        sameAs: socialProfiles(),
        sponsor: {
          "@type": "Organization",
          name: "Digital Product School",
          url: "https://www.digitalproductschool.io/",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId(),
        url,
        name: "Product Studio",
        description,
        inLanguage: [...routing.locales],
        publisher: { "@id": organizationId() },
      },
    ],
  };
}

export function programEntity(
  description: string,
  roles: string[],
  url: string,
) {
  return {
    "@type": "EducationalOccupationalProgram",
    "@id": programId(),
    name: "Product Studio",
    description,
    url,
    provider: { "@id": organizationId() },
    timeToComplete: `P${site.applications.durationWeeks}W`,
    occupationalCategory: roles,
    educationalProgramMode: "https://schema.org/Onsite",
    inLanguage: [...routing.locales],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
      url,
      availability: site.applications.open
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function faqPage(items: { q: string; a: string }[], id: string) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function batchList(
  locale: string,
  batches: Batch[],
  listUrl: string,
  name: string,
) {
  return {
    "@type": "ItemList",
    "@id": `${listUrl}#batches`,
    name,
    itemListElement: batches.map((batch, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${batch.name} · ${loc(batch.season, locale)}`,
      url: pageUrl(locale, {
        pathname: "/cases/[batch]",
        params: { batch: batch.id },
      }),
    })),
  };
}

export function teamList(locale: string, batch: Batch, page: string) {
  return {
    "@type": "ItemList",
    "@id": `${page}#teams`,
    name: batch.name,
    itemListElement: batch.teams.map((team, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: team.challenge ? loc(team.challenge, locale) : team.name,
        ...(team.challenge ? { alternateName: team.name } : {}),
        contributor: {
          "@type": "Organization",
          name: team.partner.name,
          ...(team.partner.website ? { url: team.partner.website } : {}),
        },
      },
    })),
  };
}

export function mentorList(
  locale: string,
  mentors: Mentor[],
  page: string,
  name: string,
) {
  return {
    "@type": "ItemList",
    "@id": `${page}#mentors`,
    name,
    itemListElement: mentors.map((mentor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: mentor.name,
        jobTitle: loc(mentor.title, locale),
        affiliation: { "@id": organizationId() },
        ...(mentor.linkedin ? { sameAs: [mentor.linkedin] } : {}),
      },
    })),
  };
}

export function partnershipService(
  name: string,
  description: string,
  url: string,
) {
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType: "Product development partnership",
    provider: { "@id": organizationId() },
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
  };
}

export function pageGraph({
  locale,
  href,
  title,
  description,
  crumbs = [],
  image,
  mainEntityId,
  extra = [],
}: {
  locale: string;
  href: Href;
  title: string;
  description: string;
  crumbs?: Crumb[];
  image?: string;
  mainEntityId?: string;
  extra?: object[];
}) {
  const url = pageUrl(locale, href);
  const trail = crumbs.map((crumb) => ({
    name: crumb.label,
    url: pageUrl(locale, crumb.href),
  }));
  const breadcrumbId = `${url}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: asLocale(locale),
        isPartOf: { "@id": websiteId() },
        about: { "@id": organizationId() },
        ...(image
          ? {
              primaryImageOfPage: {
                "@type": "ImageObject",
                url: absoluteUrl(image),
              },
            }
          : {}),
        ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
        ...(trail.length > 1 ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(trail.length > 1
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": breadcrumbId,
              itemListElement: trail.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
              })),
            },
          ]
        : []),
      ...extra,
    ],
  };
}
