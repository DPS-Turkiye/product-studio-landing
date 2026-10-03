import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/cases": {
      en: "/cases",
      tr: "/projeler",
    },
    "/cases/[batch]": {
      en: "/cases/[batch]",
      tr: "/projeler/[batch]",
    },
    "/about": {
      en: "/about-us",
      tr: "/hakkimizda",
    },
    "/partner": {
      en: "/become-a-partner",
      tr: "/partner-ol",
    },
    "/apply": {
      en: "/apply-now",
      tr: "/basvur",
    },
  },
});
