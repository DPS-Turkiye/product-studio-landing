import { CasesBrowser } from "@/components/cases-browser";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/ui";
import { batches, loc } from "@/lib/content";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import { pageGraph, pageUrl, teamList } from "@/lib/structured-data";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { Crumb } from "@/lib/structured-data";

export function generateStaticParams() {
  return batches.map((batch) => ({ batch: batch.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const { batch: batchId } = await params;
  const batch = batches.find((item) => item.id === batchId);
  if (!batch) return {};
  const locale = await getLocale();
  const t = await getTranslations("Metadata.pages.cases");
  const season = loc(batch.season, locale);
  return pageMetadata(
    { pathname: "/cases/[batch]", params: { batch: batch.id } },
    brandedTitle(season ? `${batch.name} · ${season}` : batch.name),
    loc(batch.summary, locale) || t("description"),
  );
}

export default async function BatchPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const { batch: batchId } = await params;
  const batch = batches.find((item) => item.id === batchId);
  if (!batch) notFound();
  const t = await getTranslations();
  const locale = await getLocale();
  const season = loc(batch.season, locale);
  const heading = season ? `${batch.name} · ${season}` : batch.name;
  const title = brandedTitle(heading);
  const description =
    loc(batch.summary, locale) || t("Metadata.pages.cases.description");
  const href = {
    pathname: "/cases/[batch]" as const,
    params: { batch: batch.id },
  };
  const crumbs: Crumb[] = [
    { href: "/", label: t("nav.home") },
    { href: "/cases", label: t("nav.cases") },
    { href, label: batch.name },
  ];

  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          href,
          title,
          description,
          crumbs,
          extra: [teamList(locale, batch, pageUrl(locale, href))],
        })}
      />
      <PageHero
        label={t("cases.label")}
        title={heading}
        intro={t("cases.intro")}
        crumbs={crumbs}
        breadcrumbLabel={t("common.breadcrumb")}
      />
      <section className="section section-tight">
        <div className="container">
          <CasesBrowser batches={batches} activeId={batch.id} />
        </div>
      </section>
    </>
  );
}
