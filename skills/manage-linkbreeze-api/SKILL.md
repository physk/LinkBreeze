---
name: manage-linkbreeze-api
description: Manage a LinkBreeze instance through its authenticated REST API. Use when an agent needs to list, create, update, reorder, or delete LinkBreeze links; read or update the public profile; inspect analytics; or verify API health without using browser automation.
---

# Manage LinkBreeze API

Use the supported v1 REST API and preserve user data by inspecting current state before mutation.

## Configure access

Require these environment variables:

```bash
export LINKBREEZE_BASE_URL="https://links.example.com"
export LINKBREEZE_API_KEY="lb_..."
```

Never print, commit, persist in shell scripts, or pass the key directly as a command-line argument. The bundled helper writes the header to a mode-0600 temporary curl config and removes it on exit.

Verify access before changing data:

```bash
skills/manage-linkbreeze-api/scripts/linkbreeze-api health
skills/manage-linkbreeze-api/scripts/linkbreeze-api links-list
```

## Apply changes safely

1. Read the existing links and profile.
2. Identify objects by numeric `id`; do not infer an ID from array position.
3. Show the intended mutation when human approval is required.
4. Make the smallest API request that achieves the requested state.
5. Read the affected resource again and verify exact fields.
6. For reorder operations, submit every current link ID exactly once.
7. Never delete as part of an update or reorder workaround.

Use JSON files for request bodies so secrets and complex quoting do not enter shell history:

```bash
skills/manage-linkbreeze-api/scripts/linkbreeze-api link-create /tmp/link.json
skills/manage-linkbreeze-api/scripts/linkbreeze-api link-update 12 /tmp/link-patch.json
skills/manage-linkbreeze-api/scripts/linkbreeze-api links-reorder /tmp/order.json
skills/manage-linkbreeze-api/scripts/linkbreeze-api profile-update /tmp/profile.json
```

Read [references/api.md](references/api.md) for schemas, endpoints, and examples before constructing a mutation.

## Handle failures

- `401`: stop and request a valid API key; never attempt dashboard-password automation.
- `400`: inspect the JSON schema and URL scheme; do not weaken validation.
- `404`: refresh state because the ID or profile may no longer exist.
- `429`: honor `Retry-After` and retry once after the stated interval.
- `5xx`: stop mutations, verify `/api/health`, and report the response.

Do not scrape the dashboard or access the SQLite database when the API is available.
