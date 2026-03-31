import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    scheduleId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { scheduleId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity-schedules/${scheduleId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { scheduleId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity-schedules/${scheduleId}`,
    requireAuth: true,
  });
}
