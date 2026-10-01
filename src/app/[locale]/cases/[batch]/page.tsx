import { CasesBrowser } from "@/components/cases-browser";
import { PageHero } from "@/components/ui";
import { batches } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations();
  if (!batch) return {};
  return pageMetadata(
    `/cases/${batch.id}`,
    `${batch.name} — Product Studio`,
    t("cases.intro"),
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
  const t = await getTranslations("cases");

  return (
    <>
      <PageHero label={t("label")} title={t("title")} intro={t("intro")} />
      <section className="section section-tight">
        <div className="container">
          <CasesBrowser batches={batches} activeId={batch.id} />
        </div>
      </section>
    </>
  );
}
