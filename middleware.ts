import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/api-config";

const LOGIN_PATH = "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const isLoginRoute = pathname === LOGIN_PATH;

  if (!token && !isLoginRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
