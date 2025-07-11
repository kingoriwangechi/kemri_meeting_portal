import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// Public paths that don't require authentication
	const publicPaths = ["/", "/auth/signin", "/auth/error"];

	// Allow public paths, static assets, API routes, and all auth-related paths
	if (
		publicPaths.some((path) => pathname === path) ||
		pathname.includes("/_next") ||
		pathname.includes("/images") ||
		pathname.includes("/api/") ||
		pathname.startsWith("/auth/")
	) {
		return NextResponse.next();
	}

	// Check for session token
	const token = await getToken({ req: request });

	// Redirect to login if not authenticated
	if (!token) {
		const url = new URL("/auth/signin", request.url);
		url.searchParams.set("callbackUrl", encodeURI(request.url));
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
	matcher: [
		/*
		 * Match all paths except:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. /images (static files)
		 * 4. /favicon.ico, /manifest.json (browser files)
		 */
		"/((?!api|_next|images|favicon.ico|manifest.json).*)",
	],
};
