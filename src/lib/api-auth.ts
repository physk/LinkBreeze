import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { hashApiKey, verifyApiKey } from "@/lib/api-key";
import { rateLimit } from "@/lib/rate-limit";

const LIMIT = 120;
const WINDOW_MS = 60_000;

export async function authorizeApi(request: NextRequest): Promise<NextResponse | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  if (!match || !(await verifyApiKey(match[1]))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = hashApiKey(match[1]).slice(0, 16);
  const result = rateLimit(`api:${keyId}`, LIMIT, WINDOW_MS);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))) } },
    );
  }
  return null;
}

export function apiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "Invalid request";
  return NextResponse.json({ error: message }, { status: 400 });
}
