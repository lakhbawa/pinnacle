import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes: string[] = [
    "/u/"
];

export async function proxy(req: NextRequest) {
    console.log("middleware");

    // Get the session token from the JWT
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = req.nextUrl;

    // Check if current path is protected
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)  // Added return statement
    );

    // Redirect unauthenticated users away from protected routes
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
}

// Optional: Configure which routes this middleware runs on
export const config = {
    matcher: ['/u/:path*']  // Only run on routes starting with /u/
};