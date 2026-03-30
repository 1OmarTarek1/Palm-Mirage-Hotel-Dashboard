import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function getAuthScheme() {
  const session = await getSession();
  return session?.user?.role === "admin" ? "System" : "Bearer";
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const validationDetails = responseData?.details;

    if (Array.isArray(validationDetails) && validationDetails.length > 0) {
      return validationDetails[0]?.message ?? responseData?.message ?? error.message;
    }

    return responseData?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Request failed";
}

export async function getAuthHeaders() {
  const accessToken = await getAccessToken();
  const authScheme = await getAuthScheme();

  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return {
    Authorization: `${authScheme} ${accessToken}`,
  };
}
