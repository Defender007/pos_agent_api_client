import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const merchantProtectedRoutes = ["/dashboard", "/agents", "/change-password"];

const bankProtectedRoutes = [
  "/backoffice/dashboard",
  "/backoffice/change-password",
  "/agents/approvals",
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

  const isMerchantProtectedRoute =
    !isBankProtectedRoute &&
    merchantProtectedRoutes.some((route) => pathname.startsWith(route));

  if (
    (isBankProtectedRoute || isMerchantProtectedRoute) &&
    merchantToken &&
    bankToken
  ) {
    const loginPath = isBankProtectedRoute ? "/backoffice/login" : "/login";
    const response = NextResponse.redirect(
      new URL(`${loginPath}?session=conflict`, request.url),
    );

    response.cookies.set("access_token", "", {
      expires: new Date(0),
      path: "/",
    });
    response.cookies.set("bank_access_token", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  }

  if (isBankProtectedRoute && bankToken) {
    return NextResponse.next();
  }

  if (isMerchantProtectedRoute && merchantToken) {
    return NextResponse.next();
  }

  if (isBankProtectedRoute) {
    const loginPath = pathname.startsWith("/backoffice/change-password")
      ? "/backoffice/login?session=expired"
      : "/backoffice/login";

    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (isMerchantProtectedRoute) {
    const loginPath = pathname.startsWith("/change-password")
      ? "/login?session=expired"
      : "/login";

    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/backoffice/dashboard/:path*",
    "/backoffice/change-password/:path*",
    "/change-password/:path*",
    "/agents/:path*",
    "/organizations/:path*",
    "/staff/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
