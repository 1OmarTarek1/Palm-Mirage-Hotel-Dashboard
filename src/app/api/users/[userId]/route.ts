import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { userId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/user/${userId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { userId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/user/${userId}`,
    requireAuth: true,
  });
}
