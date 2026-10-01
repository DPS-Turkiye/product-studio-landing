import { formatDate, formatRange, img, initials, loc } from "@/lib/content";
import { describe, expect, it } from "vitest";

describe("content helpers", () => {
  it("resolves locale text", () => {
    expect(loc(undefined, "en")).toBe("");
    expect(loc("Ankara", "tr")).toBe("Ankara");
    expect(loc({ en: "Batches", tr: "Dönem" }, "en")).toBe("Batches");
    expect(loc({ en: "Batches", tr: "Dönem" }, "tr")).toBe("Dönem");
    expect(loc({ en: "Batches", tr: "Dönem" }, "de")).toBe("Batches");
  });

  it("resolves image paths", () => {
    expect(img()).toBeNull();
    expect(img("")).toBeNull();
    expect(img("mentors/ada.jpg")).toBe("/content/images/mentors/ada.jpg");
    expect(img("/images/logo.svg")).toBe("/images/logo.svg");
    expect(img("https://cdn.example/a.jpg")).toBe("https://cdn.example/a.jpg");
    expect(img("//cdn.example/a.jpg")).toBe("//cdn.example/a.jpg");
  });

  it("builds initials from the first two words", () => {
    expect(initials()).toBe("");
    expect(initials("   ")).toBe("");
    expect(initials("Ada")).toBe("A");
    expect(initials("  ada   lovelace  extra ")).toBe("AL");
  });

  it("formats dates and ranges without padding the day", () => {
    expect(formatDate(undefined, "en")).toBe("");
    expect(formatDate("2026-01-05", "en")).toBe("5 Jan 2026");
    expect(formatDate("2026-08-01", "tr")).toBe("1 Ağu 2026");
    expect(formatRange("2027-02-15", "2027-05-07", "en")).toBe(
      "15 Feb 2027 — 7 May 2027",
    );
    expect(formatRange("2027-02-15", "2027-05-07", "tr")).toBe(
      "15 Şub 2027 — 7 May 2027",
    );
  });
});
