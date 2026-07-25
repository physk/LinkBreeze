import { NextRequest, NextResponse } from "next/server";
import { authorizeApi, apiError } from "@/lib/api-auth";
import { linkInputSchema, linkPatchSchema } from "@/lib/link-schema";
import { deleteLink, getLink, updateLink } from "@/server/queries";

function idFrom(value: string): number | null { const id = Number(value); return Number.isInteger(id) && id > 0 ? id : null; }

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorizeApi(request); if (denied) return denied;
  const id = idFrom((await params).id); if (!id) return NextResponse.json({ error: "Invalid link id" }, { status: 400 });
  const existing = await getLink(id);
  if (!existing) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  try {
    const patch = linkPatchSchema.parse(await request.json());
    linkInputSchema.parse({ ...existing, ...patch });
    const input = patch;
    await updateLink(id, input);
    return NextResponse.json({ data: await getLink(id) });
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorizeApi(request); if (denied) return denied;
  const id = idFrom((await params).id); if (!id) return NextResponse.json({ error: "Invalid link id" }, { status: 400 });
  if (!(await getLink(id))) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  await deleteLink(id);
  return new NextResponse(null, { status: 204 });
}
