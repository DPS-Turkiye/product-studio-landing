import { spaceGrotesk } from "@/app/font";
import { JsonLd } from "@/components/json-ld";
import { QueryProvider } from "@/components/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { siteGraph } from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0B0D14",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: "Product Studio",
    title: {
      default: t("title"),
      template: "%s — Product Studio",
    },
    description: t("description"),
    authors: [{ name: "Product Studio", url: getSiteUrl() }],
    creator: "Product Studio",
    publisher: "Product Studio",
    category: "education",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("common");
  const meta = await getTranslations("Metadata");

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.className} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteGraph(meta("description"))} />
        <NextIntlClientProvider>
          <QueryProvider>
            <a className="skip-link" href="#main">
              {t("skip")}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            {process.env.VERCEL ? (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            ) : null}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
