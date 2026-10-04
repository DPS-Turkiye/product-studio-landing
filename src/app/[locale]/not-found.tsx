import { Star } from "@/components/icons";
import { Button } from "@/components/ui";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return {
    title: { absolute: `${t("title")} — Product Studio` },
    description: t("text"),
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="section not-found">
      <div className="container">
        <p className="display-xl">
          404 <Star size={96} color="var(--purple)" />
        </p>
        <h1 className="h2">{t("title")}</h1>
        <p className="body-lg muted">{t("text")}</p>
        <Button to="/">{t("back")}</Button>
      </div>
    </section>
  );
}
