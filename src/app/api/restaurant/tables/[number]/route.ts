import { NextRequest } from "next/server";

import { proxyApiRequest } from "@/lib/server-api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  return proxyApiRequest(request, {
    backendPath: `/tables/update-table/${number}`,
    requireAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  return proxyApiRequest(request, {
    backendPath: `/tables/delete-table/${number}`,
    requireAuth: true,
  });
}
