import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const getBaseUrl = () => {
    const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    if (url) return url.trim().replace(/\/$/, "");
    if (process.env.NODE_ENV === "development") return "http://localhost:5000";
    throw new Error("API Base URL is not configured (API_BASE_URL or NEXT_PUBLIC_API_BASE_URL required)");
};

const API_BASE_URL = getBaseUrl();

interface ProxyOptions {
  backendPath: string;
  requireAuth?: boolean;
  /** Unauthenticated GET only. Never combine with requireAuth. */
  nextRevalidate?: number;
}

function buildBackendUrl(request: NextRequest, backendPath: string) {
  const url = new URL(backendPath, API_BASE_URL);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function getProxyBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return request.formData();
  }

  if (contentType.includes("application/json") || contentType.includes("text/plain")) {
    return request.text();
  }

  return request.arrayBuffer();
}

async function getProxyHeaders(request: NextRequest, requireAuth: boolean) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType && !contentType.includes("multipart/form-data")) {
    headers.set("Content-Type", contentType);
  }

  if (!requireAuth) {
    return headers;
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const accessToken = typeof token?.accessToken === "string" ? token.accessToken : null;
  const role = typeof token?.user?.role === "string" ? token.user.role : null;

  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const authScheme = role === "admin" ? "System" : "Bearer";
  headers.set("Authorization", `${authScheme} ${accessToken}`);

  return headers;
}

async function parseBackendResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? text : null;
}

export async function proxyApiRequest(
  request: NextRequest,
  { backendPath, requireAuth = false, nextRevalidate }: ProxyOptions
) {
  try {
    const [headers, body] = await Promise.all([
      getProxyHeaders(request, requireAuth),
      getProxyBody(request),
    ]);

    const isSafeRevalidatedGet =
      (request.method === "GET" || request.method === "HEAD") &&
      typeof nextRevalidate === "number" &&
      nextRevalidate > 0 &&
      !requireAuth;

    const response = await fetch(buildBackendUrl(request, backendPath), {
      method: request.method,
      headers,
      body,
      ...(isSafeRevalidatedGet
        ? { next: { revalidate: nextRevalidate } }
        : { cache: "no-store" }),
    });

    const payload = await parseBackendResponse(response);

    if (payload === null || payload === "") {
      return new NextResponse(null, { status: response.status });
    }

    if (typeof payload === "string") {
      return new NextResponse(payload, {
        status: response.status,
        headers: response.headers,
      });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    const status = message.includes("session has expired") ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
