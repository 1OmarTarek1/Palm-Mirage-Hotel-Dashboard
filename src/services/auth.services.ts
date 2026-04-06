import { loginSchemaType } from "@/schema/auth.schema";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_BASE_URL;

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