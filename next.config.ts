import type { NextConfig } from "next";

function parseAllowedDevOrigins(): string[] {
	const defaults = ["127.0.0.1", "localhost"];
	const raw = process.env.ASTROZEL_ALLOWED_DEV_ORIGINS?.trim();
	const fromEnv = raw
		? raw
				.split(",")
				.map((part) => part.trim())
				.filter(Boolean)
		: [];

	return [...new Set([...defaults, ...fromEnv])];
}

const securityHeaders = [
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
];

const nextConfig: NextConfig = {
	// Next.js 16 blocks cross-origin /_next/* in dev (e.g. 127.0.0.1 vs 0.0.0.0).
	// Always allow loopback; merge LAN hosts from ASTROZEL_ALLOWED_DEV_ORIGINS.
	allowedDevOrigins: parseAllowedDevOrigins(),
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
