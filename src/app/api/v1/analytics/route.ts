import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/api-auth";
import { parseRange } from "@/lib/analytics-range";
import { getAnalyticsBreakdown, getDashboardStats } from "@/server/queries";

export async function GET(request: NextRequest) {
  const denied = await authorizeApi(request); if (denied) return denied;
  const range = parseRange(request.nextUrl.searchParams.get("range"));
  const [summary, breakdown] = await Promise.all([
    getDashboardStats(range),
    getAnalyticsBreakdown(range),
  ]);
  return NextResponse.json({ data: { range, summary, breakdown } });
}
