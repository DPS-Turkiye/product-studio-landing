import CatchAllPage from "@/app/[locale]/[...rest]/page";
import { describe, expect, it } from "vitest";

describe("unknown routes", () => {
  it("renders the not-found page", () => {
    expect(() => CatchAllPage()).toThrow();
  });
});
