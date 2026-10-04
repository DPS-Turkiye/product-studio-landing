"use client";

import { Arrow, Star } from "@/components/icons";
import { useApplicationForm } from "@/hooks/use-application-form";
import { usePartnerForm } from "@/hooks/use-partner-form";
import { INTERESTS, ROLES, STATUSES } from "@/lib/submissions";
import { useTranslations } from "next-intl";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

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

export function TextField({
  label,
  error,
  required,
  hint,
  className,
  ...rest
}: {
  label?: string;
  error?: string | null;
  required?: boolean;
  hint?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${rest.name}`;
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
        className="input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
        {...rest}
      />
    </FieldWrap>
  );
}

export function TextArea({
  label,
  error,
  required,
  hint,
  className,
  rows = 5,
  ...rest
}: {
  label?: string;
  error?: string | null;
  required?: boolean;
  hint?: string;
  className?: string;
  rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${rest.name}`;
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
        className="input textarea"
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
        {...rest}
      />
    </FieldWrap>
  );
}

export function Select({
  label,
  error,
  required,
  options,
  placeholder,
  className,
  ...rest
}: {
  label?: string;
  error?: string | null;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = `f-${rest.name}`;
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
        className="input select"
        aria-invalid={!!error}
        required={required}
        {...rest}
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
  label,
  error,
  required,
  options,
  selected,
  className,
  ...rest
}: {
  label: string;
  error?: string | null;
  required?: boolean;
  options: { value: string; label: string }[];
  selected?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${rest.name}`;
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
            className={`option ${selected === option.value ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              id={index === 0 ? id : undefined}
              value={option.value}
              checked={selected === option.value}
              {...rest}
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
  label,
  error,
  required,
  ...rest
}: {
  label: string;
  error?: string | null;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className={`checkbox ${rest.checked ? "is-selected" : ""}`}>
        <input type="checkbox" required={required} {...rest} />
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

export function Honeypot(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Referral code
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export function SubmitRow({
  pending,
  error,
  email,
}: {
  pending: boolean;
  error: boolean;
  email: string;
}) {
  const t = useTranslations("form");
  return (
    <div className="submit-row">
      <button type="submit" className="btn btn-primary" disabled={pending}>
        <span>{pending ? t("submitting") : t("submit")}</span>
        <Arrow size={16} />
      </button>
      {error && (
        <p className="form-error" role="alert">
          {t("error", { email })}
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

export function ApplicationForm({ email }: { email: string }) {
  const t = useTranslations();
  const {
    form,
    onSubmit,
    reset,
    errorText,
    isPending,
    isSuccess,
    isServerError,
  } = useApplicationForm();
  if (isSuccess) {
    return <SuccessPanel text={t("form.successApply")} onReset={reset} />;
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <TextField
          label={t("form.fields.full_name")}
          autoComplete="name"
          required
          error={errorText("full_name")}
          {...form.register("full_name")}
        />
        <TextField
          label={t("form.fields.email")}
          type="email"
          autoComplete="email"
          required
          error={errorText("email")}
          {...form.register("email")}
        />
        <TextField
          label={t("form.fields.phone")}
          type="tel"
          autoComplete="tel"
          error={errorText("phone")}
          {...form.register("phone")}
        />
        <TextField
          label={t("form.fields.city")}
          autoComplete="address-level2"
          error={errorText("city")}
          {...form.register("city")}
        />
        <Select
          label={t("form.fields.status")}
          placeholder={t("form.select")}
          required
          error={errorText("status")}
          options={STATUSES.map((status) => ({
            value: status,
            label: t(`form.statuses.${status}`),
          }))}
          {...form.register("status")}
        />
        <TextField
          label={t("form.fields.institution")}
          autoComplete="organization"
          error={errorText("institution")}
          {...form.register("institution")}
        />
        <TextField
          label={t("form.fields.field")}
          className="span-2"
          error={errorText("field")}
          {...form.register("field")}
        />
      </div>
      <OptionGroup
        label={t("form.fields.role")}
        required
        error={errorText("role")}
        selected={form.watch("role")}
        options={ROLES.map((role) => ({
          value: role,
          label: t(`roles.${role}`),
        }))}
        {...form.register("role")}
      />
      <div className="form-grid">
        <TextField
          label={t("form.fields.linkedin")}
          type="url"
          placeholder="https://www.linkedin.com/in/…"
          error={errorText("linkedin")}
          {...form.register("linkedin")}
        />
        <TextField
          label={t("form.fields.portfolio")}
          type="url"
          placeholder="https://…"
          error={errorText("portfolio")}
          {...form.register("portfolio")}
        />
      </div>
      <TextArea
        label={t("form.fields.motivation")}
        hint={t("form.fields.motivationHint")}
        rows={6}
        maxLength={3000}
        required
        error={errorText("motivation")}
        {...form.register("motivation")}
      />
      <TextArea
        label={t("form.fields.experience")}
        rows={4}
        maxLength={3000}
        error={errorText("experience")}
        {...form.register("experience")}
      />
      <TextField
        label={t("form.fields.heard_from")}
        error={errorText("heard_from")}
        {...form.register("heard_from")}
      />
      <Checkbox
        label={t("form.fields.available")}
        required
        error={errorText("available")}
        {...form.register("available")}
        checked={form.watch("available")}
      />
      <Checkbox
        label={t("form.fields.consent")}
        required
        error={errorText("consent")}
        {...form.register("consent")}
        checked={form.watch("consent")}
      />
      <Honeypot {...form.register("referral_code")} />
      <SubmitRow pending={isPending} error={isServerError} email={email} />
    </form>
  );
}

export function PartnerForm({ email }: { email: string }) {
  const t = useTranslations();
  const {
    form,
    onSubmit,
    reset,
    errorText,
    isPending,
    isSuccess,
    isServerError,
  } = usePartnerForm();
  if (isSuccess) {
    return <SuccessPanel text={t("form.successPartner")} onReset={reset} />;
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <TextField
          label={t("form.fields.company")}
          autoComplete="organization"
          required
          error={errorText("company")}
          {...form.register("company")}
        />
        <TextField
          label={t("form.fields.website")}
          type="url"
          placeholder="https://…"
          error={errorText("website")}
          {...form.register("website")}
        />
        <TextField
          label={t("form.fields.contact_name")}
          autoComplete="name"
          required
          error={errorText("contact_name")}
          {...form.register("contact_name")}
        />
        <TextField
          label={t("form.fields.contact_role")}
          autoComplete="organization-title"
          error={errorText("contact_role")}
          {...form.register("contact_role")}
        />
        <TextField
          label={t("form.fields.email")}
          type="email"
          autoComplete="email"
          required
          error={errorText("email")}
          {...form.register("email")}
        />
        <TextField
          label={t("form.fields.phone")}
          type="tel"
          autoComplete="tel"
          error={errorText("phone")}
          {...form.register("phone")}
        />
      </div>
      <OptionGroup
        label={t("form.fields.interest")}
        required
        error={errorText("interest")}
        selected={form.watch("interest")}
        options={INTERESTS.map((interest) => ({
          value: interest,
          label: t(`form.interests.${interest}`),
        }))}
        {...form.register("interest")}
      />
      <TextArea
        label={t("form.fields.challenge")}
        rows={6}
        maxLength={4000}
        error={errorText("challenge")}
        {...form.register("challenge")}
      />
      <TextField
        label={t("form.fields.heard_from")}
        error={errorText("heard_from")}
        {...form.register("heard_from")}
      />
      <Checkbox
        label={t("form.fields.consentPartner")}
        required
        error={errorText("consent")}
        {...form.register("consent")}
        checked={form.watch("consent")}
      />
      <Honeypot {...form.register("referral_code")} />
      <SubmitRow pending={isPending} error={isServerError} email={email} />
    </form>
  );
}
