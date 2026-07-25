import { z } from "zod";
import { isAllowedLinkUrl } from "@/lib/link-url";

const linkFieldsSchema = z.object({
    title: z.string().min(1, "Title is required").max(120),
    url: z.string().min(1, "URL is required").max(2048),
    description: z.string().max(300).optional().nullable(),
    icon: z.string().max(120).optional().nullable(),
    imageUrl: z.string().max(2048).optional().nullable(),
    type: z.enum(["url", "email", "phone", "whatsapp", "sms", "vcard", "file", "embed"]).default("url"),
    isHighlighted: z.boolean().default(false),
    isActive: z.boolean().default(true),
    scheduleStart: z.string().optional().nullable(),
    scheduleEnd: z.string().optional().nullable(),
  });

export const linkInputSchema = linkFieldsSchema.refine((link) => isAllowedLinkUrl(link.type, link.url), {
    path: ["url"],
    message: "URL scheme is not allowed for this link type",
  });

export const linkPatchSchema = linkFieldsSchema.partial();

export const reorderInputSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});
