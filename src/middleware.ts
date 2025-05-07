import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the current path is the root path
  if (request.nextUrl.pathname === "/") {
    // Redirect to /dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on the root path
export const config = {
  matcher: "/",
};