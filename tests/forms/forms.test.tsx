import { ApplicationForm, PartnerForm } from "@/components/forms";
import { api } from "@/lib/api";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderForm } from "./render-form";

const motivation =
  "I want to build a tested product with a real cross-functional team.";

function axiosError(status: number, data: unknown) {
  const headers = new AxiosHeaders();
  return new AxiosError("fail", String(status), { headers }, null, {
    status,
    statusText: "error",
    headers,
    config: { headers },
    data,
  });
}

function control(name: string) {
  return screen.getByLabelText(
    (content) => content.replaceAll("*", "").trim() === name,
  );
}

function type(name: string, value: string) {
  fireEvent.change(control(name), { target: { value } });
}

async function submitApplication() {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
}

describe("application form", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a required message for every empty required field", async () => {
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    await submitApplication();

    expect(await screen.findAllByText("This field is required.")).toHaveLength(
      7,
    );
  });

  it("shows email, url, and length errors", async () => {
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    type("Full name", "Ada Lovelace");
    type("Email", "not-an-email");
    fireEvent.change(control("Current status"), {
      target: { value: "professional" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Software Engineer" }));
    type("LinkedIn profile", "not a url");
    type("Why do you want to join Product Studio?", "Too short");
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /full-time/,
      }),
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /KVKK/ }));
    await submitApplication();

    expect(
      await screen.findByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid URL.")).toBeInTheDocument();
    expect(screen.getByText("Please write a bit more.")).toBeInTheDocument();
  });

  it("posts the application and then resets from the success panel", async () => {
    const post = vi
      .spyOn(api, "post")
      .mockResolvedValue({ data: { ok: true } });
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />, "tr");

    type("Ad soyad", "Ada Lovelace");
    type("E-posta", "ada@example.com");
    fireEvent.change(control("Mevcut durum"), {
      target: { value: "graduate" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Yazılım Mühendisi" }));
    type("Neden Product Studio’ya katılmak istiyorsun?", motivation);
    fireEvent.click(screen.getByRole("checkbox", { name: /tam zamanlı/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /KVKK/ }));
    fireEvent.click(screen.getByRole("button", { name: "Gönder" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Başvurun alındı",
    );
    expect(post).toHaveBeenCalledWith(
      "/api/applications",
      expect.objectContaining({
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        role: "software-engineer",
        lang: "tr",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Yeni gönderim" }));
    expect(control("Ad soyad")).toHaveValue("");
  });

  it("maps a 422 onto the matching field", async () => {
    vi.spyOn(api, "post").mockRejectedValue(
      axiosError(422, { fields: [{ field: "email", code: "invalid_email" }] }),
    );
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    type("Full name", "Ada Lovelace");
    type("Email", "ada@example.com");
    fireEvent.change(control("Current status"), {
      target: { value: "other" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "AI Engineer" }));
    type("Why do you want to join Product Studio?", motivation);
    fireEvent.click(screen.getByRole("checkbox", { name: /full-time/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /personal data/ }));
    await submitApplication();

    expect(
      await screen.findByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it("shows the mailbox fallback when sending fails", async () => {
    vi.spyOn(api, "post").mockRejectedValue(new Error("down"));
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    type("Full name", "Ada Lovelace");
    type("Email", "ada@example.com");
    fireEvent.change(control("Current status"), {
      target: { value: "student" },
    });
    fireEvent.click(
      screen.getByRole("radio", { name: "Interaction Designer" }),
    );
    type("Why do you want to join Product Studio?", motivation);
    fireEvent.click(screen.getByRole("checkbox", { name: /full-time/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /personal data/ }));
    await submitApplication();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "hello@productstudio.com.tr",
    );
  });

  it("disables the button while the request is in flight", async () => {
    let resolve: (value: { data: { ok: boolean } }) => void = () => {};
    vi.spyOn(api, "post").mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    type("Full name", "Ada Lovelace");
    type("Email", "ada@example.com");
    fireEvent.change(control("Current status"), {
      target: { value: "professional" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Product Manager" }));
    type("Why do you want to join Product Studio?", motivation);
    fireEvent.click(screen.getByRole("checkbox", { name: /full-time/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /personal data/ }));
    await submitApplication();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled(),
    );
    resolve({ data: { ok: true } });
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("keeps the honeypot out of the way", () => {
    renderForm(<ApplicationForm email="hello@productstudio.com.tr" />);
    expect(
      screen.getByRole("textbox", { name: "Website", hidden: true }),
    ).toHaveAttribute("tabindex", "-1");
  });
});

describe("partner form", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requires company, contact, email, interest, and consent", async () => {
    renderForm(<PartnerForm email="partners@productstudio.com.tr" />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findAllByText("This field is required.")).toHaveLength(
      5,
    );
  });

  it("posts a partner enquiry", async () => {
    const post = vi
      .spyOn(api, "post")
      .mockResolvedValue({ data: { ok: true } });
    renderForm(<PartnerForm email="partners@productstudio.com.tr" />);
    type("Company", "Northwind");
    type("Your name", "Ada Lovelace");
    type("Email", "ada@northwind.example");
    type("Company website", "not a url");
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("Please enter a valid URL."),
    ).toBeInTheDocument();

    type("Company website", "https://northwind.example");
    fireEvent.click(screen.getByRole("radio", { name: "Challenge partner" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /contact me/ }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thanks for reaching out",
    );
    expect(post).toHaveBeenCalledWith(
      "/api/partners",
      expect.objectContaining({
        company: "Northwind",
        interest: "challenge",
        lang: "en",
      }),
    );
  });

  it("shows an unknown server code as a required field error", async () => {
    vi.spyOn(api, "post").mockRejectedValue(
      axiosError(422, { fields: [{ field: "company", code: "nope" }] }),
    );
    renderForm(<PartnerForm email="partners@productstudio.com.tr" />);
    type("Company", "Northwind");
    type("Your name", "Ada Lovelace");
    type("Email", "ada@northwind.example");
    fireEvent.click(screen.getByRole("radio", { name: "Sponsor" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /contact me/ }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const company = await screen.findByLabelText(
      (content) => content.replaceAll("*", "").trim() === "Company",
    );
    expect(company).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });
});
