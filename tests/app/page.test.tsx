import { formatDate, loc } from "@/lib/content";
import { describe, expect, it } from "vitest";

describe("content helpers", () => {
  it("picks the locale string and formats dates the way the site does", () => {
    expect(loc({ en: "Batches", tr: "Dönem" }, "tr")).toBe("Dönem");
    expect(formatDate("2026-12-15", "en")).toBe("15 Dec 2026");
    expect(formatDate("2026-12-15", "tr")).toBe("15 Ara 2026");
  });
});
