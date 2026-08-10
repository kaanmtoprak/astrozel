export type ArticleCallout = {
	type: "info" | "warning" | "tip";
	text: string;
};

export type ArticleSection = {
	id: string;
	title: string;
	paragraphs: string[];
	bullets?: string[];
	callout?: ArticleCallout;
	table?: {
		caption: string;
		headers: string[];
		rows: string[][];
	};
};

export type ArticleToolCta = {
	title: string;
	description: string;
	href: string;
	label: string;
};

export type ArticleDefinition = {
	slug: string;
	title: string;
	description: string;
	eyebrow?: string;
	cardTitle: string;
	cardDescription: string;
	publishedAt: string;
	updatedAt: string;
	readingTime: number;
	icon: "chart" | "ascendant" | "houses" | "synastry" | "moon" | "aspects";
	sections: ArticleSection[];
	relatedSlugs: string[];
	toolCta?: ArticleToolCta;
};
