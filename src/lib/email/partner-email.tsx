import { partnerLede, partnerRows } from "./rows";
import { SubmissionEmail } from "./submission-email";
import type { Partner } from "@/lib/submissions";

export function PartnerEmail({ data }: { data: Partner }) {
  return (
    <SubmissionEmail
      preview={`New partner: ${data.company}`}
      eyebrow="New partner"
      title={data.company}
      lede={partnerLede(data)}
      replyTo={data.email}
      replyLabel="Reply"
      rows={partnerRows(data)}
    />
  );
}
