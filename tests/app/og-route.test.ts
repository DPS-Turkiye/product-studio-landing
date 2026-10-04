import { GET } from "@/app/og/[file]/route";
import { renderOgImage } from "@/lib/og-image";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/og-image", () => ({
  renderOgImage: vi.fn(async (locale: string) => new Response(locale)),
}));

function request(file: string) {
  return GET({} as NextRequest, { params: Promise.resolve({ file }) });
}

describe("og image route", () => {
  beforeEach(() => {
    vi.mocked(renderOgImage).mockClear();
  });

  it("serves the turkish card only for tr.png", async () => {
    await request("tr.png");
    expect(renderOgImage).toHaveBeenCalledWith("tr");

    await request("en.png");
    expect(renderOgImage).toHaveBeenLastCalledWith("en");

    await request("missing.png");
    expect(renderOgImage).toHaveBeenLastCalledWith("en");
  });
});
