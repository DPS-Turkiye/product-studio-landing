import { sendApplication } from "@/lib/mail";
import { acceptSubmission, applicationSchema } from "@/lib/submissions";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return acceptSubmission(request, applicationSchema, sendApplication);
}
