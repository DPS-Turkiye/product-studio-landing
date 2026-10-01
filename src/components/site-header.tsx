"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Arrow } from "./icons";

const NAV = [
  { to: "/cases", key: "cases" },
  { to: "/about", key: "about" },
  { to: "/partner", key: "partner" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header
      className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${pathname === "/" ? "is-home" : ""}`}
    >
      <div className="container nav__inner">
        <Link href="/" className="nav__logo" aria-label="Product Studio — home">
          <img src="/images/logo.svg" alt="Product Studio" />
        </Link>

        <nav className="nav__links" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`nav__link ${isActive(item.to) ? "is-active" : ""}`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <div className="lang-toggle" role="group" aria-label={t("lang")}>
            {(["en", "tr"] as const).map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                className={locale === code ? "is-active" : ""}
                hrefLang={code}
                aria-current={locale === code ? "true" : undefined}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link href="/apply" className="btn btn-primary btn-sm nav__apply">
            <span>{t("apply")}</span>
            <Arrow size={14} />
          </Link>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("close") : t("menu")}
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          {[
            { to: "/", key: "home" },
            ...NAV,
            { to: "/apply", key: "apply" },
          ].map((item, index) => (
            <Link
              key={item.to}
              href={item.to}
              className={`mobile-menu__link ${pathname === item.to ? "is-active" : ""}`}
            >
              <span className="mobile-menu__index">0{index + 1}</span>
              {t(item.key)}
              <Arrow size={28} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
