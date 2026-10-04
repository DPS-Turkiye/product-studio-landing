import { ApplyCta } from "@/components/apply-cta";
import { DotGrid, Star } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { MentorBrowser } from "@/components/mentor-browser";
import { PageHero, SectionLabel } from "@/components/ui";
import { mentors } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { mentorList, pageGraph, pageUrl } from "@/lib/structured-data";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Crumb } from "@/lib/structured-data";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.pages.about");
  return pageMetadata("/about", t("title"), t("description"));
}

export default async function AboutPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const title = t("Metadata.pages.about.title");
  const description = t("Metadata.pages.about.description");
  const crumbs: Crumb[] = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
  ];
  const story = t.raw("about.story.body") as string[];
  const values = t.raw("about.values.items") as {
    title: string;
    text: string;
  }[];

  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          href: "/about",
          title,
          description,
          crumbs,
          image: "/images/team-table.jpg",
          extra: [
            mentorList(
              locale,
              mentors,
              pageUrl(locale, "/about"),
              t("about.mentors.title"),
            ),
          ],
        })}
      />
      <PageHero
        label={t("about.label")}
        title={t("about.title")}
        intro={t("about.intro")}
        crumbs={crumbs}
        breadcrumbLabel={t("common.breadcrumb")}
      />

      <section className="section section-tight">
        <div className="container grid-12">
          <div className="col-5">
            <SectionLabel index="01">{t("about.story.title")}</SectionLabel>
            <div className="about-photo">
              <Image
                src="/images/team-table.jpg"
                alt={t("media.teamAlt")}
                fill
                loading="eager"
                sizes="(max-width: 1000px) 100vw, 42vw"
                className="project-image"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-6 col-start-7 about-story">
            {story.map((paragraph) => (
              <p key={paragraph} className="body-lg">
                {paragraph}
              </p>
            ))}
            <a
              className="dps-badge"
              href="https://www.digitalproductschool.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="label">{t("common.supportedBy")}</span>
              <img
                src="/images/dps-logo.svg"
                alt="Digital Product School"
                width={346}
                height={114}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionLabel index="02" light>
                {t("about.values.title")}
              </SectionLabel>
            </div>
            <DotGrid cols={5} rows={3} color="var(--lime)" />
          </div>
          <div className="values">
            {values.map((value, index) => (
              <div className="value" key={value.title}>
                <Star
                  size={28}
                  color={index % 2 ? "var(--purple)" : "var(--lime)"}
                />
                <h2 className="h3">{value.title}</h2>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MentorBrowser mentors={mentors} />
      <ApplyCta />
    </>
  );
}
