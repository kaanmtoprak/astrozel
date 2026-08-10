"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/rehber", label: "Rehber" },
	{ href: "/hakkinda", label: "Hakkında" },
	{ href: "/sss", label: "SSS" },
	{ href: "/cift-uyumu", label: "Çift Uyumu" },
] as const;

const mobileNavItems = [
	{ href: "/dogum-haritasi", label: "Harita Oluştur" },
	{ href: "/cift-uyumu", label: "Çift Uyumu" },
	{ href: "/rehber", label: "Rehber" },
	{ href: "/hakkinda", label: "Hakkında" },
	{ href: "/sss", label: "SSS" },
] as const;

export function Header() {
	const [open, setOpen] = useState(false);
	const menuId = useId();

	return (
		<>
			<header
				className="sticky top-0 isolate border-b border-border/50 bg-background/95"
				style={{ zIndex: "var(--astrozel-z-header)" }}
			>
				<div
					className="pointer-events-none absolute inset-0 -z-10 bg-background/90"
					aria-hidden="true"
				/>
				<Container className="relative flex h-16 min-w-0 items-center justify-between gap-4">
					<Link
						href="/"
						className="relative z-10 inline-flex min-w-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						<Image
							src="/brand/astrozel-logo.png"
							alt="Astrozel"
							width={696}
							height={193}
							priority
							className="h-8 w-auto object-contain sm:h-9"
						/>
					</Link>

					<nav
						className="relative z-10 hidden items-center gap-1 md:flex"
						aria-label="Ana menü"
					>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<Link
						href="/dogum-haritasi"
						className={cn(
							buttonClassName({ size: "sm" }),
							"relative z-10 hidden md:inline-flex",
						)}
					>
						Harita Oluştur
					</Link>

					<button
						type="button"
						data-mobile-target="hamburger"
						className="relative z-20 inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-border bg-card text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						aria-expanded={open}
						aria-controls={menuId}
						aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
						onClick={() => setOpen(true)}
					>
						{open ? (
							<X className="pointer-events-none h-5 w-5" aria-hidden="true" />
						) : (
							<Menu
								className="pointer-events-none h-5 w-5"
								aria-hidden="true"
							/>
						)}
					</button>
				</Container>
			</header>

			<div className="md:hidden">
				<MobileSheet
					open={open}
					onOpenChange={setOpen}
					title="Menü"
					description="Astrozel sayfalarına git."
					variant="top"
					testId="nav-sheet"
					showCloseButton
				>
					<nav
						id={menuId}
						aria-label="Mobil menü"
						className="flex min-w-0 flex-col gap-1"
					>
						{mobileNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="min-h-12 rounded-lg px-3 py-3 text-base text-foreground/90 touch-manipulation hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								onClick={() => setOpen(false)}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</MobileSheet>
			</div>
		</>
	);
}
