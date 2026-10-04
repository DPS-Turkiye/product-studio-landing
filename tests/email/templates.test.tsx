import { ApplicationEmail } from "@/lib/email/application-email";
import { PartnerEmail } from "@/lib/email/partner-email";
import {
  applicationLede,
  applicationRows,
  englishUpper,
  externalHref,
  partnerLede,
  partnerRows,
  textBody,
} from "@/lib/email/rows";
import { applicationSchema, partnerSchema } from "@/lib/submissions";
import { render } from "@react-email/render";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Application, Partner } from "@/lib/submissions";

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

function applicationHtml(data: Application) {
  return render(createElement(ApplicationEmail, { data }));
}

function partnerHtml(data: Partner) {
  return render(createElement(PartnerEmail, { data }));
}

describe("email rows", () => {
  it("uppercases english labels with a dotless i", () => {
    expect(englishUpper("New application")).toBe("NEW APPLICATION");
    expect(englishUpper("Available full-time")).toBe("AVAILABLE FULL-TIME");
    expect(englishUpper("New application")).not.toContain("İ");
    expect(englishUpper("Available full-time")).not.toContain("İ");
  });

  it("keeps absolute urls and prefixes the rest", () => {
    expect(externalHref("https://ada.example/work")).toBe(
      "https://ada.example/work",
    );
    expect(externalHref("http://ada.example")).toBe("http://ada.example");
    expect(externalHref("northwind.example/team")).toBe(
      "https://northwind.example/team",
    );
  });

  it("builds an application lede and skips a blank city", () => {
    expect(applicationLede(application({ city: "Ankara" }))).toBe(
      "Software Engineer · Professional · Ankara",
    );
    expect(applicationLede(application())).toBe(
      "Software Engineer · Professional",
    );
  });

  it("builds a partner lede from the interest and the contact", () => {
    expect(partnerLede(partner())).toBe("Challenge partner · Ada Lovelace");
  });

  it("keeps filled application fields and drops blanks", () => {
    const rows = applicationRows(
      application({
        phone: "+90 555",
        city: "Ankara",
        institution: "METU",
        field: "Computer engineering",
        linkedin: "linkedin.com/in/ada",
        portfolio: "https://ada.example",
        experience: "Shipped a payments prototype.",
        heard_from: "A mentor",
        website_url: "https://spam.example",
      }),
    );

    expect(rows.map((row) => row.label)).toEqual([
      "Name",
      "Email",
      "Phone",
      "City",
      "Status",
      "Institution",
      "Field",
      "Role",
      "LinkedIn",
      "Portfolio",
      "Motivation",
      "Experience",
      "Heard from",
      "Available full-time",
      "Language",
    ]);
    expect(rows.find((row) => row.label === "Email")?.href).toBe(
      "mailto:ada@example.com",
    );
    expect(rows.find((row) => row.label === "LinkedIn")?.href).toBe(
      "https://linkedin.com/in/ada",
    );
    expect(rows.find((row) => row.label === "Portfolio")?.href).toBe(
      "https://ada.example",
    );
    expect(rows.find((row) => row.label === "Motivation")?.long).toBe(true);
    expect(rows.find((row) => row.label === "Experience")?.long).toBe(true);
    expect(textBody(rows)).toContain("Available full-time: Yes");
    expect(textBody(rows)).toContain("Language: English");
    expect(textBody(rows)).not.toContain("spam.example");
    expect(textBody(rows)).not.toContain("Consent");
  });

  it("omits optional application fields when they are empty", () => {
    const labels = applicationRows(application()).map((row) => row.label);
    expect(labels).toEqual([
      "Name",
      "Email",
      "Status",
      "Role",
      "Motivation",
      "Available full-time",
      "Language",
    ]);
  });

  it("labels every role, status, and interest", () => {
    expect(
      applicationRows(application({ role: "product-manager" })).find(
        (row) => row.label === "Role",
      )?.value,
    ).toBe("Product Manager");
    expect(
      applicationRows(application({ role: "interaction-designer" })).find(
        (row) => row.label === "Role",
      )?.value,
    ).toBe("Interaction Designer");
    expect(
      applicationRows(application({ role: "software-engineer" })).find(
        (row) => row.label === "Role",
      )?.value,
    ).toBe("Software Engineer");

    expect(
      applicationRows(application({ status: "student" })).find(
        (row) => row.label === "Status",
      )?.value,
    ).toBe("Student");
    expect(
      applicationRows(application({ status: "graduate" })).find(
        (row) => row.label === "Status",
      )?.value,
    ).toBe("Recent graduate");
    expect(
      applicationRows(application({ status: "other" })).find(
        (row) => row.label === "Status",
      )?.value,
    ).toBe("Other");

    expect(
      partnerRows(partner({ interest: "sponsor" })).find(
        (row) => row.label === "Interest",
      )?.value,
    ).toBe("Sponsor");
    expect(
      partnerRows(partner({ interest: "mentor" })).find(
        (row) => row.label === "Interest",
      )?.value,
    ).toBe("Mentor");
    expect(
      partnerRows(partner({ interest: "other" })).find(
        (row) => row.label === "Interest",
      )?.value,
    ).toBe("Something else");
  });

  it("keeps filled partner fields and drops blanks", () => {
    const rows = partnerRows(
      partner({
        website: "northwind.example",
        contact_role: "Director",
        phone: "+90 555",
        challenge: "Riders miss connections.",
        heard_from: "Demo day",
        lang: "tr",
        website_url: "https://spam.example",
      }),
    );

    expect(textBody(rows)).toBe(
      [
        "Company: Northwind",
        "Website: northwind.example",
        "Name: Ada Lovelace",
        "Position: Director",
        "Email: ada@northwind.example",
        "Phone: +90 555",
        "Interest: Challenge partner",
        "Challenge: Riders miss connections.",
        "Heard from: Demo day",
        "Language: Turkish",
      ].join("\n"),
    );
    expect(rows.find((row) => row.label === "Website")?.href).toBe(
      "https://northwind.example",
    );
    expect(rows.find((row) => row.label === "Challenge")?.long).toBe(true);
    expect(textBody(partnerRows(partner()))).not.toContain("Website:");
    expect(textBody(partnerRows(partner()))).not.toContain("Challenge:");
    expect(textBody(partnerRows(partner()))).not.toContain("Phone:");
  });
});

