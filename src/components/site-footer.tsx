import { Link } from "@/i18n/navigation";
import { loc, site } from "@/lib/content";
import { getLocale, getTranslations } from "next-intl/server";
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from "./icons";

const NAV = [
  { to: "/cases", key: "cases" },
  { to: "/about", key: "about" },
  { to: "/partner", key: "partner" },
] as const;

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = await getLocale();
  const year = new Date().getFullYear();
  const social = site.social;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src="/images/logo-white.svg"
              alt="Product Studio"
              className="footer__logo"
              width={659}
              height={279}
            />
            <p className="footer__tagline">{t("footer.tagline")}</p>
          </div>

          <nav className="footer__col" aria-label={t("footer.pages")}>
            <p className="label">{t("footer.pages")}</p>
            <Link href="/">{t("nav.home")}</Link>
            {NAV.map((item) => (
              <Link key={item.to} href={item.to}>
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <Link href="/apply">{t("nav.apply")}</Link>
          </nav>

          <address className="footer__col">
            <p className="label">{t("footer.contact")}</p>
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            {site.partnerEmail !== site.contactEmail && (
              <a href={`mailto:${site.partnerEmail}`}>{site.partnerEmail}</a>
            )}
            <span className="muted">{loc(site.location, locale)}</span>
          </address>

          <div className="footer__col">
            <p className="label">{t("footer.follow")}</p>
            <div className="footer__social">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon size={20} />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <YouTubeIcon size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <a
            className="footer__dps"
            href="https://www.digitalproductschool.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t("common.supportedBy")}</span>
            <img
              src="/images/dps-logo-white.svg"
              alt="Digital Product School"
              width={346}
              height={114}
            />
          </a>
          <p className="muted">
            © {year} Product Studio. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
