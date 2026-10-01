import { sendPartner } from "@/lib/mail";
import { acceptSubmission, partnerSchema } from "@/lib/submissions";

export async function POST(request: Request) {
  return acceptSubmission(request, partnerSchema, sendPartner);
}
