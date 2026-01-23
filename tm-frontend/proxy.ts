// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/app", "/board"];
const publicRoutes = ["/signin", "/signup"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/app", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
