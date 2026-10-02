import { applicationLede, applicationRows } from "./rows";
import { SubmissionEmail } from "./submission-email";
import type { Application } from "@/lib/submissions";

export function ApplicationEmail({ data }: { data: Application }) {
  return (
    <SubmissionEmail
      preview={`New application from ${data.full_name}`}
      eyebrow="New application"
      title={data.full_name}
      lede={applicationLede(data)}
      replyTo={data.email}
      replyLabel="Reply"
      rows={applicationRows(data)}
    />
  );
}
