import { site } from "@/lib/content";
import { ApplicationEmail } from "@/lib/email/application-email";
import { PartnerEmail } from "@/lib/email/partner-email";
import { applicationRows, partnerRows, textBody } from "@/lib/email/rows";
import { render } from "@react-email/render";
import { createElement } from "react";
import { Resend } from "resend";
import type { Application, Partner } from "@/lib/submissions";

export const RESEND_FROM = `Product Studio <${site.contactEmail}>`;
export const RESEND_TO = [
  "ayanege2001@gmail.com",
  "nihan@dpsturkiye.com",
  "mali@dpsturkiye.com",
  "sumeyyes@metu.edu.tr",
];

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Resend is not configured");
  return new Resend(apiKey);
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 120);
}

async function deliver(message: {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}) {
  const { error } = await client().emails.send({
    from: RESEND_FROM,
    to: RESEND_TO,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
  if (error) throw new Error(error.message);
}

export async function sendApplication(data: Application) {
  await deliver({
    replyTo: data.email,
    subject: `New application: ${oneLine(data.full_name)}`,
    text: textBody(applicationRows(data)),
    html: await render(createElement(ApplicationEmail, { data })),
  });
}

export async function sendPartner(data: Partner) {
  await deliver({
    replyTo: data.email,
    subject: `New partner: ${oneLine(data.company)}`,
    text: textBody(partnerRows(data)),
    html: await render(createElement(PartnerEmail, { data })),
  });
}
