import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    itemId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { itemId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/menu/update-item/${itemId}`,
    requireAuth: true,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { itemId } = await context.params;
  return proxyApiRequest(request, {
    backendPath: `/menu/delete-item/${itemId}`,
    requireAuth: true,
  });
}
