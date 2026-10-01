import { sendApplication } from "@/lib/mail";
import { acceptSubmission, applicationSchema } from "@/lib/submissions";

export async function POST(request: Request) {
  return acceptSubmission(request, applicationSchema, sendApplication);
}
