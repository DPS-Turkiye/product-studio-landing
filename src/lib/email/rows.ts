import type { Application, Partner } from "@/lib/submissions";

export type EmailRow = {
  label: string;
  value: string;
  href?: string;
  long?: boolean;
};

const ROLE_LABELS: Record<Application["role"], string> = {
  "product-manager": "Product Manager",
  "interaction-designer": "Interaction Designer",
  "software-engineer": "Software Engineer",
  "ai-engineer": "AI Engineer",
};

const STATUS_LABELS: Record<Application["status"], string> = {
  student: "Student",
  graduate: "Recent graduate",
  professional: "Professional",
  other: "Other",
};

const INTEREST_LABELS: Record<Partner["interest"], string> = {
  challenge: "Challenge partner",
  sponsor: "Sponsor",
  mentor: "Mentor",
  other: "Something else",
};

const LANGUAGE_LABELS = {
  en: "English",
  tr: "Turkish",
} as const;

export function externalHref(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function filled(
  label: string,
  value: string | boolean,
  extra?: Pick<EmailRow, "href" | "long">,
): EmailRow | null {
  if (value === "" || value === false) return null;
  return {
    label,
    value: value === true ? "Yes" : value,
    ...extra,
  };
}

function compact(rows: Array<EmailRow | null>) {
  return rows.filter((row): row is EmailRow => row !== null);
}

export function applicationRows(data: Application) {
  return compact([
    filled("Name", data.full_name),
    filled("Email", data.email, { href: `mailto:${data.email}` }),
    filled("Phone", data.phone),
    filled("City", data.city),
    filled("Status", STATUS_LABELS[data.status]),
    filled("Institution", data.institution),
    filled("Field", data.field),
    filled("Role", ROLE_LABELS[data.role]),
    filled("LinkedIn", data.linkedin, { href: externalHref(data.linkedin) }),
    filled("Portfolio", data.portfolio, { href: externalHref(data.portfolio) }),
    filled("Motivation", data.motivation, { long: true }),
    filled("Experience", data.experience, { long: true }),
    filled("Heard from", data.heard_from),
    filled("Available full-time", data.available),
    filled("Language", LANGUAGE_LABELS[data.lang]),
  ]);
}

export function partnerRows(data: Partner) {
  return compact([
    filled("Company", data.company),
    filled("Website", data.website, { href: externalHref(data.website) }),
    filled("Name", data.contact_name),
    filled("Position", data.contact_role),
    filled("Email", data.email, { href: `mailto:${data.email}` }),
    filled("Phone", data.phone),
    filled("Interest", INTEREST_LABELS[data.interest]),
    filled("Challenge", data.challenge, { long: true }),
    filled("Heard from", data.heard_from),
    filled("Language", LANGUAGE_LABELS[data.lang]),
  ]);
}

export function textBody(rows: EmailRow[]) {
  return rows.map((row) => `${row.label}: ${row.value}`).join("\n");
}

export function applicationLede(data: Application) {
  return [ROLE_LABELS[data.role], STATUS_LABELS[data.status], data.city]
    .filter(Boolean)
    .join(" · ");
}

export function partnerLede(data: Partner) {
  return [INTEREST_LABELS[data.interest], data.contact_name]
    .filter(Boolean)
    .join(" · ");
}
