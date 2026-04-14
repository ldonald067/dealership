import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as Record<string, unknown>)?.role as string | undefined;

  // Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Dealer routes — only accessible by dealers
  if (pathname.startsWith("/dealer") && role !== "DEALER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Customer routes — redirect dealers to their portal
  const customerRoutes = ["/dashboard", "/vehicles", "/documents", "/credit", "/appointments", "/status"];
  if (customerRoutes.some((r) => pathname.startsWith(r)) && role === "DEALER") {
    return NextResponse.redirect(new URL("/dealer/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
