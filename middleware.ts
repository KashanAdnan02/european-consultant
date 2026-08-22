import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === LOGIN_PATH;

  if (!user && !isLoginRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
