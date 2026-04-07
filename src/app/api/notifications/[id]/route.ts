import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/notifications/admin/${encodeURIComponent(id)}`,
    requireAuth: true,
  });
}
