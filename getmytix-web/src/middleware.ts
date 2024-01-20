// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host) {
    // Extract the subdomain from the host header
    const subdomain = host.split(".")[0];

    // Check if the subdomain corresponds to an event
    if (subdomain === "sailwithus") {
      // Rewrite the request to the event's page
      return NextResponse.rewrite(new URL("/events/sailwithus", request.url));
    }
  }

  // Continue with the regular flow if no subdomain logic needs to be applied
  return NextResponse.next();
}
