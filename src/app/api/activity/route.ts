import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/activity",
  });
}

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/activity",
    requireAuth: true,
  });
}
