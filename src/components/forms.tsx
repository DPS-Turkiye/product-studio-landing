"use client";

import { Arrow, Star } from "@/components/icons";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

type Rule = {
  required?: boolean;
  email?: boolean;
  url?: boolean;
  min?: number;
  checked?: boolean;
};

type Values = Record<string, string | boolean>;

function useForm({
  initial,
  rules,
  endpoint,
}: {
  initial: Values;
  rules: Record<string, Rule>;
  endpoint: string;
}) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  const messageFor = (code: string) =>
    ({
      required: t("required"),
      invalid: t("invalidUrl"),
      invalid_email: t("invalidEmail"),
      too_short: t("tooShort"),
    })[code] || t("required");

  function validateField(name: string, value: string | boolean) {
    const rule = rules[name];
    if (!rule) return null;
    if (rule.checked) return value === true ? null : "required";
    const text = typeof value === "string" ? value.trim() : value;
    if (rule.required && !text) return "required";
    if (!text) return null;
    if (typeof text !== "string") return null;
    if (rule.email && !EMAIL.test(text)) return "invalid_email";
    if (rule.url && !URLISH.test(text)) return "invalid";
    if (rule.min && text.length < rule.min) return "too_short";
    return null;
  }

  function set(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        const error = validateField(name, value);
        if (error) next[name] = error;
        else delete next[name];
        return next;
      });
    }
  }

  function blur(name: string) {
    const error = validateField(name, values[name]);
    setErrors((current) => {
      const next = { ...current };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const name of Object.keys(rules)) {
      const error = validateField(name, values[name]);
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(rules).find((name) => nextErrors[name]);
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerMsg("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang: locale }),
      });
      if (res.ok) {
        setStatus("success");
        const formTop = document.getElementById("form-top");
        window.scrollTo({
          top: (formTop?.offsetTop ?? 120) - 120,
          behavior: "smooth",
        });
        return;
      }
      const body = (await res.json().catch(() => ({}))) as {
        fields?: { field: string; code: string }[];
      };
      if (res.status === 422 && Array.isArray(body.fields)) {
        const serverErrors: Record<string, string> = {};
        for (const field of body.fields) {
          serverErrors[field.field] =
            field.field === "email" && field.code === "invalid"
              ? "invalid_email"
              : field.code;
        }
        setErrors(serverErrors);
        setStatus("idle");
        return;
      }
      setServerMsg(res.status === 429 ? t("rateLimit") : "");
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues(initial);
    setErrors({});
    setStatus("idle");
  }

  const field = (name: string) => ({
    name,
    value: values[name],
    error: errors[name] ? messageFor(errors[name]) : null,
    required: !!(rules[name]?.required || rules[name]?.checked),
    onChange: (value: string | boolean) => set(name, value),
    onBlur: () => blur(name),
  });

  return { values, status, serverMsg, field, submit, reset };
}

