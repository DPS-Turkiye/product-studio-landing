import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { batches } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

type Href = Parameters<typeof getPathname>[0]["href"];

const PATHS: Href[] = [
  "/",
  "/cases",
  "/about",
  "/partner",
  "/apply",
  ...batches.map((batch) => ({
    pathname: "/cases/[batch]" as const,
    params: { batch: batch.id },
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((href) => {
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          absoluteUrl(getPathname({ locale, href })),
        ]),
      ),
      "x-default": absoluteUrl(
        getPathname({ locale: routing.defaultLocale, href }),
      ),
    };

    return routing.locales.map((locale) => ({
      url: absoluteUrl(getPathname({ locale, href })),
      lastModified: new Date(),
      alternates: { languages },
    }));
  });
}
