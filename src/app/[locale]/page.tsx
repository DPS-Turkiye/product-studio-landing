import { ApplyCta } from "@/components/apply-cta";
import {
  Arrow,
  ArrowRight,
  DotGrid,
  OutlineIcons,
  Star,
} from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { Button, SectionLabel, Tag } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { batches, loc, site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

const ROLE_KEYS = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
  "ai-engineer",
];
const JOURNEY_ICONS = ["teamup", "learn", "build", "test", "ship"];
const GET_ICONS = ["workshop", "mentor", "teamup", "build", "demo"];

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return pageMetadata("/", t("title"), t("description"));
}

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const lines = t.raw("home.hero.lines") as string[];
  const body = t.raw("home.what.body") as string[];
  const steps = t.raw("home.journey.steps") as {
    title: string;
    text: string;
  }[];
  const words = t.raw("home.equation.words") as string[];
  const getItems = t.raw("home.get.items") as { title: string; text: string }[];
  const marquee = t.raw("home.marquee") as string[];
  const batch = batches[0];
  const teams = batch?.teams.slice(0, 4) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Product Studio",
    description: t("Metadata.description"),
    email: site.contactEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ankara",
      addressCountry: "TR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 className="hero__logo">
              <img
                src="/images/logo.svg"
                alt="Product Studio"
                width={659}
                height={279}
              />
            </h1>
            <p className="hero__lines">
              {lines.map((line, index) => (
                <span
                  key={line}
                  className={index === lines.length - 1 ? "is-lime" : ""}
                >
                  {line}
                </span>
              ))}
            </p>
            <span className="hero__rule" aria-hidden="true" />
            <p className="body-lg hero__intro">{t("home.hero.intro")}</p>
            <div className="hero__ctas">
              <Button to="/apply">{t("home.hero.apply")}</Button>
              <Button to="/partner" variant="ghost">
                {t("home.hero.partner")}
              </Button>
            </div>
          </div>
          <div className="hero__visual">
            <Image
              src="/images/hero.jpg"
              alt="Product Studio participants working together"
              width={882}
              height={941}
              preload
              fetchPriority="high"
              sizes="(max-width: 1000px) 100vw, 720px"
              className="hero__photo"
            />
          </div>
        </div>
        <DotGrid className="hero__dots" color="var(--grey-300)" />
      </section>

      <Marquee items={marquee} />

      <section className="section">
        <div className="container grid-12">
          <div className="col-5">
            <SectionLabel index="02">{t("home.what.label")}</SectionLabel>
            <h2 className="h2">{t("home.what.title")}</h2>
          </div>
          <div className="col-6 col-start-7 what__body">
            {body.map((paragraph) => (
              <p key={paragraph} className="body-lg">
                {paragraph}
              </p>
            ))}
            <p className="what__spinoff">
              <Star size={18} color="var(--purple)" />
              {t("home.what.spinoff")}
            </p>
          </div>
        </div>
        <div className="container stats">
          {site.stats.map((stat) => (
            <div className="stat" key={stat.value + loc(stat.label, locale)}>
              <span className="stat__value">{stat.value}</span>
              <span className="label">{loc(stat.label, locale)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-off" id="journey">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionLabel index="03">{t("home.journey.label")}</SectionLabel>
              <h2 className="h2">{t("home.journey.title")}</h2>
            </div>
            <DotGrid
              cols={5}
              rows={3}
              color="var(--purple)"
              className="section-head__deco"
            />
          </div>
          <ol className="journey">
            {steps.map((step, index) => {
              const Icon = OutlineIcons[JOURNEY_ICONS[index]];
              return (
                <li className="journey__step" key={step.title}>
                  <div className="journey__top">
                    <Icon size={48} />
                    <span className="journey__num">0{index + 1}</span>
                  </div>
                  <h3 className="journey__title">{step.title}</h3>
                  <p>{step.text}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="journey__arrow" size={22} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionLabel index="04">{t("home.roles.label")}</SectionLabel>
          <h2 className="h2 mb-7">{t("home.roles.title")}</h2>
          <div className="cards-4">
            {ROLE_KEYS.map((key, index) => {
              const Icon = OutlineIcons[key];
              return (
                <article
                  className={`card feature-card ${index % 2 ? "hover-purple" : "hover-lime"}`}
                  key={key}
                >
                  <div className="feature-card__top">
                    <span className="feature-card__num">
                      <Arrow size={16} /> 0{index + 1}
                    </span>
                    <Star size={20} color="currentColor" />
                  </div>
                  <Icon size={44} />
                  <h3 className="feature-card__title">{t(`roles.${key}`)}</h3>
                  <p>{t(`home.roles.items.${key}`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-dark equation">
        <div className="container equation__inner">
          {words.map((word, index) => (
            <div
              key={word}
              className="equation__row"
              style={{ ["--i" as string]: index }}
            >
              {index > 0 && <span className="equation__op">+</span>}
              <span className="equation__word">{word}</span>
            </div>
          ))}
          <div className="equation__row equation__row--result">
            <span className="equation__op">=</span>
            <span className="equation__word">{t("home.equation.result")}</span>
            <Star size={80} color="var(--lime)" className="equation__star" />
          </div>
        </div>
      </section>

      {batch && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <SectionLabel index="05">
                  {t("home.projects.label")}
                </SectionLabel>
                <h2 className="h2">{t("home.projects.title")}</h2>
              </div>
              <Button to="/cases" variant="ghost">
                {t("home.projects.cta")}
              </Button>
            </div>
            <div className="project-grid">
              <div className="project-feature">
                <Image
                  src="/images/team-table.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  className="project-image"
                  style={{ objectFit: "cover" }}
                />
                <div className="project-feature__caption">
                  <Tag variant="lime">{batch.name}</Tag>
                  <span className="label">{loc(batch.season, locale)}</span>
                </div>
              </div>
              <div className="project-list">
                {teams.map((team) => (
                  <Link
                    href={{
                      pathname: "/cases/[batch]",
                      params: { batch: batch.id },
                      hash: team.id,
                    }}
                    className="project-item"
                    key={team.id}
                  >
                    <span className="label muted">{team.partner.name}</span>
                    <h3 className="project-item__title">
                      {loc(team.challenge, locale)}
                    </h3>
                    <span className="project-item__meta">
                      {team.name} <Arrow size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section section-off">
        <div className="container">
          <SectionLabel index="06">{t("home.get.label")}</SectionLabel>
          <h2 className="h2 mb-7">{t("home.get.title")}</h2>
          <ul className="get-list">
            {getItems.map((item, index) => {
              const Icon = OutlineIcons[GET_ICONS[index]];
              return (
                <li key={item.title} className="get-item">
                  <Icon size={40} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ApplyCta />
    </>
  );
}
