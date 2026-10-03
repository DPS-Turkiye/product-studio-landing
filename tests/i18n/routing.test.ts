import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { describe, expect, it } from "vitest";

describe("routing", () => {
  it("uses English as the unprefixed default and Turkish as a prefixed locale", () => {
    expect(routing.locales).toEqual(["en", "tr"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
  });

  it("localizes pathnames from the navigation labels", () => {
    expect(getPathname({ locale: "en", href: "/" })).toBe("/");
    expect(getPathname({ locale: "tr", href: "/" })).toBe("/tr");

    expect(getPathname({ locale: "en", href: "/cases" })).toBe("/cases");
    expect(getPathname({ locale: "tr", href: "/cases" })).toBe("/tr/projeler");

    expect(getPathname({ locale: "en", href: "/about" })).toBe("/about-us");
    expect(getPathname({ locale: "tr", href: "/about" })).toBe(
      "/tr/hakkimizda",
    );

    expect(getPathname({ locale: "en", href: "/partner" })).toBe(
      "/become-a-partner",
    );
    expect(getPathname({ locale: "tr", href: "/partner" })).toBe(
      "/tr/partner-ol",
    );

    expect(getPathname({ locale: "en", href: "/apply" })).toBe("/apply-now");
    expect(getPathname({ locale: "tr", href: "/apply" })).toBe("/tr/basvur");

    const batch = {
      pathname: "/cases/[batch]" as const,
      params: { batch: "batch-2" },
    };
    expect(getPathname({ locale: "en", href: batch })).toBe("/cases/batch-2");
    expect(getPathname({ locale: "tr", href: batch })).toBe(
      "/tr/projeler/batch-2",
    );
  });
});
