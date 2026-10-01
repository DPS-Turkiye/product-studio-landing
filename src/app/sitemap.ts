import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { batches } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

const PATHS = [
  "/",
  "/cases",
  "/about",
  "/partner",
  "/apply",
  ...batches.map((batch) => `/cases/${batch.id}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((href) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(getPathname({ locale, href })),
      ]),
    );

    return {
      url: absoluteUrl(getPathname({ locale: routing.defaultLocale, href })),
      lastModified: new Date(),
      alternates: {
        languages: {
          ...languages,
          "x-default": absoluteUrl(
            getPathname({ locale: routing.defaultLocale, href }),
          ),
        },
      },
    };
  });
}
