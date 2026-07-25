import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSetting, updateSetting } from "@/server/queries";

const SETTING_KEY = "apiKeyHash";
const PREFIX = "lb_";

export function hashApiKey(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function generateApiKey(): Promise<string> {
  const key = `${PREFIX}${randomBytes(32).toString("base64url")}`;
  await updateSetting(SETTING_KEY, hashApiKey(key));
  return key;
}

export async function revokeApiKey(): Promise<void> {
  await updateSetting(SETTING_KEY, "");
}

export async function hasApiKey(): Promise<boolean> {
  return !!(await getSetting(SETTING_KEY));
}

export async function verifyApiKey(candidate: string): Promise<boolean> {
  if (!candidate.startsWith(PREFIX)) return false;
  const expected = await getSetting(SETTING_KEY);
  if (!expected) return false;
  const actual = hashApiKey(candidate);
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
