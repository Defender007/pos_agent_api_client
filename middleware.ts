import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const merchantProtectedRoutes = ["/dashboard", "/agents"];

const bankProtectedRoutes = [
  "/dashboard",
  "/agents",
  "/organizations",
  "/staff",
  "/roles",
  "/permissions",
  "/users",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const merchantToken = request.cookies.get("access_token")?.value;
  const bankToken = request.cookies.get("bank_access_token")?.value;

  const isBankProtectedRoute = bankProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isMerchantProtectedRoute = merchantProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isBankProtectedRoute && bankToken) {
    return NextResponse.next();
  }

  if (isMerchantProtectedRoute && merchantToken) {
    return NextResponse.next();
  }

  if (isBankProtectedRoute) {
    return NextResponse.redirect(new URL("/backoffice/login", request.url));
  }

  if (isMerchantProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agents/:path*",
    "/organizations/:path*",
    "/staff/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
