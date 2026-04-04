import { NextRequest } from "next/server";

import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{ bookingId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { bookingId } = await params;

  return proxyApiRequest(request, {
    backendPath: `/booking/${bookingId}/status`,
    requireAuth: true,
  });
}
