"use client";

import { useSubmissionMutation } from "@/hooks/use-submission-mutation";
import { partnerSchema, type PartnerInput } from "@/lib/submissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const defaults: PartnerInput = {
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
  referral_code: "",
};

export function usePartnerForm() {
  const form = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });
  const submission = useSubmissionMutation("/api/partners", form);

  return { form, ...submission };
}
