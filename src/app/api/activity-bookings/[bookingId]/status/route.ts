import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { bookingId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/activity-bookings/${bookingId}/status`,
    requireAuth: true,
  });
}
