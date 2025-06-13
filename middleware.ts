import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get("origin") || "*"

  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Clone the response and add CORS headers
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  return NextResponse.next()
}
