import ErrorPage from "@/app/[locale]/error";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";

describe("error page", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs the error and retries when asked", () => {
    const error = Object.assign(new Error("boom"), { digest: "abc" });
    const retry = vi.fn();
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <ErrorPage error={error} retry={retry} />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong." }),
    ).toBeInTheDocument();
    expect(logged).toHaveBeenCalledWith(error);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
