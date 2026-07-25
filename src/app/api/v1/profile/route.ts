import { NextRequest, NextResponse } from "next/server";
import { authorizeApi, apiError } from "@/lib/api-auth";
import { profileInputSchema } from "@/lib/profile-schema";
import { getProfile, updateProfile } from "@/server/queries";

function serializeProfile(value: Awaited<ReturnType<typeof getProfile>>) {
  if (!value) return null;
  let socialLinks: unknown[] = [];
  try { socialLinks = JSON.parse(value.socialLinks); } catch { /* preserve a usable API response */ }
  return { ...value, socialLinks };
}

export async function GET(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  const value = serializeProfile(await getProfile());
  if (!value) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json({ data: value });
}

export async function PUT(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  try {
    const input = profileInputSchema.parse(await request.json());
    await updateProfile({
      ...input,
      badgeText: input.badgeText ?? null,
      avatarUrl: input.avatarUrl ?? null,
      socialLinks: JSON.stringify(input.socialLinks),
    });
    return NextResponse.json({ data: serializeProfile(await getProfile()) });
  } catch (error) { return apiError(error); }
}
