import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function pageMetadata(
  href: string,
  title: string,
  description: string,
): Promise<Metadata> {
  const locale = await getLocale();
  const canonical = getPathname({ locale, href });

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
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Product Studio",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
  };
}
