import { NextResponse } from "next/server";

const linkSchema = {
  type: "object",
  required: ["title", "url"],
  properties: {
    id: { type: "integer", readOnly: true }, title: { type: "string", maxLength: 120 },
    url: { type: "string", maxLength: 2048 }, description: { type: ["string", "null"], maxLength: 300 },
    icon: { type: ["string", "null"] }, imageUrl: { type: ["string", "null"] },
    type: { type: "string", enum: ["url", "email", "phone", "whatsapp", "sms", "vcard", "file", "embed"] },
    isHighlighted: { type: "boolean" }, isActive: { type: "boolean" },
    scheduleStart: { type: ["string", "null"] }, scheduleEnd: { type: ["string", "null"] },
    orderIndex: { type: "integer", readOnly: true }, clicksCount: { type: "integer", readOnly: true },
    createdAt: { type: "string", readOnly: true },
  },
};
const security = [{ bearerAuth: [] }];
const errors = { "401": { description: "Missing or invalid API key" }, "429": { description: "Rate limit exceeded" } };

export function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: { title: "LinkBreeze API", version: "1.0.0", description: "Programmatic link management for LinkBreeze." },
    servers: [{ url: "/api/v1" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "LinkBreeze API key" } }, schemas: { Link: linkSchema } },
    paths: {
      "/links": {
        get: { summary: "List links", security, responses: { "200": { description: "Links" }, ...errors } },
        post: { summary: "Create a link", security, requestBody: { required: true, content: { "application/json": { schema: linkSchema } } }, responses: { "201": { description: "Created link" }, "400": { description: "Invalid input" }, ...errors } },
      },
      "/links/{id}": {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        put: { summary: "Update a link", security, requestBody: { required: true, content: { "application/json": { schema: linkSchema } } }, responses: { "200": { description: "Updated link" }, "404": { description: "Not found" }, ...errors } },
        delete: { summary: "Delete a link", security, responses: { "204": { description: "Deleted" }, "404": { description: "Not found" }, ...errors } },
      },
      "/links/reorder": {
        put: { summary: "Reorder links", security, requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["ids"], properties: { ids: { type: "array", items: { type: "integer" } } } } } } }, responses: { "200": { description: "Reordered links" }, "400": { description: "Invalid order" }, ...errors } },
      },
    },
  });
}
