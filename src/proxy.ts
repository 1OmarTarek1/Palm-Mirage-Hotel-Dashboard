import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function proxy(request : NextRequest) {

  const token = await getToken({req : request})

  const {pathname} = request.nextUrl

  const authpages = pathname == '/login'
  
  if(token && authpages){
    return NextResponse.redirect(new URL('/' , request.url))
  }

  if(!token && !authpages){
    return NextResponse.redirect (new URL("/login" , request.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    "/",
    "/activities/:path*",
    "/facilities/:path*",
    "/menu/:path*",
    "/restaurant/:path*",
    "/rooms/:path*",
    "/users/:path*",
    "/login",
  ],
};