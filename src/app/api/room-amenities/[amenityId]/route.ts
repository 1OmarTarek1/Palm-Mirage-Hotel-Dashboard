import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    amenityId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { amenityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/room-amenities/${amenityId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { amenityId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/room-amenities/${amenityId}`,
    requireAuth: true,
  });
}
