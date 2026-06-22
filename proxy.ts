import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;
  const userRole = session?.user?.role as string | undefined;

  if (
    pathname.startsWith("/masuk") ||
    pathname.startsWith("/daftar") ||
    pathname.startsWith("/cek-email")
  ) {
    if (isLoggedIn) {
      return redirectToDashboard(request, userRole);
    }
    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith("/dasbor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/romo");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }

  if (pathname.startsWith("/dasbor") && userRole !== "COUPLE") {
    return redirectToDashboard(request, userRole);
  }

  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return redirectToDashboard(request, userRole);
  }

  if (pathname.startsWith("/romo") && userRole !== "PRIEST") {
    return redirectToDashboard(request, userRole);
  }

  return NextResponse.next();
}

function redirectToDashboard(
  request: NextRequest,
  role: string | undefined
): NextResponse {
  switch (role) {
    case "ADMIN":
      return NextResponse.redirect(new URL("/admin/ringkasan", request.url));
    case "PRIEST":
      return NextResponse.redirect(new URL("/romo/jadwal", request.url));
    case "COUPLE":
    default:
      return NextResponse.redirect(new URL("/dasbor/beranda", request.url));
  }
}

export const config = {
  matcher: [
    "/dasbor/:path*",
    "/admin/:path*",
    "/romo/:path*",
    "/masuk",
    "/daftar",
    "/cek-email",
  ],
};
