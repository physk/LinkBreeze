"use client";

import * as React from "react";
import { KeyRound } from "lucide-react";
import { createApiKey, deleteApiKey } from "@/server/actions/api-key";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiKeyManager({ configured }: { configured: boolean }) {
  const [exists, setExists] = React.useState(configured);
  const [key, setKey] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  function generate() {
    startTransition(async () => {
      const result = await createApiKey();
      if (!result.success) return setError(result.error);
      setKey(result.apiKey);
      setExists(true);
      setError(null);
    });
  }

  function revoke() {
    startTransition(async () => {
      const result = await deleteApiKey();
      if (!result.success) return setError(result.error);
      setKey(null);
      setExists(false);
      setError(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound className="size-5" />REST API</CardTitle>
        <CardDescription>Create a Bearer token for programmatic link management. Generating a new key revokes the old one.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {key ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
            <p className="mb-2 text-sm font-medium">Copy this key now. It will not be shown again.</p>
            <code className="break-all text-xs">{key}</code>
          </div>
        ) : <p className="text-sm text-muted-foreground">{exists ? "An API key is configured." : "No API key is configured."}</p>}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Button type="button" onClick={generate} disabled={pending}>{exists ? "Regenerate key" : "Generate key"}</Button>
          {exists ? <Button type="button" variant="outline" onClick={revoke} disabled={pending}>Revoke key</Button> : null}
          <a className="inline-flex items-center text-sm underline" href="/api/v1/openapi.json" target="_blank" rel="noreferrer">OpenAPI document</a>
        </div>
      </CardContent>
    </Card>
  );
}
