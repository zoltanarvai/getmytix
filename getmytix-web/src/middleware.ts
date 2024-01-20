// middleware.ts
import { NextRequest, NextResponse } from "next/server";

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
