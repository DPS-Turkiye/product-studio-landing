import { routing } from "@/i18n/routing";
import { describe, expect, it } from "vitest";

describe("routing", () => {
  it("uses English as the unprefixed default and Turkish as a prefixed locale", () => {
    expect(routing.locales).toEqual(["en", "tr"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
  });
});
