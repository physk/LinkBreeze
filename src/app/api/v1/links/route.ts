import { NextRequest, NextResponse } from "next/server";
import { authorizeApi, apiError } from "@/lib/api-auth";
import { linkInputSchema } from "@/lib/link-schema";
import { createLink, getAllLinks } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  return NextResponse.json({ data: await getAllLinks() });
}

export async function POST(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  try {
    const input = linkInputSchema.parse(await request.json());
    const created = await createLink(input);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) { return apiError(error); }
}
