import { CasesBrowser } from "@/components/cases-browser";
import { site } from "@/lib/content";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";
import type { Batch } from "@/lib/content";
import type { ReactNode } from "react";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push }),
  Link: ({
    href,
    children,
    scroll,
    ...props
  }: {
    href: string | { pathname: string; params?: { batch: string } };
    children: ReactNode;
    scroll?: boolean;
  }) => {
    const path =
      typeof href === "string"
        ? href
        : href.pathname.replace("[batch]", href.params?.batch ?? "");
    return (
      <a href={path} data-scroll={String(scroll)} {...props}>
        {children}
      </a>
    );
  },
}));

const summer = {
  id: "batch-2",
  name: "Batch #2",
  season: { en: "Summer 2026", tr: "Yaz 2026" },
  start: "2026-06-01",
  end: "2026-08-21",
  status: "ongoing",
  summary: { en: "Three teams.", tr: "Üç takım." },
  photo: "batches/two.jpg",
  teams: [
    {
      id: "alpha",
      name: "Alpha",
      partner: { name: "Acme", website: "https://acme.test", logo: "" },
      challenge: { en: "Ship a checkout", tr: "Ödeme" },
      tags: ["Mobile"],
      members: [
        {
          name: "Grace",
          role: "software-engineer",
          linkedin: "https://linkedin.com/in/grace",
        },
        { name: "Ada", role: "product-manager" },
      ],
    },
  ],
} satisfies Batch;

const upcoming = {
  id: "batch-3",
  name: "Batch #3",
  season: "Winter 2027",
  status: "upcoming",
  photo: "batches/mark.svg",
  teams: [],
} satisfies Batch;

function renderBrowser(batches: Batch[], activeId: string) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CasesBrowser batches={batches} activeId={activeId} />
    </NextIntlClientProvider>,
  );
}

describe("cases browser", () => {
  afterEach(() => {
    push.mockClear();
    window.location.hash = "";
    site.showParticipantLinkedin = false;
  });

  it("renders nothing when there is no batch", () => {
    const { container } = renderBrowser([], "missing");
    expect(container).toBeEmptyDOMElement();
  });

  it("falls back to the first batch and shows its teams", () => {
    renderBrowser([summer, upcoming], "missing");

    expect(screen.getByRole("tab", { name: /Batch #2/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /Batch #3/ })).toHaveAttribute(
      "href",
      "/cases/batch-3",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Batch #2" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ongoing")).toHaveClass("tag-lime");
    expect(screen.getByText("1 Jun 2026 — 21 Aug 2026")).toBeInTheDocument();
    expect(screen.getByText("Three teams.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Batch #2" })).toHaveAttribute(
      "src",
      "/content/images/batches/two.jpg",
    );
    expect(screen.getByRole("link", { name: "Acme" })).toHaveAttribute(
      "href",
      "https://acme.test",
    );
    expect(screen.getByText("Ship a checkout")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();

    const names = screen
      .getAllByText(/Ada|Grace/)
      .map((node) => node.textContent);
    expect(names).toEqual(["Ada", "Grace"]);
    expect(screen.queryByRole("link", { name: /LinkedIn profile/ })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Batch #3/ }));
    expect(push).toHaveBeenCalledWith({
      pathname: "/cases/[batch]",
      params: { batch: "batch-3" },
    });
  });

  it("shows an empty upcoming batch with a plain partner name and a profile link", () => {
    site.showParticipantLinkedin = true;
    renderBrowser(
      [
        {
          ...upcoming,
          teams: [
            {
              id: "beta",
              name: "Beta",
              partner: { name: "No site" },
              members: [
                {
                  name: "Ada",
                  role: "product-manager",
                  linkedin: "https://linkedin.com/in/ada",
                },
                { name: "Grace", role: "software-engineer" },
              ],
            },
          ],
        },
      ],
      "batch-3",
    );

    expect(screen.getByText("Upcoming")).toHaveClass("tag-purple");
    expect(document.querySelector(".batch-overview .label")).toHaveTextContent(
      "Winter 2027",
    );
    expect(screen.getByRole("img", { name: "Batch #3" })).toHaveAttribute(
      "src",
      "/content/images/batches/mark.svg",
    );
    expect(screen.getByText("No site").closest("div")).toHaveClass(
      "partner-mark",
    );
    expect(screen.queryByRole("link", { name: "No site" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "LinkedIn profile of Ada" }),
    ).toHaveAttribute("href", "https://linkedin.com/in/ada");
    expect(
      screen.queryByRole("link", { name: "LinkedIn profile of Grace" }),
    ).toBeNull();
    expect(screen.queryByRole("button", { name: /Batch/ })).toBeNull();
  });

  it("says when a batch has no teams yet and scrolls to a hashed team", () => {
    vi.useFakeTimers();
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    window.location.hash = "#alpha";

    try {
      renderBrowser(
        [{ ...summer, status: "completed", teams: [] }, upcoming],
        "batch-2",
      );
      expect(
        screen.getByText("No teams have been announced for this batch yet."),
      ).toBeInTheDocument();
      expect(screen.getByText("Completed")).not.toHaveClass("tag-lime");

      renderBrowser([summer], "batch-2");
      vi.advanceTimersByTime(50);
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
