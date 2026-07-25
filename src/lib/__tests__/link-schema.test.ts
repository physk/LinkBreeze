import { describe, expect, it } from "vitest";
import { linkInputSchema, linkPatchSchema, reorderInputSchema } from "@/lib/link-schema";

describe("public API schemas", () => {
  it("accepts a valid link and supplies defaults", () => {
    expect(linkInputSchema.parse({ title: "Example", url: "https://example.com" }))
      .toMatchObject({ type: "url", isActive: true, isHighlighted: false });
  });
  it("rejects unsafe URL schemes", () => {
    expect(linkInputSchema.safeParse({ title: "Bad", url: "javascript:alert(1)" }).success).toBe(false);
  });
  it("accepts partial updates", () => {
    expect(linkPatchSchema.safeParse({ title: "Renamed" }).success).toBe(true);
  });
  it("rejects empty reorder requests", () => {
    expect(reorderInputSchema.safeParse({ ids: [] }).success).toBe(false);
  });
});
