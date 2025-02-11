import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = "/dashboard"; // Protect all routes under /dashboard
const authRoutes = ["/"]; // Routes to redirect if session exists

// Helper function to decode a JWT token (without external libraries)
function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split(".")[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if auth_token cookie exists
  const auth_token = req.cookies.get("auth_token")?.value;

  if (auth_token) {
    const decodedToken = decodeJWT(auth_token);
    const role = decodedToken?.role; // Extract user role from the token

    // Redirect to /dashboard if trying to access auth-related paths while logged in
    if (authRoutes.includes(pathname)) {
      const homeUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(homeUrl);
    }

    // If user role is 'member' and trying to access /dashboard/members
    if (role === "member" && pathname.startsWith("/dashboard/members")) {
      const redirectUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If user role is 'member' and trying to access /dashboard/members
    if (role === "member" && pathname === "/dashboard") {
      const redirectUrl = new URL("/dashboard/projects", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    // Protect all routes under /dashboard for unauthenticated users
    if (pathname.startsWith(protectedRoutes)) {
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("redirect", pathname); // Optional: Redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
