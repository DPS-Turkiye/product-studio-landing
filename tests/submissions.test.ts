import { validateApplication, validatePartner } from "@/lib/submissions";
import { describe, expect, it } from "vitest";

describe("submission validation", () => {
  it("rejects an empty application and accepts a complete one", () => {
    expect(validateApplication({}).errors.map((error) => error.field)).toEqual(
      expect.arrayContaining([
        "full_name",
        "email",
        "status",
        "role",
        "motivation",
        "available",
        "consent",
      ]),
    );

    const valid = validateApplication({
      full_name: "Ada Lovelace",
      email: "ada@example.com",
      status: "professional",
      role: "software-engineer",
      motivation:
        "I want to build a tested product with a real cross-functional team.",
      available: true,
      consent: true,
      lang: "en",
    });

    expect(valid.errors).toEqual([]);
    expect(valid.data.email).toBe("ada@example.com");
  });

  it("requires a company, contact, interest and consent for partners", () => {
    expect(validatePartner({ company: "A" }).errors.length).toBeGreaterThan(0);
    const valid = validatePartner({
      company: "Northwind",
      contact_name: "Ada Lovelace",
      email: "ada@northwind.example",
      interest: "challenge",
      consent: true,
    });
    expect(valid.errors).toEqual([]);
  });
});
