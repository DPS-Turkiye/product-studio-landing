import { PartnerForm } from "@/components/forms";
import { Arrow, DotGrid, Star } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { Button, PageHero, PartnerStrip, SectionLabel } from "@/components/ui";
import { partners, site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { pageGraph, pageUrl, partnershipService } from "@/lib/structured-data";
import { getLocale, getTranslations } from "next-intl/server";
import type { Crumb } from "@/lib/structured-data";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.pages.partner");
  return pageMetadata("/partner", t("title"), t("description"));
}

export default async function PartnerPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const title = t("Metadata.pages.partner.title");
  const description = t("Metadata.pages.partner.description");
  const crumbs: Crumb[] = [
    { href: "/", label: t("nav.home") },
    { href: "/partner", label: t("nav.partner") },
  ];
  const benefits = t.raw("partner.benefits.items") as {
    title: string;
    text: string;
  }[];
  const steps = t.raw("partner.how.steps") as { title: string; text: string }[];
  const ways = t.raw("partner.ways.items") as { title: string; text: string }[];

  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          href: "/partner",
          title,
          description,
          crumbs,
          extra: [
            partnershipService(title, description, pageUrl(locale, "/partner")),
          ],
        })}
      />
      <PageHero
        label={t("partner.label")}
        title={t("partner.title")}
        intro={t("partner.intro")}
        crumbs={crumbs}
        breadcrumbLabel={t("common.breadcrumb")}
      >
        <div className="page-hero__ctas">
          <Button to={{ pathname: "/partner", hash: "form-top" }}>
            {t("partner.cta")}
          </Button>
        </div>
      </PageHero>

      <section className="section section-tight">
        <div className="container">
          <SectionLabel index="01">{t("partner.benefits.title")}</SectionLabel>
          <div className="cards-4 mt-6">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className={`card feature-card ${index % 2 ? "hover-purple" : "hover-lime"}`}
              >
                <div className="feature-card__top">
                  <span className="feature-card__num">
                    <Arrow size={16} /> 0{index + 1}
                  </span>
                  <Star size={20} color="currentColor" />
                </div>
                <h2 className="feature-card__title">{benefit.title}</h2>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
          <PartnerStrip partners={partners} />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionLabel index="02" light>
                {t("partner.how.title")}
              </SectionLabel>
            </div>
            <DotGrid cols={5} rows={3} color="var(--lime)" />
          </div>
          <ol className="journey journey--dark journey--4">
            {steps.map((step, index) => (
              <li className="journey__step" key={step.title}>
                <div className="journey__top">
                  <span className="journey__big">0{index + 1}</span>
                </div>
                <h3 className="journey__title">{step.title}</h3>
                <p>{step.text}</p>
                {index < steps.length - 1 && (
                  <Arrow className="journey__arrow" size={22} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <SectionLabel index="03">{t("partner.ways.title")}</SectionLabel>
          <div className="ways">
            {ways.map((way, index) => (
              <div className="way" key={way.title}>
                <span className="way__num">0{index + 1}</span>
                <h3 className="h3">{way.title}</h3>
                <p>{way.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section form-section section-off" id="form-top">
        <div className="container grid-12">
          <div className="col-4">
            <SectionLabel index="04">{t("partner.form.title")}</SectionLabel>
            <h2 className="h2">{t("partner.form.title")}</h2>
            <p className="muted mt-4">{t("partner.form.intro")}</p>
            <a className="mail-link" href={`mailto:${site.partnerEmail}`}>
              {site.partnerEmail} <Arrow size={16} />
            </a>
          </div>
          <div className="col-8 col-start-5">
            <PartnerForm email={site.partnerEmail || site.contactEmail} />
          </div>
        </div>
      </section>
    </>
  );
}
