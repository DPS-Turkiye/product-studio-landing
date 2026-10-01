const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

export const ROLES = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
  "ai-engineer",
] as const;

export const STATUSES = [
  "student",
  "graduate",
  "professional",
  "other",
] as const;

export const INTERESTS = ["challenge", "sponsor", "mentor", "other"] as const;

export type FieldError = { field: string; code: string };

type Body = Record<string, unknown>;

function str(value: unknown, max: number) {
  if (value == null) return "";
  return String(value).trim().slice(0, max);
}

function makeChecker(body: Body) {
  const errors: FieldError[] = [];
  const data: Record<string, string | boolean | null> = {};
  return {
    errors,
    data,
    text(key: string, { required = false, max = 200, min = 0 } = {}) {
      const value = str(body[key], max);
      if (required && !value) errors.push({ field: key, code: "required" });
      else if (value && value.length < min) {
        errors.push({ field: key, code: "too_short" });
      }
      data[key] = value || null;
    },
    email(key: string) {
      const value = str(body[key], 200).toLowerCase();
      if (!value) errors.push({ field: key, code: "required" });
      else if (!EMAIL.test(value)) errors.push({ field: key, code: "invalid" });
      data[key] = value;
    },
    url(key: string, { required = false } = {}) {
      const value = str(body[key], 300);
      if (required && !value) errors.push({ field: key, code: "required" });
      else if (value && !URLISH.test(value)) {
        errors.push({ field: key, code: "invalid" });
      }
      data[key] = value || null;
    },
    oneOf(key: string, list: readonly string[], { required = true } = {}) {
      const value = str(body[key], 50);
      if (required && !value) errors.push({ field: key, code: "required" });
      else if (value && !list.includes(value)) {
        errors.push({ field: key, code: "invalid" });
      }
      data[key] = value || null;
    },
    mustBeTrue(key: string) {
      if (body[key] !== true) errors.push({ field: key, code: "required" });
    },
  };
}

export function validateApplication(body: Body) {
  const checker = makeChecker(body);
  checker.text("full_name", { required: true, max: 120, min: 3 });
  checker.email("email");
  checker.text("phone", { max: 40 });
  checker.text("city", { max: 80 });
  checker.oneOf("status", STATUSES);
  checker.text("institution", { max: 160 });
  checker.text("field", { max: 160 });
  checker.oneOf("role", ROLES);
  checker.url("linkedin");
  checker.url("portfolio");
  checker.text("motivation", { required: true, max: 3000, min: 50 });
  checker.text("experience", { max: 3000 });
  checker.text("heard_from", { max: 120 });
  checker.data.available = body.available === true;
  checker.mustBeTrue("available");
  checker.mustBeTrue("consent");
  checker.data.lang = body.lang === "tr" ? "tr" : "en";
  return { errors: checker.errors, data: checker.data };
}

export function validatePartner(body: Body) {
  const checker = makeChecker(body);
  checker.text("company", { required: true, max: 160, min: 2 });
  checker.url("website");
  checker.text("contact_name", { required: true, max: 120, min: 3 });
  checker.text("contact_role", { max: 120 });
  checker.email("email");
  checker.text("phone", { max: 40 });
  checker.oneOf("interest", INTERESTS);
  checker.text("challenge", { max: 4000 });
  checker.text("heard_from", { max: 120 });
  checker.mustBeTrue("consent");
  checker.data.lang = body.lang === "tr" ? "tr" : "en";
  return { errors: checker.errors, data: checker.data };
}

const hits = new Map<string, number[]>();

export function rateLimited(ip: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}
