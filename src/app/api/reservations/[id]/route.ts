import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyApiRequest(request, {
    backendPath: `/reservations/${id}`,
    requireAuth: true,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyApiRequest(request, {
    backendPath: `/reservations/${id}`,
    requireAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyApiRequest(request, {
    backendPath: `/reservations/${id}`,
    requireAuth: true,
  });
}
