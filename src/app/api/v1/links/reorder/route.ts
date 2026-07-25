import { NextRequest, NextResponse } from "next/server";
import { authorizeApi, apiError } from "@/lib/api-auth";
import { reorderInputSchema } from "@/lib/link-schema";
import { getAllLinks, reorderLinks } from "@/server/queries";

export async function PUT(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  try {
    const { ids } = reorderInputSchema.parse(await request.json());
    const existing = await getAllLinks();
    if (ids.length !== existing.length || new Set(ids).size !== ids.length || ids.some((id) => !existing.some((link) => link.id === id))) {
      return NextResponse.json({ error: "ids must contain every link exactly once" }, { status: 400 });
    }
    await reorderLinks(ids);
    return NextResponse.json({ data: await getAllLinks() });
  } catch (error) { return apiError(error); }
}