describe("email html", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders an application with the logo, brand, and every filled field", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://productstudio.com.tr");
    const html = await applicationHtml(
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

    expect(html).toContain(
      'src="https://productstudio.com.tr/images/logo-email.png"',
    );
    expect(html).toContain('alt="Product Studio"');
    expect(html).toContain("#0b0d14");
    expect(html).toContain("#5832ff");
    expect(html).toContain("#a6ff00");
    expect(html).toContain("NEW APPLICATION");
    expect(html).toContain("New application from Ada Lovelace");
    expect(html).not.toContain("İ");
    expect(html).toContain("Software Engineer · Professional · Ankara");
    expect(html).toContain('href="mailto:ada@example.com"');
    expect(html).toContain('href="https://www.linkedin.com/in/ada"');
    expect(html).toContain('href="https://ada.example"');
    expect(html).toContain('href="https://productstudio.com.tr"');
    expect(html).toContain("METU");
    expect(html).toContain("Computer engineering");
    expect(html).toContain(motivation);
    expect(html).toContain("Shipped a payments prototype.");
    expect(html).toContain("A mentor");
    expect(html).toContain("AVAILABLE FULL-TIME");
    expect(html).toContain("English");
    expect(html).toContain("REPLY");
  });

  it("hides empty application fields and the honeypot", async () => {
    const html = await applicationHtml(
      application({ website_url: "https://spam.example" }),
    );
    expect(html).not.toContain("Phone");
    expect(html).not.toContain("Institution");
    expect(html).not.toContain("Portfolio");
    expect(html).not.toContain("Experience");
    expect(html).not.toContain("Heard from");
    expect(html).not.toContain("spam.example");
    expect(html).not.toContain("Consent");
    expect(html).not.toContain("website_url");
  });

  it("escapes markup and keeps line breaks in the motivation", async () => {
    const html = await applicationHtml(
      application({
        full_name: "Ada <b>Lovelace</b>",
        motivation: `First line of a real motivation letter.\nSecond line <script>alert(1)</script> and more.`,
      }),
    );
    expect(html).not.toContain("<b>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("Ada");
    expect(html).toContain("Lovelace");
    expect(html).toContain("First line of a real motivation letter.");
    expect(html).toContain("Second line");
    expect(html).toContain("alert(1)");
  });

  it("renders a partner message in turkish with a bare website", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://productstudio.com.tr");
    const html = await partnerHtml(
      partner({
        website: "northwind.example/jobs",
        contact_role: "Director",
        phone: "+90 555",
        challenge: "Riders miss connections.",
        heard_from: "Demo day",
        lang: "tr",
      }),
    );

    expect(html).toContain("New partner: Northwind");
    expect(html).toContain("Challenge partner · Ada Lovelace");
    expect(html).toContain('href="https://northwind.example/jobs"');
    expect(html).toContain('href="mailto:ada@northwind.example"');
    expect(html).toContain("Director");
    expect(html).toContain("+90 555");
    expect(html).toContain("Riders miss connections.");
    expect(html).toContain("Demo day");
    expect(html).toContain("Turkish");
    expect(html).toContain(
      'src="https://productstudio.com.tr/images/logo-email.png"',
    );
  });

  it("drops empty partner sections", async () => {
    const html = await partnerHtml(partner());
    expect(html).not.toContain("Website");
    expect(html).not.toContain("Position");
    expect(html).not.toContain("Heard from");
    expect(html).not.toContain("Riders");
    expect(html).toContain("Northwind");
    expect(html).toContain("Challenge partner");
  });
});
