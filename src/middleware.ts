import { NextResponse } from "next/server";

export function middleware() {
	const response = NextResponse.next();

	if (process.env.NODE_ENV === "development") {
		response.headers.set("X-Astrozel-Debug", "mobile-6.7c");
	}

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
