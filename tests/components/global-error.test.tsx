import GlobalError from "@/app/global-error";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/font", () => ({
  spaceGrotesk: { className: "font-space" },
}));

describe("global error", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs the failure and retries in English", () => {
    const error = new Error("root");
    const retry = vi.fn();
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<GlobalError error={error} retry={retry} />);

    expect(
      screen.getByRole("heading", { name: "Something went wrong." }),
    ).toBeInTheDocument();
    expect(logged).toHaveBeenCalledWith(error);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
