import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export type Href = Parameters<typeof getPathname>[0]["href"];

export function brandedTitle(label: string) {
  return `${label} — Product Studio`;
}

export async function pageMetadata(
  href: Href,
  title: string,
  description: string,
): Promise<Metadata> {
  const locale = await getLocale();
  const canonical = getPathname({ locale, href });
  const alternateLocale = locale === "tr" ? ["en_US"] : ["tr_TR"];
  const image = `/og/${locale === "tr" ? "tr" : "en"}.png`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: getPathname({ locale: "en", href }),
        tr: getPathname({ locale: "tr", href }),
        "x-default": getPathname({
          locale: routing.defaultLocale,
          href,
        }),
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
      title,
      description,
      url: canonical,
      siteName: "Product Studio",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Product Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
