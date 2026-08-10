import { Compass } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PrivacyOptionsButton } from "@/components/layout/privacy-options-button";
import { siteConfig } from "@/config/site";

const footerLinks = [
	{ href: "/rehber", label: "Astroloji Rehberi" },
	{ href: "/hakkinda", label: "Hakkında" },
	{ href: "/sss", label: "SSS" },
	{ href: "/cift-uyumu", label: "Çift Uyumu" },
	{ href: "/gizlilik", label: "Gizlilik" },
	{ href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
	{ href: "/cerez-politikasi", label: "Çerez Politikası" },
	{ href: "/iletisim", label: "İletişim" },
] as const;

const footerLinkClassName =
	"inline-flex min-h-11 cursor-pointer items-center rounded text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function Footer() {
	const year = new Date(siteConfig.sitemapLastModified).getUTCFullYear();

	return (
		<footer className="relative overflow-hidden border-t border-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_88%,var(--sky-blue)),var(--card))]">
			<div
				className="pointer-events-none absolute -right-8 top-4 h-28 w-28 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--lavender)_40%,transparent),transparent_70%)]"
				aria-hidden="true"
			/>
			<Container className="relative flex flex-col gap-8 py-12">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div className="max-w-md space-y-3">
						<div className="inline-flex items-center gap-2 text-foreground">
							<span
								className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary"
								aria-hidden="true"
							>
								<Compass className="h-5 w-5" strokeWidth={1.75} />
							</span>
							<span className="font-serif text-xl tracking-tight">
								{siteConfig.name}
							</span>
						</div>
						<p className="text-sm leading-relaxed text-foreground/70">
							{siteConfig.defaultDescription}
						</p>
					</div>

					<nav aria-label="Footer bağlantıları">
						<ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
							{footerLinks.map((link) => (
								<li key={link.href}>
									<a href={link.href} className={footerLinkClassName}>
										{link.label}
									</a>
								</li>
							))}
							<li>
								<PrivacyOptionsButton className={footerLinkClassName} />
							</li>
						</ul>
					</nav>
				</div>

				<p className="border-t border-border/70 pt-6 text-sm text-foreground/55">
					© {year} {siteConfig.name}
				</p>
				<p className="text-xs text-foreground/50">
					Konum verileri{" "}
					<a
						href="https://www.geonames.org/"
						target="_blank"
						rel="noreferrer"
						className="rounded underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						GeoNames
					</a>{" "}
					tarafından sağlanmaktadır.
				</p>
			</Container>
		</footer>
	);
}
