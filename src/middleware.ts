import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  // Check if the current path is the root path
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/products/planning", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on the root path
export const config = {
  matcher: "/",
};