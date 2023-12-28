import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.cookies.get("auth_token")) {
    const search = new URLSearchParams({ redirect: request.nextUrl.pathname });
    const url = new URL("/auth/login", request.url);
    url.search = search.toString();
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
