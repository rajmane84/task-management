// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/app"];
const publicRoutes = ["/signin", "/signup"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Middleware invoked for path:", pathname);
  const token = req.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect to /signin if the token is not present
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // Redirect authenticated users away from public routes
  if (isPublicRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      // User is authenticated, redirect to app dashboard
      return NextResponse.redirect(new URL("/app", req.nextUrl));
    } catch {
      // Token is invalid, allow access to public route
      const res = NextResponse.next();
      res.cookies.delete("accessToken");
      return res;
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
