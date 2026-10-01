import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/middleware", () => ({
  default: vi.fn(),
}));

describe("proxy middleware config", () => {
  it("skips api routes, next internals, and static files", async () => {
    const { config } = await import("@/proxy");

    expect(config.matcher).toBe("/((?!api|trpc|_next|_vercel|.*\\..*).*)");
  });
});
