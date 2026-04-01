import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    facilityId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { facilityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/facilities/${facilityId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { facilityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/facilities/${facilityId}`,
    requireAuth: true,
  });
}
