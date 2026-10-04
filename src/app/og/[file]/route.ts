import { renderOgImage } from "@/lib/og-image";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  return renderOgImage(file === "tr.png" ? "tr" : "en");
}
