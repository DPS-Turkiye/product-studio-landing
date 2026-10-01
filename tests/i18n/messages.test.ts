import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";

function messageKeys(value: unknown, prefix = ""): string[] {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      messageKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
}

describe("message catalogs", () => {
  it("keeps English and Turkish keys in sync", () => {
    expect(messageKeys(tr).sort()).toEqual(messageKeys(en).sort());
  });
});
