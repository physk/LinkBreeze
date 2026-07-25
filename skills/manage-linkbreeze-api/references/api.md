# LinkBreeze REST API v1

Base path: `/api/v1`. Authenticate all resource requests with `Authorization: Bearer <key>`. Open interactive Swagger UI at `/api/docs` or retrieve the machine-readable OpenAPI 3.0 document from `/api/v1/openapi.json`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/links` | List links in display order |
| POST | `/links` | Create a link |
| PUT | `/links/{id}` | Update selected link fields |
| DELETE | `/links/{id}` | Delete a link |
| PUT | `/links/reorder` | Set the complete display order |
| GET | `/profile` | Read the public profile |
| PUT | `/profile` | Create or replace profile fields |
| GET | `/analytics?range=7d` | Read analytics (`7d`, `30d`, `90d`, `all`) |

Successful JSON responses wrap their payload as `{ "data": ... }`. Delete returns HTTP 204.

## Link JSON

Create requires `title` and `url`. Optional fields are `description`, `icon`, `imageUrl`, `type`, `isHighlighted`, `isActive`, `scheduleStart`, and `scheduleEnd`. Supported types are `url`, `email`, `phone`, `whatsapp`, `sms`, `vcard`, `file`, and `embed`.

```json
{
  "title": "Example",
  "url": "https://example.com",
  "description": "Optional description",
  "type": "url",
  "isHighlighted": false,
  "isActive": true
}
```

Reorder requires the full unique ID set:

```json
{ "ids": [3, 1, 2] }
```

## Profile JSON

`displayName` is required. `socialLinks` must use a platform supported by the installed LinkBreeze version.

```json
{
  "displayName": "Chris",
  "bio": "",
  "badgeText": null,
  "avatarUrl": null,
  "socialLinks": [
    { "platform": "github", "url": "https://github.com/physk" }
  ]
}
```

## Analytics JSON

The analytics response contains `range`, `summary`, and `breakdown`. Summary includes totals, CTR, top links, and daily view/click series. Breakdown includes referrers, devices, and countries. Analytics is read-only.
