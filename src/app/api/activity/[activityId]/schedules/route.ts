import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    activityId: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { activityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity/${activityId}/schedules`,
    requireAuth: true,
  });
}
