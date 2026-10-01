import { site } from "@/lib/content";
import { Resend } from "resend";
import type { Application, Partner } from "@/lib/submissions";

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

const DEFAULT_FROM = "Product Studio <onboarding@resend.dev>";

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Resend is not configured");
  return {
    resend: new Resend(apiKey),
    from: process.env.RESEND_FROM || DEFAULT_FROM,
  };
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 120);
}

function body(rows: Array<[string, string | boolean]>) {
  return rows
    .filter(([, value]) => value !== "")
    .map(([label, value]) => `${label}: ${value === true ? "yes" : value}`)
    .join("\n");
}

function inbox(address: string) {
  return process.env.RESEND_TO || address;
}

async function deliver(message: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}) {
  const { resend, from } = client();
  const { error } = await resend.emails.send({
    from,
    to: [inbox(message.to)],
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
  });
  if (error) throw new Error(error.message);
}

export async function sendApplication(data: Application) {
  await deliver({
    to: site.contactEmail,
    replyTo: data.email,
    subject: `New application: ${oneLine(data.full_name)}`,
    text: body([
      ["Name", data.full_name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["City", data.city],
      ["Status", STATUS_LABELS[data.status]],
      ["Institution", data.institution],
      ["Field", data.field],
      ["Role", ROLE_LABELS[data.role]],
      ["LinkedIn", data.linkedin],
      ["Portfolio", data.portfolio],
      ["Motivation", data.motivation],
      ["Experience", data.experience],
      ["Heard from", data.heard_from],
      ["Available full-time", data.available],
      ["Language", data.lang],
    ]),
  });
}

export async function sendPartner(data: Partner) {
  await deliver({
    to: site.partnerEmail,
    replyTo: data.email,
    subject: `New partner: ${oneLine(data.company)}`,
    text: body([
      ["Company", data.company],
      ["Website", data.website],
      ["Name", data.contact_name],
      ["Position", data.contact_role],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Interest", INTEREST_LABELS[data.interest]],
      ["Challenge", data.challenge],
      ["Heard from", data.heard_from],
      ["Language", data.lang],
    ]),
  });
}
