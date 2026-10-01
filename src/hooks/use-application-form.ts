"use client";

import { useSubmissionMutation } from "@/hooks/use-submission-mutation";
import { applicationSchema, type ApplicationInput } from "@/lib/submissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const defaults: ApplicationInput = {
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

export function useApplicationForm() {
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const submission = useSubmissionMutation("/api/applications", form);

  return { form, ...submission };
}
