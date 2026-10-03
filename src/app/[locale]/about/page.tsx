import { ApplyCta } from "@/components/apply-cta";
import { DotGrid, Star } from "@/components/icons";
import { MentorBrowser } from "@/components/mentor-browser";
import { PageHero, SectionLabel } from "@/components/ui";
import { mentors } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  return pageMetadata(
    "/about",
    `${t("nav.about")} — Product Studio`,
    t("about.intro"),
  );
}

export default async function AboutPage() {
  const t = await getTranslations();
  const story = t.raw("about.story.body") as string[];
  const values = t.raw("about.values.items") as {
    title: string;
    text: string;
  }[];

  return (
    <>
      <PageHero
        label={t("about.label")}
        title={t("about.title")}
        intro={t("about.intro")}
      />

      <section className="section section-tight">
        <div className="container grid-12">
          <div className="col-5">
            <SectionLabel index="01">{t("about.story.title")}</SectionLabel>
            <div className="about-photo">
              <Image
                src="/images/team-table.jpg"
                alt=""
                fill
                priority
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
