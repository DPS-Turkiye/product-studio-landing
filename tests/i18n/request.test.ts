import getRequestConfig from "@/i18n/request";
import * as rootParams from "next/root-params";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getRequestConfig: (create: (params: unknown) => unknown) => create,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

vi.mock("next/root-params", () => ({
  locale: vi.fn(),
}));

describe("request config", () => {
  beforeEach(() => {
    vi.mocked(rootParams.locale).mockReset();
  });

  it("loads messages for an explicit locale without reading the segment", async () => {
    const config = await getRequestConfig({
      locale: "tr",
      requestLocale: Promise.resolve("en"),
    });

    expect(rootParams.locale).not.toHaveBeenCalled();
    expect(config.locale).toBe("tr");
    expect(config.messages).toHaveProperty("nav");
  });

  it("falls back to the root locale param when none was passed", async () => {
    vi.mocked(rootParams.locale).mockResolvedValue("en");

    const config = await getRequestConfig({
      requestLocale: Promise.resolve(undefined),
    });

    expect(config.locale).toBe("en");
    expect(config.messages).toHaveProperty("nav");
  });

  it("stops the request when the root locale is not supported", async () => {
    vi.mocked(rootParams.locale).mockResolvedValue("de");

    await expect(
      getRequestConfig({ requestLocale: Promise.resolve(undefined) }),
    ).rejects.toThrow("NOT_FOUND");
  });
});
