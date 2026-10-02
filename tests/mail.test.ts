import {
  RESEND_FROM,
  RESEND_TO,
  sendApplication,
  sendPartner,
} from "@/lib/mail";
import { applicationSchema, partnerSchema } from "@/lib/submissions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send, ctor } = vi.hoisted(() => ({
  send: vi.fn(),
  ctor: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
    constructor(key: string) {
      ctor(key);
    }
  },
}));

const motivation =
  "I want to build a tested product with a real cross-functional team.";

function application(overrides: Record<string, unknown> = {}) {
  return applicationSchema.parse({
    full_name: "Ada Lovelace",
    email: "ada@example.com",
    status: "professional",
    role: "software-engineer",
    motivation,
    available: true,
    consent: true,
    ...overrides,
  });
}

function partner(overrides: Record<string, unknown> = {}) {
  return partnerSchema.parse({
    company: "Northwind",
    contact_name: "Ada Lovelace",
    email: "ada@northwind.example",
    interest: "challenge",
    consent: true,
    ...overrides,
  });
}

describe("mail", () => {
  beforeEach(() => {
    send.mockReset();
    ctor.mockReset();
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "re_test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses to send without an api key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendApplication(application())).rejects.toThrow(
      "Resend is not configured",
    );
    expect(send).not.toHaveBeenCalled();
  });

  it("sends an application to the studio inboxes", async () => {
    await sendApplication(
      application({
        phone: "+90 555",
        city: "Ankara",
        institution: "METU",
        field: "Computer engineering",
        linkedin: "https://www.linkedin.com/in/ada",
        portfolio: "https://ada.example",
        experience: "Shipped a payments prototype.",
        heard_from: "A mentor",
      }),
    );

    expect(ctor).toHaveBeenCalledWith("re_test");
    expect(send).toHaveBeenCalledWith({
      from: RESEND_FROM,
      to: RESEND_TO,
      replyTo: "ada@example.com",
      subject: "New application: Ada Lovelace",
      text: [
        "Name: Ada Lovelace",
        "Email: ada@example.com",
        "Phone: +90 555",
        "City: Ankara",
        "Status: Professional",
        "Institution: METU",
        "Field: Computer engineering",
        "Role: Software Engineer",
        "LinkedIn: https://www.linkedin.com/in/ada",
        "Portfolio: https://ada.example",
        "Motivation: " + motivation,
        "Experience: Shipped a payments prototype.",
        "Heard from: A mentor",
        "Available full-time: yes",
        "Language: en",
      ].join("\n"),
    });
  });

  it("labels every role, status, and interest", async () => {
    const roles = [
      ["product-manager", "Product Manager"],
      ["interaction-designer", "Interaction Designer"],
      ["ai-engineer", "AI Engineer"],
    ] as const;
    for (const [role, label] of roles) {
      await sendApplication(application({ role }));
      expect(send.mock.lastCall?.[0].text).toContain(`Role: ${label}`);
    }

    const statuses = [
      ["student", "Student"],
      ["graduate", "Recent graduate"],
      ["other", "Other"],
    ] as const;
    for (const [status, label] of statuses) {
      await sendApplication(application({ status }));
      expect(send.mock.lastCall?.[0].text).toContain(`Status: ${label}`);
    }

    const interests = [
      ["sponsor", "Sponsor"],
      ["mentor", "Mentor"],
      ["other", "Something else"],
    ] as const;
    for (const [interest, label] of interests) {
      await sendPartner(partner({ interest }));
      expect(send.mock.lastCall?.[0].text).toContain(`Interest: ${label}`);
    }
  });

  it("collapses the subject to a single short line and skips blank fields", async () => {
    await sendApplication({
      ...application(),
      full_name: `Ada\n${"Lovelace ".repeat(30)}`,
    });
    const message = send.mock.lastCall?.[0];
    expect(message.subject.startsWith("New application: Ada Lovelace")).toBe(
      true,
    );
    expect(message.subject).not.toMatch(/[\r\n]/);
    expect(message.subject.length).toBeLessThanOrEqual(
      "New application: ".length + 120,
    );
    expect(message.text).not.toContain("Phone:");
    expect(message.text).not.toContain("Experience:");
  });

  it("sends a partner message to the same inboxes", async () => {
    await sendPartner(
      partner({
        website: "https://northwind.example",
        contact_role: "Director",
        phone: "+90 555",
        challenge: "Riders miss connections.",
        heard_from: "Demo day",
        lang: "tr",
      }),
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: RESEND_FROM,
        to: RESEND_TO,
        replyTo: "ada@northwind.example",
        subject: "New partner: Northwind",
      }),
    );
    expect(send.mock.lastCall?.[0].text).toContain(
      "Website: https://northwind.example",
    );
    expect(send.mock.lastCall?.[0].text).toContain("Position: Director");
    expect(send.mock.lastCall?.[0].text).toContain(
      "Interest: Challenge partner",
    );
    expect(send.mock.lastCall?.[0].text).toContain("Language: tr");
  });

  it("raises the provider error", async () => {
    send.mockResolvedValue({ data: null, error: { message: "blocked" } });
    await expect(sendPartner(partner())).rejects.toThrow("blocked");
  });
});
