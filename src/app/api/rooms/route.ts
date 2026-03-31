import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/rooms",
  });
}

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/rooms/create-room",
    requireAuth: true,
  });
}
