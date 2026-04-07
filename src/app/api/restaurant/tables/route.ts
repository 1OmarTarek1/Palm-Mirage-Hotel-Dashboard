import { NextRequest } from "next/server";

import { proxyApiRequest } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/tables/get-table",
    requireAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, {
    backendPath: "/tables/create-table",
    requireAuth: true,
  });
}
