import { z } from "zod";

const URLISH = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

export const ROLES = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
] as const;

export const STATUSES = [
  "student",
  "graduate",
  "professional",
  "other",
] as const;

export const INTERESTS = ["challenge", "sponsor", "mentor", "other"] as const;

function requiredText(max: number, min = 1) {
  const schema = z
    .string({ error: "required" })
    .trim()
    .max(max, "invalid")
    .min(1, "required");
  return min > 1 ? schema.min(min, "too_short") : schema;
}

function optionalText(max: number) {
  return z
    .string({ error: "invalid" })
    .trim()
    .max(max, "invalid")
    .optional()
    .default("");
}

function optionalUrl() {
  return z
    .string({ error: "invalid" })
    .trim()
    .max(300, "invalid")
    .refine((value) => !value || URLISH.test(value), "invalid")
    .optional()
    .default("");
}

function oneOf<const T extends readonly [string, ...string[]]>(values: T) {
  return z
    .string({ error: "required" })
    .min(1, "required")
    .pipe(z.enum(values, { error: "invalid" }));
}

const must = z
  .boolean({ error: "required" })
  .refine((value) => value === true, "required");

const email = z
  .string({ error: "required" })
  .trim()
  .toLowerCase()
  .max(200, "invalid")
  .min(1, "required")
  .pipe(z.email("invalid_email"));

const locale = z
  .enum(["en", "tr"], { error: "invalid" })
  .optional()
  .default("en");

export const applicationSchema = z.object({
  full_name: requiredText(120, 3),
  email,
  phone: optionalText(40),
  city: optionalText(80),
  status: oneOf(STATUSES),
  institution: optionalText(160),
  field: optionalText(160),
  role: oneOf(ROLES),
  linkedin: optionalUrl(),
  portfolio: optionalUrl(),
  motivation: requiredText(3000, 50),
  experience: optionalText(3000),
  heard_from: optionalText(120),
  available: must,
  consent: must,
  website_url: optionalText(300),
  lang: locale,
});

export const partnerSchema = z.object({
  company: requiredText(160, 2),
  website: optionalUrl(),
  contact_name: requiredText(120, 3),
  contact_role: optionalText(120),
  email,
  phone: optionalText(40),
  interest: oneOf(INTERESTS),
  challenge: optionalText(4000),
  heard_from: optionalText(120),
  consent: must,
  website_url: optionalText(300),
  lang: locale,
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type Application = z.output<typeof applicationSchema>;
export type PartnerInput = z.input<typeof partnerSchema>;
export type Partner = z.output<typeof partnerSchema>;

export function fieldErrors(error: z.ZodError) {
  const fields: { field: string; code: string }[] = [];
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (!field || fields.some((item) => item.field === field)) continue;
    fields.push({ field, code: issue.message });
  }
  return fields;
}

export async function acceptSubmission<T>(
  request: Request,
  schema: z.ZodType<T>,
  send: (data: T) => Promise<void>,
) {
  const body = (await request.json().catch(() => null)) as unknown;
  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const honeypot =
    "website_url" in body
      ? String((body as { website_url?: unknown }).website_url ?? "").trim()
      : "";
  if (honeypot) return Response.json({ ok: true }, { status: 201 });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    await send(parsed.data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "send_failed" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