function FieldWrap({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldProps = {
  name: string;
  label?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string | null;
  required?: boolean;
  hint?: string;
  className?: string;
};

export function TextField({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  hint,
  className,
  ...rest
}: FieldProps & { type?: string } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof FieldProps | "type"
  >) {
  const id = `f-${name}`;
  return (
    <FieldWrap
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <input
        id={id}
        name={name}
        type={type}
        className="input"
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
        {...rest}
      />
    </FieldWrap>
  );
}

export function TextArea({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  hint,
  rows = 5,
  className,
  ...rest
}: FieldProps & { rows?: number } & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    keyof FieldProps | "rows"
  >) {
  const id = `f-${name}`;
  return (
    <FieldWrap
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <textarea
        id={id}
        name={name}
        className="input textarea"
        rows={rows}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
        {...rest}
      />
    </FieldWrap>
  );
}

export function Select({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  options,
  placeholder,
  className,
}: FieldProps & {
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const id = `f-${name}`;
  return (
    <FieldWrap
      id={id}
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <select
        id={id}
        name={name}
        className="input select"
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

export function OptionGroup({
  name,
  label,
  value,
  onChange,
  error,
  required,
  options,
  className,
}: FieldProps & { options: { value: string; label: string }[] }) {
  const id = `f-${name}`;
  return (
    <fieldset
      className={`field option-group ${error ? "has-error" : ""} ${className || ""}`}
    >
      <legend className="field__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </legend>
      <div className="option-group__items">
        {options.map((option, index) => (
          <label
            key={option.value}
            className={`option ${value === option.value ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              id={index === 0 ? id : undefined}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="option__box" aria-hidden="true" />
            <span className="option__label">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function Checkbox({
  name,
  label,
  value,
  onChange,
  error,
  required,
}: FieldProps) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className={`checkbox ${value ? "is-selected" : ""}`}>
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={(event) => onChange(event.target.checked)}
          required={required}
        />
        <span className="option__box" aria-hidden="true" />
        <span>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
      </label>
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Honeypot({
  value,
  onChange,
}: {
  value: string | boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Website
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
}

export function SubmitRow({
  status,
  serverMsg,
  email,
}: {
  status: string;
  serverMsg: string;
  email: string;
}) {
  const t = useTranslations("form");
  return (
    <div className="submit-row">
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "submitting"}
      >
        <span>{status === "submitting" ? t("submitting") : t("submit")}</span>
        <Arrow size={16} />
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">
          {serverMsg || t("error", { email })}
        </p>
      )}
    </div>
  );
}

export function SuccessPanel({
  text,
  onReset,
}: {
  text: string;
  onReset: () => void;
}) {
  const t = useTranslations("form");
  return (
    <div className="success-panel" role="status">
      <Star size={56} color="var(--lime)" />
      <h3 className="h2">{t("successTitle")}</h3>
      <p className="body-lg">{text}</p>
      <button
        type="button"
        className="btn btn-ghost btn-on-dark"
        onClick={onReset}
      >
        <span>{t("another")}</span>
      </button>
    </div>
  );
}

const APPLY_INITIAL: Values = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  status: "",
  institution: "",
  field: "",
  role: "",
  linkedin: "",
  portfolio: "",
  motivation: "",
  experience: "",
  heard_from: "",
  available: false,
  consent: false,
  website_url: "",
};

const APPLY_RULES: Record<string, Rule> = {
  full_name: { required: true, min: 3 },
  email: { required: true, email: true },
  status: { required: true },
  role: { required: true },
  linkedin: { url: true },
  portfolio: { url: true },
  motivation: { required: true, min: 50 },
  available: { checked: true },
  consent: { checked: true },
};

const STATUSES = ["student", "graduate", "professional", "other"];
const ROLES = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
  "ai-engineer",
];

export function ApplicationForm({ email }: { email: string }) {
  const t = useTranslations();
  const form = useForm({
    initial: APPLY_INITIAL,
    rules: APPLY_RULES,
    endpoint: "/api/applications",
  });
  if (form.status === "success") {
    return <SuccessPanel text={t("form.successApply")} onReset={form.reset} />;
  }

  return (
    <form className="form" onSubmit={form.submit} noValidate>
      <div className="form-grid">
        <TextField
          label={t("form.fields.full_name")}
          autoComplete="name"
          {...form.field("full_name")}
        />
        <TextField
          label={t("form.fields.email")}
          type="email"
          autoComplete="email"
          {...form.field("email")}
        />
        <TextField
          label={t("form.fields.phone")}
          type="tel"
          autoComplete="tel"
          {...form.field("phone")}
        />
        <TextField
          label={t("form.fields.city")}
          autoComplete="address-level2"
          {...form.field("city")}
        />
        <Select
          label={t("form.fields.status")}
          placeholder={t("form.select")}
          options={STATUSES.map((status) => ({
            value: status,
            label: t(`form.statuses.${status}`),
          }))}
          {...form.field("status")}
        />
        <TextField
          label={t("form.fields.institution")}
          autoComplete="organization"
          {...form.field("institution")}
        />
        <TextField
          label={t("form.fields.field")}
          className="span-2"
          {...form.field("field")}
        />
      </div>
      <OptionGroup
        label={t("form.fields.role")}
        options={ROLES.map((role) => ({
          value: role,
          label: t(`roles.${role}`),
        }))}
        {...form.field("role")}
      />
      <div className="form-grid">
        <TextField
          label={t("form.fields.linkedin")}
          type="url"
          placeholder="https://www.linkedin.com/in/…"
          {...form.field("linkedin")}
        />
        <TextField
          label={t("form.fields.portfolio")}
          type="url"
          placeholder="https://…"
          {...form.field("portfolio")}
        />
      </div>
      <TextArea
        label={t("form.fields.motivation")}
        hint={t("form.fields.motivationHint")}
        rows={6}
        maxLength={3000}
        {...form.field("motivation")}
      />
      <TextArea
        label={t("form.fields.experience")}
        rows={4}
        maxLength={3000}
        {...form.field("experience")}
      />
      <TextField
        label={t("form.fields.heard_from")}
        {...form.field("heard_from")}
      />
      <Checkbox
        label={t("form.fields.available")}
        {...form.field("available")}
      />
      <Checkbox label={t("form.fields.consent")} {...form.field("consent")} />
      <Honeypot
        value={form.values.website_url}
        onChange={(value) => form.field("website_url").onChange(value)}
      />
      <SubmitRow
        status={form.status}
        serverMsg={form.serverMsg}
        email={email}
      />
    </form>
  );
}

const PARTNER_INITIAL: Values = {
  company: "",
  website: "",
  contact_name: "",
  contact_role: "",
  email: "",
  phone: "",
  interest: "",
  challenge: "",
  heard_from: "",
  consent: false,
  website_url: "",
};

const PARTNER_RULES: Record<string, Rule> = {
  company: { required: true, min: 2 },
  website: { url: true },
  contact_name: { required: true, min: 3 },
  email: { required: true, email: true },
  interest: { required: true },
  consent: { checked: true },
};

const INTERESTS = ["challenge", "sponsor", "mentor", "other"];

export function PartnerForm({ email }: { email: string }) {
  const t = useTranslations();
  const form = useForm({
    initial: PARTNER_INITIAL,
    rules: PARTNER_RULES,
    endpoint: "/api/partners",
  });
  if (form.status === "success") {
    return (
      <SuccessPanel text={t("form.successPartner")} onReset={form.reset} />
    );
  }

  return (
    <form className="form" onSubmit={form.submit} noValidate>
      <div className="form-grid">
        <TextField
          label={t("form.fields.company")}
          autoComplete="organization"
          {...form.field("company")}
        />
        <TextField
          label={t("form.fields.website")}
          type="url"
          placeholder="https://…"
          {...form.field("website")}
        />
        <TextField
          label={t("form.fields.contact_name")}
          autoComplete="name"
          {...form.field("contact_name")}
        />
        <TextField
          label={t("form.fields.contact_role")}
          autoComplete="organization-title"
          {...form.field("contact_role")}
        />
        <TextField
          label={t("form.fields.email")}
          type="email"
          autoComplete="email"
          {...form.field("email")}
        />
        <TextField
          label={t("form.fields.phone")}
          type="tel"
          autoComplete="tel"
          {...form.field("phone")}
        />
      </div>
      <OptionGroup
        label={t("form.fields.interest")}
        options={INTERESTS.map((interest) => ({
          value: interest,
          label: t(`form.interests.${interest}`),
        }))}
        {...form.field("interest")}
      />
      <TextArea
        label={t("form.fields.challenge")}
        rows={6}
        maxLength={4000}
        {...form.field("challenge")}
      />
      <TextField
        label={t("form.fields.heard_from")}
        {...form.field("heard_from")}
      />
      <Checkbox
        label={t("form.fields.consentPartner")}
        {...form.field("consent")}
      />
      <Honeypot
        value={form.values.website_url}
        onChange={(value) => form.field("website_url").onChange(value)}
      />
      <SubmitRow
        status={form.status}
        serverMsg={form.serverMsg}
        email={email}
      />
    </form>
  );
}
