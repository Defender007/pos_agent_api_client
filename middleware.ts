import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const bankProtectedRoutes = [
  "/organizations",
  "/staff",
  "/roles",
  "/permissions",
  "/users",
  "/settings",
];

const merchantProtectedRoutes = ["/dashboard", "/agents", "/change-password"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function clearAuthCookies(response: NextResponse) {
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const merchantToken = request.cookies.get("access_token")?.value;
  const bankToken = request.cookies.get("bank_access_token")?.value;

  const isLegacyApprovalRoute = matchesRoute(pathname, "/agents/approvals");

  if (isLegacyApprovalRoute) {
    if (merchantToken && bankToken) {
      return clearAuthCookies(
        NextResponse.redirect(
          new URL("/backoffice/login?session=conflict", request.url),
        ),
      );
    }

    if (!bankToken) {
      return NextResponse.redirect(
        new URL("/backoffice/login?session=expired", request.url),
      );
    }

    const approvalSuffix = pathname.slice("/agents/approvals".length);

    return NextResponse.redirect(
      new URL(
        `/backoffice/agents/approvals${approvalSuffix}`,
        request.url,
      ),
    );
  }

  const isBackofficeLogin = pathname === "/backoffice/login";
  const isBankProtectedRoute =
    !isBackofficeLogin &&
    (matchesRoute(pathname, "/backoffice") ||
      bankProtectedRoutes.some((route) => matchesRoute(pathname, route)));
  const isMerchantProtectedRoute = merchantProtectedRoutes.some((route) =>
    matchesRoute(pathname, route),
  );

  if (
    (isBankProtectedRoute || isMerchantProtectedRoute) &&
    merchantToken &&
    bankToken
  ) {
    const loginPath = isBankProtectedRoute ? "/backoffice/login" : "/login";

    return clearAuthCookies(
      NextResponse.redirect(
        new URL(`${loginPath}?session=conflict`, request.url),
      ),
    );
  }

  if (isBankProtectedRoute && bankToken) {
    return NextResponse.next();
  }

  if (isMerchantProtectedRoute && merchantToken) {
    return NextResponse.next();
  }

  if (isBankProtectedRoute) {
    const loginPath =
      pathname.startsWith("/backoffice/agents") ||
      pathname.startsWith("/backoffice/change-password")
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
    "/backoffice/:path*",
    "/dashboard/:path*",
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
