import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface ServerAuthSession {
  accessToken: string | null;
  role: string | null;
  userId: string | null;
}

async function decodeSessionToken() {
  const myCookies = await cookies()
  const decodedToken = myCookies.get("next-auth.session-token")?.value || myCookies.get("__Secure-next-auth.session-token")?.value
  return decode({ token: decodedToken, secret: process.env.AUTH_SECRET! })
}

export async function getServerAuthSession(): Promise<ServerAuthSession> {
  const token = await decodeSessionToken()

  let userId = token?.id ? String(token.id) : null

  if (!userId && token?.accessToken && typeof token.accessToken === "string") {
    try {
      const decoded: { id: string } = jwtDecode(token.accessToken);
      userId = decoded.id;
    } catch (error) {
      console.error("Fallback decoding failed", error);
    }
  }

  return {
    accessToken: typeof token?.accessToken === "string" ? token.accessToken : null,
    role: typeof token?.user?.role === "string" ? token.user.role : null,
    userId,
  }
}

export async function getUserToken() {
  const session = await getServerAuthSession()
  return session.accessToken
}

export async function getUserId() {
  const session = await getServerAuthSession()
  return session.userId
}
