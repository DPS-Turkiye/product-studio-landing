import { ApplicationForm } from "@/components/forms";
import { Arrow, OutlineIcons, Star } from "@/components/icons";
import { PageHero, SectionLabel } from "@/components/ui";
import { formatDate, formatRange, loc, site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";

const ROLES = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
  "ai-engineer",
];

export async function generateMetadata() {
  const t = await getTranslations();
  return pageMetadata(
    "/apply",
    `${t("nav.apply")} — Product Studio`,
    t("apply.intro"),
  );
}

export default async function ApplyPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const applications = site.applications;
  const who = t.raw("apply.who.items") as string[];
  const steps = t.raw("apply.process.steps") as {
    title: string;
    text: string;
  }[];
  const faq = t.raw("apply.faq.items") as { q: string; a: string }[];

  return (
    <>
      <PageHero
        label={t("apply.label")}
        title={t("apply.title")}
        intro={t("apply.intro")}
      >
        <dl className="key-facts">
          <div>
            <dt className="label">{t("common.programDates")}</dt>
            <dd>
              {formatRange(
                applications.programStart,
                applications.programEnd,
                locale,
              )}
            </dd>
          </div>
          {applications.open && (
            <div>
              <dt className="label">{t("common.deadline")}</dt>
              <dd>{formatDate(applications.deadline, locale)}</dd>
            </div>
          )}
          <div>
            <dt className="label">{t("common.format")}</dt>
            <dd>
              {loc(applications.format, locale)} · {applications.durationWeeks}{" "}
              {t("common.weeks")}
            </dd>
          </div>
        </dl>
      </PageHero>

      {!applications.open && (
        <div className="container">
          <div className="notice">
            <strong>{t("apply.closedTitle")}</strong> {t("apply.closedText")}
          </div>
        </div>
      )}

      <section className="section section-tight">
        <div className="container">
          <SectionLabel index="01">{t("apply.rolesTitle")}</SectionLabel>
          <div className="cards-4 mt-6">
            {ROLES.map((role, index) => {
              const Icon = OutlineIcons[role];
              return (
                <article
                  key={role}
                  className={`card feature-card ${index % 2 ? "hover-purple" : "hover-lime"}`}
                >
                  <div className="feature-card__top">
                    <span className="feature-card__num">
                      <Arrow size={16} /> 0{index + 1}
                    </span>
                    <Star size={20} color="currentColor" />
                  </div>
                  <Icon size={44} />
                  <h3 className="feature-card__title">{t(`roles.${role}`)}</h3>
                  <p>{t(`home.roles.items.${role}`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-off">
        <div className="container grid-12">
          <div className="col-5">
            <SectionLabel index="02">{t("apply.who.title")}</SectionLabel>
            <ul className="check-list">
              {who.map((item) => (
                <li key={item}>
                  <Star size={16} color="var(--purple)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-start-7">
            <SectionLabel index="03">{t("apply.process.title")}</SectionLabel>
            <ol className="steps">
              {steps.map((step, index) => (
                <li key={step.title} className="step">
                  <span className="step__num">0{index + 1}</span>
                  <div>
                    <h3 className="step__title">{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section form-section" id="form-top">
        <div className="container grid-12">
          <div className="col-4">
            <SectionLabel index="04">{t("apply.form.title")}</SectionLabel>
            <h2 className="h2">{t("apply.form.title")}</h2>
            <p className="muted mt-4">{t("apply.form.intro")}</p>
          </div>
          <div className="col-8 col-start-5">
            <ApplicationForm email={site.contactEmail} />
          </div>
        </div>
      </section>

      <section className="section section-off">
        <div className="container grid-12">
          <div className="col-4">
            <SectionLabel index="05">{t("apply.faq.title")}</SectionLabel>
          </div>
          <div className="col-8 col-start-5 faq">
            {faq.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  {item.q}
                  <span className="faq__icon" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
