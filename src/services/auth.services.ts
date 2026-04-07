import { loginSchemaType } from "@/schema/auth.schema";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (url) return url.trim().replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:5000";
  throw new Error("API Base URL is not configured (NEXT_PUBLIC_API_BASE_URL required)");
};

const BASE_URL = getBaseUrl();

export async function loginUser(formData: loginSchemaType) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}