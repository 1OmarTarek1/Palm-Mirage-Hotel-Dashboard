import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  const cookieNames = request.cookies.getAll().map(c => c.name);
  console.log(`Middleware Run: Path: ${pathname}, Has Token: ${!!token}, Cookies: ${cookieNames.join(", ")}`);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const authpages = pathname === "/login";

  if (token && authpages) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && !authpages) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
  ],
};
