import type { Metadata, Viewport } from "next";
import { Literata, Source_Sans_3 } from "next/font/google";
import { MobileDebugRoot } from "@/components/debug/mobile-debug-root";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import "./globals.css";

const displayFont = Literata({
	variable: "--font-display",
	subsets: ["latin", "latin-ext"],
	display: "swap",
	fallback: ["Georgia", "Times New Roman", "serif"],
});

const bodyFont = Source_Sans_3({
	variable: "--font-body",
	subsets: ["latin", "latin-ext"],
	display: "swap",
	fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const viewport: Viewport = {
	themeColor: "#5B6FBF",
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.defaultTitle,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.defaultDescription,
	applicationName: siteConfig.name,
	creator: siteConfig.name,
	publisher: siteConfig.name,
	manifest: "/site.webmanifest",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		shortcut: [{ url: "/favicon.ico" }],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: siteConfig.defaultTitle,
		description: siteConfig.defaultDescription,
	},
	twitter: {
		card: "summary",
		title: siteConfig.defaultTitle,
		description: siteConfig.defaultDescription,
	},
	robots: {
		index: true,
		follow: true,
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={siteConfig.language} data-scroll-behavior="smooth">
			<head>
				{/* AdSense site verification — must appear in server HTML source */}
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7944421586479531"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`${displayFont.variable} ${bodyFont.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
				>
					İçeriğe geç
				</a>
				<Header />
				{children}
				<Footer />
				<MobileDebugRoot />
			</body>
		</html>
	);
}
