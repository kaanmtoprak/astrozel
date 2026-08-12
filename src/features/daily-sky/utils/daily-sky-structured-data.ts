import { siteConfig } from "@/config/site";

export function buildDailySkyWebPageJsonLd() {
	const url = `${siteConfig.url}/bugunun-gokyuzu`;

	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Bugünün Gökyüzü | Gezegen Konumları ve Ay Fazı",
		description:
			"Bugünün gezegen konumlarını, Ay burcunu, Ay fazını, retro gezegenleri ve önemli astrolojik açıları keşfedin.",
		url,
		inLanguage: "tr-TR",
		isPartOf: {
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.url,
		},
	};
}

export function buildDailySkyBreadcrumbJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Ana Sayfa",
				item: siteConfig.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Bugünün Gökyüzü",
				item: `${siteConfig.url}/bugunun-gokyuzu`,
			},
		],
	};
}
