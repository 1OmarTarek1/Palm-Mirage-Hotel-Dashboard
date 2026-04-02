import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  return proxyApiRequest(request, {
    backendPath: `/rooms/${roomId}`,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  return proxyApiRequest(request, {
    backendPath: `/rooms/${roomId}`,
    requireAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  return proxyApiRequest(request, {
    backendPath: `/rooms/${roomId}`,
    requireAuth: true,
  });
}
