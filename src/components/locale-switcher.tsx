"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

type AppLocale = (typeof routing.locales)[number];

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onChange(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(
        { pathname, params } as Parameters<typeof router.replace>[0],
        { locale: nextLocale, scroll: false },
      );
    });
  }

  return (
    <div
      className="lang-toggle"
      role="group"
      aria-label={t("lang")}
      aria-busy={isPending}
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? "is-active" : ""}
          aria-pressed={locale === code}
          disabled={isPending}
          onClick={() => onChange(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
