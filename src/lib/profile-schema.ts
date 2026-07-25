import { z } from "zod";
import { SUPPORTED_PLATFORMS } from "@/lib/social-icons";

const platformEnum = z.enum(SUPPORTED_PLATFORMS as [string, ...string[]]);

export const socialLinkSchema = z.object({
  platform: platformEnum,
  url: z.string().min(1).max(2048),
});

export const profileInputSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(80),
  bio: z.string().max(300).optional().default(""),
  badgeText: z.string().max(40).optional().nullable(),
  avatarUrl: z.string().max(2048).optional().nullable(),
  socialLinks: z.array(socialLinkSchema).default([]),
});
