"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerUI
        url="/api/v1/openapi.json"
        deepLinking
        displayRequestDuration
        docExpansion="list"
        persistAuthorization={false}
        tryItOutEnabled
      />
    </main>
  );
}
