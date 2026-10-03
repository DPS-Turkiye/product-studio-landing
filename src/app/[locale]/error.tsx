"use client";

import { Arrow, Star } from "@/components/icons";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section not-found">
      <div className="container">
        <p className="display-xl">
          <Star size={96} color="var(--purple)" />
        </p>
        <h1 className="h2">{t("title")}</h1>
        <p className="body-lg muted">{t("text")}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => retry()}
        >
          <span>{t("retry")}</span>
          <Arrow size={16} />
        </button>
      </div>
    </section>
  );
}
