import { CasesBrowser } from "@/components/cases-browser";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/ui";
import { batches } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { batchList, pageGraph, pageUrl } from "@/lib/structured-data";
import { getLocale, getTranslations } from "next-intl/server";
import type { Crumb } from "@/lib/structured-data";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.pages.cases");
  return pageMetadata("/cases", t("title"), t("description"));
}

export default async function CasesPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const active = batches[0];
  if (!active) return null;
  const title = t("Metadata.pages.cases.title");
  const description = t("Metadata.pages.cases.description");
  const crumbs: Crumb[] = [
    { href: "/", label: t("nav.home") },
    { href: "/cases", label: t("nav.cases") },
  ];

  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          href: "/cases",
          title,
          description,
          crumbs,
          extra: [batchList(locale, batches, pageUrl(locale, "/cases"), title)],
        })}
      />
      <PageHero
        label={t("cases.label")}
        title={t("cases.title")}
        intro={t("cases.intro")}
        crumbs={crumbs}
        breadcrumbLabel={t("common.breadcrumb")}
      />
      <section className="section section-tight">
        <div className="container">
          <CasesBrowser batches={batches} activeId={active.id} />
        </div>
      </section>
    </>
  );
}
