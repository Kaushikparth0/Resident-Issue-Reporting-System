import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api") || 
    pathname.includes(".") ||
    pathname === "/login" || 
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  let session = null;
  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session || session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect resident routes
  if (pathname.startsWith("/resident")) {
    if (!session || session.user?.role !== "resident") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/resident", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/resident/:path*", "/login", "/register"],
};
