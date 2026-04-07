import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/room-amenities",
    nextRevalidate: 120,
  });
}

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/room-amenities",
    requireAuth: true,
  });
}
