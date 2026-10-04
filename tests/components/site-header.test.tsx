import { SiteHeader } from "@/components/site-header";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";
import type { ReactNode } from "react";

const nav = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("@/components/locale-switcher", () => ({
  LocaleSwitcher: () => <div>languages</div>,
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => nav.pathname,
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderHeader() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SiteHeader />
    </NextIntlClientProvider>,
  );
}

describe("site header", () => {
  it("marks the home page and adds the scrolled state after 24px", () => {
    nav.pathname = "/";
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });
    renderHeader();

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("is-home");
    expect(header).not.toHaveClass("is-scrolled");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 25,
    });
    fireEvent.scroll(window);
    expect(header).toHaveClass("is-scrolled");
  });

  it("highlights the section for nested routes and locks scroll while the menu is open", () => {
    nav.pathname = "/cases/batch-2";
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });
    renderHeader();

    const header = screen.getByRole("banner");
    expect(header).not.toHaveClass("is-home");
    expect(screen.getByRole("link", { name: "Cases" })).toHaveClass(
      "is-active",
    );
    expect(screen.getByRole("link", { name: "About us" })).not.toHaveClass(
      "is-active",
    );

    const burger = screen.getByRole("button", { name: "Menu" });
    expect(burger).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(burger);
    expect(header).toHaveClass("is-open");
    expect(burger).toHaveAttribute("aria-expanded", "true");
    expect(burger).toHaveAttribute("aria-label", "Close");
    expect(document.body.style.overflow).toBe("hidden");
    const menu = document.getElementById("mobile-menu");
    const mobileCases = menu?.querySelector('a[href="/cases"]');
    expect(menu?.querySelector('a[href="/"]')).toHaveTextContent("Home");
    expect(mobileCases).not.toHaveClass("is-active");

    fireEvent.click(burger);
    expect(header).not.toHaveClass("is-open");
    expect(document.body.style.overflow).toBe("");
  });
});
