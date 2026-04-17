import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const session = token ? { user: token } : null;
  const path = request.nextUrl.pathname;

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/signin", "/about", "/people", "/read-watch"];
  const isPublicRoute = publicRoutes.some((route) =>
    route === "/"
      ? path === "/"
      : path === route || path.startsWith(`${route}/`),
  );

  // Admin-only routes
  const adminRoutes = ["/admin"];

  // Asisten-only routes
  const asistenRoutes = ["/asisten"];

  // Read & Watch management is strictly for ASISTEN
  const asistenStrictRoutes = ["/asisten/read-watch"];

  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If user is authenticated and trying to access signin, redirect to dashboard
  if (session && path === "/signin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Role-based route protection
  if (session) {
    const userRole = (session.user as any)?.role || "MAHASISWA";

    if (
      adminRoutes.some((route) => path.startsWith(route)) &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      asistenRoutes.some((route) => path.startsWith(route)) &&
      userRole !== "ASISTEN" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      asistenStrictRoutes.some((route) => path.startsWith(route)) &&
      userRole !== "ASISTEN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
