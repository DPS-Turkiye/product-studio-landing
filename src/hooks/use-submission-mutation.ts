"use client";

import { api, submissionFieldErrors } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export function useSubmissionMutation<T extends FieldValues>(
  endpoint: string,
  form: UseFormReturn<T>,
) {
  const locale = useLocale();
  const t = useTranslations("form");
  const mutation = useMutation({
    mutationFn: (values: T) =>
      api
        .post(endpoint, {
          ...values,
          lang: locale === "tr" ? "tr" : "en",
        })
        .then((response) => response.data),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      const formTop = document.getElementById("form-top");
      window.scrollTo({
        top: (formTop?.offsetTop ?? 120) - 120,
        behavior: "smooth",
      });
    } catch (error) {
      const fields = submissionFieldErrors(error);
      if (!fields) return;
      for (const field of fields) {
        form.setError(field.field as FieldPath<T>, { message: field.code });
      }
    }
  });

  function errorText(name: FieldPath<T>) {
    const error = form.getFieldState(name, form.formState).error;
    const code = error?.message;
    if (!code) return null;
    if (code === "invalid") return t("invalidUrl");
    if (code === "invalid_email") return t("invalidEmail");
    if (code === "too_short") return t("tooShort");
    return t("required");
  }

  function reset() {
    form.reset();
    mutation.reset();
  }

  return {
    onSubmit,
    reset,
    errorText,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isServerError:
      mutation.isError && submissionFieldErrors(mutation.error) == null,
  };
}
