import { QueryProvider } from "@/components/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "optional",
});

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
    title: {
      default: t("title"),
      template: "%s — Product Studio",
    },
    description: t("description"),
    icons: { icon: "/favicon.svg" },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.className} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
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
