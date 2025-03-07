import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((req.nextUrl.pathname.startsWith("/accounts") || req.nextUrl.pathname.startsWith("/categories")) && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/categories/:path*", "/projects/:path*", "/unauthorized/:path*", "/accounts/:path*", "/", "/sales/:path*"],
};
