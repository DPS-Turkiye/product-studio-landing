import { sendPartner } from "@/lib/mail";
import { acceptSubmission, partnerSchema } from "@/lib/submissions";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return acceptSubmission(request, partnerSchema, sendPartner);
}
