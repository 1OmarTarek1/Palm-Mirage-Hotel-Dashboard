interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: BodyInit | object | null;
  headers?: HeadersInit;
  params?: Record<string, string | number | boolean | null | undefined>;
}

interface ApiErrorPayload {
  message?: string;
  details?: Array<{
    message?: string;
  }>;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorPayload | string | null;

  constructor(message: string, status: number, data: ApiErrorPayload | string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, "http://localhost");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return `${url.pathname}${url.search}`;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? text : null;
}

function normalizeRequestBody(body: RequestOptions["body"], headers: Headers) {
  if (body === null || body === undefined) return undefined;

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    typeof body === "string"
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const response = await fetch(buildUrl(path, options.params), {
    ...options,
    headers,
    body: normalizeRequestBody(options.body, headers),
    credentials: "same-origin",
    cache: "no-store",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const errorData =
      typeof data === "object" && data !== null ? (data as ApiErrorPayload) : data;
    const validationDetails =
      typeof errorData === "object" && errorData !== null ? errorData.details : undefined;
    const message =
      Array.isArray(validationDetails) && validationDetails.length > 0
        ? validationDetails[0]?.message || errorData?.message || response.statusText
        : typeof errorData === "object" && errorData !== null && errorData.message
          ? errorData.message
          : response.statusText || "Request failed";

    throw new ApiError(message, response.status, errorData);
  }

  return data as T;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const validationDetails =
      typeof error.data === "object" && error.data !== null ? error.data.details : undefined;

    if (Array.isArray(validationDetails) && validationDetails.length > 0) {
      return validationDetails[0]?.message ?? error.message;
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Request failed";
}
