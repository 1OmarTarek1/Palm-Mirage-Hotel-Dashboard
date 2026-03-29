import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: "26bee57a22b68f100a554fb62da66e91f4d90372cde7f8b9f6d569cf8645d86e",
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
    "/dashboard/:path*",
    
  ],
};
