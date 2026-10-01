import { afterEach, describe, expect, it, vi } from "vitest";

const { sendApplication, sendPartner } = vi.hoisted(() => ({
  sendApplication: vi.fn(),
  sendPartner: vi.fn(),
}));

vi.mock("@/lib/mail", () => ({
  sendApplication,
  sendPartner,
}));

async function routes() {
  return {
    postApplication: (await import("@/app/api/applications/route")).POST,
    postPartner: (await import("@/app/api/partners/route")).POST,
  };
}

const motivation =
  "I want to build a tested product with a real cross-functional team.";

function call(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("submission routes", () => {
  afterEach(() => {
    sendApplication.mockReset();
    sendPartner.mockReset();
  });

  it("stores an application through the application sender", async () => {
    const { postApplication } = await routes();
    const response = await postApplication(
      call("http://localhost/api/applications", {
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        status: "student",
        role: "product-manager",
        motivation,
        available: true,
        consent: true,
        lang: "tr",
      }),
    );

    expect(response.status).toBe(201);
    expect(sendApplication).toHaveBeenCalledOnce();
    expect(sendPartner).not.toHaveBeenCalled();
    expect(sendApplication.mock.calls[0][0].role).toBe("product-manager");
  });

  it("rejects an application that is missing its role", async () => {
    const { postApplication } = await routes();
    const response = await postApplication(
      call("http://localhost/api/applications", {
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        motivation,
        available: true,
        consent: true,
      }),
    );
    expect(response.status).toBe(422);
    expect(sendApplication).not.toHaveBeenCalled();
  });

  it("stores a partner through the partner sender", async () => {
    const { postPartner } = await routes();
    const response = await postPartner(
      call("http://localhost/api/partners", {
        company: "Northwind",
        contact_name: "Ada Lovelace",
        email: "ada@northwind.example",
        interest: "mentor",
        consent: true,
      }),
    );

    expect(response.status).toBe(201);
    expect(sendPartner).toHaveBeenCalledOnce();
    expect(sendApplication).not.toHaveBeenCalled();
  });

  it("does not mail a partner honeypot", async () => {
    const { postPartner } = await routes();
    const response = await postPartner(
      call("http://localhost/api/partners", {
        website_url: "https://spam.test",
      }),
    );
    expect(response.status).toBe(201);
    expect(sendPartner).not.toHaveBeenCalled();
  });
});
