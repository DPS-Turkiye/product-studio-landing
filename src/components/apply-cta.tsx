import { Link } from "@/i18n/navigation";
import { formatDate, site } from "@/lib/content";
import { getLocale, getTranslations } from "next-intl/server";
import { Arrow } from "./icons";

export async function ApplyCta() {
  const t = await getTranslations();
  const locale = await getLocale();
  const applications = site.applications;
  const lines = t.raw("home.cta.lines") as string[];

  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2 className="display-lg cta__lines">
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="body-lg cta__text">
            {applications.open
              ? t("home.cta.text", {
                  batch: applications.batch,
                  deadline: formatDate(applications.deadline, locale),
                })
              : t("home.cta.closed")}
          </p>
        </div>
        <Link
          href="/apply"
          className="cta__button"
          aria-label={t("home.cta.button")}
        >
          <Arrow size={140} strokeWidth={2} />
          <span className="cta__button-label">{t("home.cta.button")}</span>
        </Link>
      </div>
    </section>
  );
}
