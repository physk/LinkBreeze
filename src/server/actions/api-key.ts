"use server";

import { getSession } from "@/lib/auth";
import { demoBlock } from "@/lib/demo";
import { generateApiKey, revokeApiKey } from "@/lib/api-key";

export async function createApiKey(): Promise<{ success: true; apiKey: string } | { success: false; error: string }> {
  const demo = demoBlock();
  if (demo) return { success: false, error: demo };
  if (!(await getSession())) return { success: false, error: "Unauthorized" };
  return { success: true, apiKey: await generateApiKey() };
}

export async function deleteApiKey(): Promise<{ success: true } | { success: false; error: string }> {
  const demo = demoBlock();
  if (demo) return { success: false, error: demo };
  if (!(await getSession())) return { success: false, error: "Unauthorized" };
  await revokeApiKey();
  return { success: true };
}
