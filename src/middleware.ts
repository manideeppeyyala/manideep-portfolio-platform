/**
 * Route protection.
 *
 * Runs before every /admin request. An unauthenticated visitor is
 * redirected to the login page and never reaches admin code or data —
 * the check happens at the edge, not inside the page.
 *
 * The API routes verify the session independently (`requireAdmin`), so
 * protection doesn't depend on middleware alone.
 */

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "pm_admin_session";

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return false;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLogin = pathname === "/admin/login";
  const authed = await hasValidSession(request);

  if (!authed && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    // Remember where they were headed so login can return them there.
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Already signed in and hitting the login page — go straight to the dashboard.
  if (authed && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
