export const siteConfig = {
	name: "Astrozel",
	url: "https://astrozel.com",
	locale: "tr_TR",
	language: "tr",
	defaultTitle: "Astrozel | Doğum Haritası ve Yükselen Hesaplama",
	defaultDescription:
		"Doğum tarihi, saati ve yerine göre yükselen burcunu, evlerini, gezegen konumlarını ve doğum haritanı hesapla.",
	/** Set when a verified public contact address exists. */
	contactEmail: null as string | null,
	/** Stable content revision date for legal pages (not regenerated per request). */
	legalUpdatedAt: "2026-08-06",
	legalUpdatedAtLabel: "6 Ağustos 2026",
	/** Stable sitemap lastModified (ISO date-only). */
	sitemapLastModified: "2026-08-06",
} as const;

export type SiteConfig = typeof siteConfig;
