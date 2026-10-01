import Home from "@/app/[locale]/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("home page", () => {
  it("renders the landing heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Hello World" }),
    ).toBeInTheDocument();
  });
});
