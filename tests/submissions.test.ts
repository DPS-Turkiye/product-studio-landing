import {
  INTERESTS,
  ROLES,
  STATUSES,
  acceptSubmission,
  applicationSchema,
  fieldErrors,
  partnerSchema,
} from "@/lib/submissions";
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

const motivation =
  "I want to build a tested product with a real cross-functional team.";

const application = {
  full_name: "  Ada Lovelace  ",
  email: "Ada@Example.com",
  phone: "  ",
  status: "professional",
  role: "software-engineer",
  linkedin: "https://www.linkedin.com/in/ada",
  motivation,
  available: true,
  consent: true,
};

function codes(result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[]; message: string }[] };
}) {
  if (result.success || !result.error) return [];
  return fieldErrors(result.error as Parameters<typeof fieldErrors>[0]);
}

describe("application schema", () => {
  it("rejects an empty payload on every required field", () => {
    const fields = codes(applicationSchema.safeParse({}));
    expect(fields.map((error) => error.field).sort()).toEqual(
      [
        "available",
        "consent",
        "email",
        "full_name",
        "motivation",
        "role",
        "status",
      ].sort(),
    );
    expect(fields.every((error) => error.code === "required")).toBe(true);
  });

  it("trims text, lowercases email, and fills defaults", () => {
    const parsed = applicationSchema.parse(application);
    expect(parsed.full_name).toBe("Ada Lovelace");
    expect(parsed.email).toBe("ada@example.com");
    expect(parsed.phone).toBe("");
    expect(parsed.city).toBe("");
    expect(parsed.lang).toBe("en");
    expect(parsed.website_url).toBe("");
  });

  it("accepts every role and status", () => {
    for (const role of ROLES) {
      expect(
        applicationSchema.safeParse({ ...application, role }).success,
      ).toBe(true);
    }
    for (const status of STATUSES) {
      expect(
        applicationSchema.safeParse({ ...application, status }).success,
      ).toBe(true);
    }
  });

  it("rejects short, blank, oversized, and unknown values", () => {
    expect(
      codes(applicationSchema.safeParse({ ...application, full_name: "  " })),
    ).toEqual(
      expect.arrayContaining([{ field: "full_name", code: "required" }]),
    );
    expect(
      codes(applicationSchema.safeParse({ ...application, full_name: "Ad" })),
    ).toEqual(
      expect.arrayContaining([{ field: "full_name", code: "too_short" }]),
    );
    expect(
      codes(
        applicationSchema.safeParse({
          ...application,
          full_name: "A".repeat(121),
        }),
      ),
    ).toEqual(
      expect.arrayContaining([{ field: "full_name", code: "invalid" }]),
    );
    expect(
      codes(
        applicationSchema.safeParse({ ...application, email: "not-an-email" }),
      ),
    ).toEqual([{ field: "email", code: "invalid_email" }]);
    expect(
      codes(applicationSchema.safeParse({ ...application, status: "founder" })),
    ).toEqual([{ field: "status", code: "invalid" }]);
    expect(
      codes(applicationSchema.safeParse({ ...application, role: "" })),
    ).toEqual([{ field: "role", code: "required" }]);
    expect(
      codes(
        applicationSchema.safeParse({
          ...application,
          motivation: "x".repeat(49),
        }),
      ),
    ).toEqual([{ field: "motivation", code: "too_short" }]);
    expect(
      applicationSchema.safeParse({
        ...application,
        motivation: "x".repeat(50),
      }).success,
    ).toBe(true);
    expect(
      codes(
        applicationSchema.safeParse({
          ...application,
          motivation: "x".repeat(3001),
        }),
      ),
    ).toEqual([{ field: "motivation", code: "invalid" }]);
    expect(
      codes(applicationSchema.safeParse({ ...application, available: false })),
    ).toEqual([{ field: "available", code: "required" }]);
    expect(
      codes(applicationSchema.safeParse({ ...application, consent: "yes" })),
    ).toEqual([{ field: "consent", code: "required" }]);
    expect(
      codes(applicationSchema.safeParse({ ...application, lang: "de" })),
    ).toEqual([{ field: "lang", code: "invalid" }]);
  });

  it("accepts empty and real urls and rejects the rest", () => {
    expect(
      applicationSchema.parse({ ...application, linkedin: "", portfolio: "  " })
        .linkedin,
    ).toBe("");
    expect(
      applicationSchema.parse({
        ...application,
        portfolio: "linkedin.com/in/ada",
      }).portfolio,
    ).toBe("linkedin.com/in/ada");
    expect(
      codes(
        applicationSchema.safeParse({
          ...application,
          linkedin: "not a url",
          portfolio: "javascript:alert(1)",
        }),
      ).map((error) => error.field),
    ).toEqual(["linkedin", "portfolio"]);
    expect(
      codes(
        applicationSchema.safeParse({
          ...application,
          phone: "1".repeat(41),
        }),
      ),
    ).toEqual([{ field: "phone", code: "invalid" }]);
  });

  it("keeps only the first error for a field", () => {
    const parsed = applicationSchema.safeParse({
      ...application,
      full_name: "",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(
        fieldErrors(parsed.error).filter(
          (error) => error.field === "full_name",
        ),
      ).toEqual([{ field: "full_name", code: "required" }]);
    }
  });
});

describe("partner schema", () => {
  const partner = {
    company: " Northwind ",
    contact_name: "Ada Lovelace",
    email: "ADA@northwind.example",
    interest: "challenge",
    consent: true,
    lang: "tr",
  };

  it("rejects a short company and accepts a complete partner", () => {
    expect(partnerSchema.safeParse({ company: "A" }).success).toBe(false);
    expect(
      codes(partnerSchema.safeParse({ ...partner, company: "A" })),
    ).toEqual(
      expect.arrayContaining([{ field: "company", code: "too_short" }]),
    );

    const parsed = partnerSchema.parse(partner);
    expect(parsed).toMatchObject({
      company: "Northwind",
      email: "ada@northwind.example",
      lang: "tr",
      website: "",
      challenge: "",
    });
  });

  it("accepts every interest and rejects a bad website", () => {
    for (const interest of INTERESTS) {
      expect(partnerSchema.safeParse({ ...partner, interest }).success).toBe(
        true,
      );
    }
    expect(
      codes(partnerSchema.safeParse({ ...partner, website: "nope" })),
    ).toEqual([{ field: "website", code: "invalid" }]);
    expect(
      codes(partnerSchema.safeParse({ ...partner, contact_name: "Al" })),
    ).toEqual([{ field: "contact_name", code: "too_short" }]);
    expect(
      codes(partnerSchema.safeParse({ ...partner, consent: false })),
    ).toEqual([{ field: "consent", code: "required" }]);
  });
});

describe("field errors", () => {
  it("keeps the first code for a field and skips issues with no path", () => {
    const error = {
      issues: [
        { path: [], message: "required" },
        { path: ["email"], message: "required" },
        { path: ["email"], message: "invalid_email" },
        { path: ["full_name"], message: "too_short" },
      ],
    } as unknown as z.ZodError;

    expect(fieldErrors(error)).toEqual([
      { field: "email", code: "required" },
      { field: "full_name", code: "too_short" },
    ]);
  });
});

describe("acceptSubmission", () => {
  function request(body: unknown) {
    return new NextRequest("http://localhost/api/applications", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  it("rejects a body that is not a json object", async () => {
    const send = vi.fn();
    for (const body of ["nope", "null", "1", '"hi"']) {
      const response = await acceptSubmission(
        request(body),
        applicationSchema,
        send,
      );
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "invalid" });
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends a honeypot submission succeeded", async () => {
    const send = vi.fn();
    const response = await acceptSubmission(
      request({ ...application, website_url: " https://spam.test " }),
      applicationSchema,
      send,
    );
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("does not treat a blank or null honeypot as spam", async () => {
    const send = vi.fn();

    const blank = await acceptSubmission(
      request({ ...application, website_url: "   " }),
      applicationSchema,
      send,
    );
    expect(blank.status).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);

    send.mockClear();
    const missing = await acceptSubmission(
      request(application),
      applicationSchema,
      send,
    );
    expect(missing.status).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);

    send.mockClear();
    const empty = await acceptSubmission(
      request({ ...application, website_url: null }),
      applicationSchema,
      send,
    );
    expect(empty.status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send", async () => {
    const send = vi.fn();
    const response = await acceptSubmission(
      request({ email: "ada@example.com" }),
      applicationSchema,
      send,
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as {
      fields: { field: string; code: string }[];
    };
    expect(body.fields.map((error) => error.field)).toEqual(
      expect.arrayContaining(["full_name", "motivation", "consent"]),
    );
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the parsed application", async () => {
    const send = vi.fn();
    const response = await acceptSubmission(
      request(application),
      applicationSchema,
      send,
    );
    expect(response.status).toBe(201);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        full_name: "Ada Lovelace",
        lang: "en",
      }),
    );
  });

  it("hides a mail failure behind send_failed", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await acceptSubmission(
      request(application),
      applicationSchema,
      async () => {
        throw new Error("mailbox down");
      },
    );
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "send_failed" });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
