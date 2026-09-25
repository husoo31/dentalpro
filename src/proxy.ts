import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "public_locale";

// Public locale routing: Turkish (default) is unprefixed, English is served under /en.
// /en/* is rewritten to the same route tree and tagged with x-public-locale.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const path = isEn ? pathname.slice(3) || "/" : pathname;

  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!isEn && request.cookies.get(COOKIE)?.value === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-public-locale", isEn ? "en" : "tr");

  if (isEn) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
