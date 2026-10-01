import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { rateLimited, validateApplication } from "@/lib/submissions";

async function store(kind: string, data: unknown) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "submissions.jsonl"),
    `${JSON.stringify({ kind, at: new Date().toISOString(), data })}\n`,
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limit" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) return Response.json({ error: "invalid" }, { status: 400 });
  if (body.website_url) return Response.json({ ok: true }, { status: 201 });

  const { errors, data } = validateApplication(body);
  if (errors.length) return Response.json({ fields: errors }, { status: 422 });

  await store("application", data);
  return Response.json({ ok: true }, { status: 201 });
}
