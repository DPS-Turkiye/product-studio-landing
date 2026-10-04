import { LocaleSwitcher } from "@/components/locale-switcher";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";

const replace = vi.hoisted(() => vi.fn());

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/cases/[batch]",
  useRouter: () => ({ replace }),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en", batch: "batch-2" }),
}));

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  );
}

describe("locale switcher", () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it("marks the current language and leaves the page in place", () => {
    renderSwitcher();

    const group = screen.getByRole("group", { name: "Language" });
    expect(group).toHaveAttribute("aria-busy", "false");
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "TR" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(replace).not.toHaveBeenCalled();
  });

  it("switches locale without scrolling and keeps the current route params", () => {
    renderSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "TR" }));

    expect(replace).toHaveBeenCalledWith(
      {
        pathname: "/cases/[batch]",
        params: { locale: "en", batch: "batch-2" },
      },
      { locale: "tr", scroll: false },
    );
  });
});
