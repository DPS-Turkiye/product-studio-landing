import { loc } from "@/lib/content";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, SectionLabel } from "./ui";
import type { Mentor } from "@/lib/content";

function LinkedInLink({ href, name }: { href?: string; name: string }) {
  const t = useTranslations("common");
  if (!href) return null;
  return (
    <a
      className="icon-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("linkedin", { name })}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    </a>
  );
}

export function MentorBrowser({ mentors }: { mentors: Mentor[] }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="section" id="mentors">
      <div className="container">
        <div className="section-head">
          <div>
            <SectionLabel index="03">{t("about.mentors.label")}</SectionLabel>
            <h2 className="h2">{t("about.mentors.title")}</h2>
            <p className="body-lg muted mt-4 max-60">
              {t("about.mentors.intro")}
            </p>
          </div>
        </div>

        <div className="mentor-grid">
          {mentors.map((mentor) => (
            <article className="mentor-card" key={mentor.name}>
              <div className="mentor-card__photo">
                <Avatar name={mentor.name} photo={mentor.photo} size="xl" />
              </div>
              <div className="mentor-card__body">
                <div>
                  <h3 className="mentor-card__name">{mentor.name}</h3>
                  <p className="mentor-card__title">
                    {loc(mentor.title, locale)}
                  </p>
                  {mentor.company && (
                    <p className="label muted">{mentor.company}</p>
                  )}
                </div>
                <LinkedInLink href={mentor.linkedin} name={mentor.name} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
