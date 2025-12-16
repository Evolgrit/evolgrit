import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "";

  const auth = req.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Evolgrit Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
