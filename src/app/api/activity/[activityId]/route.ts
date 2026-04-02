import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    activityId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { activityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity/${activityId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { activityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity/${activityId}`,
    requireAuth: true,
  });
}
