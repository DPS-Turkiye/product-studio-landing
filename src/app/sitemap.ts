import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(getPathname({ locale, href: "/" })),
    ]),
  );

  return [
    {
      url: absoluteUrl(
        getPathname({ locale: routing.defaultLocale, href: "/" }),
      ),
      lastModified: new Date(),
      alternates: {
        languages: {
          ...languages,
          "x-default": absoluteUrl(
            getPathname({ locale: routing.defaultLocale, href: "/" }),
          ),
        },
      },
    },
  ];
}
