import { CasesBrowser } from "@/components/cases-browser";
import { PageHero } from "@/components/ui";
import { batches } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  return pageMetadata(
    "/cases",
    `${t("nav.cases")} — Product Studio`,
    t("cases.intro"),
  );
}

export default async function CasesPage() {
  const t = await getTranslations("cases");
  const active = batches[0];
  if (!active) return null;

  return (
    <>
      <PageHero label={t("label")} title={t("title")} intro={t("intro")} />
      <section className="section section-tight">
        <div className="container">
          <CasesBrowser batches={batches} activeId={active.id} />
        </div>
      </section>
    </>
  );
}
