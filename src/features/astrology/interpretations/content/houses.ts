export interface HouseContent {
	house: number;
	title: string;
	description: string;
	themes: string[];
	/** Gezegen-ev cümlesinde kullanılan yaşam alanı vurgusu. */
	lifeArea: string;
}

export const HOUSE_CONTENT: Record<number, HouseContent> = {
	1: {
		house: 1,
		title: "1. Ev",
		description: "Benlik, görünüm ve hayata ilk yaklaşım alanı.",
		themes: ["kimlik", "görünüm", "kişisel başlangıçlar"],
		lifeArea: "benlik ifadesi, görünüm ve hayata yaklaşım",
	},
	2: {
		house: 2,
		title: "2. Ev",
		description: "Değerler, kaynaklar ve sahip olunanlarla ilişki.",
		themes: ["değerler", "kaynaklar", "güvenlik"],
		lifeArea: "değerler, kaynaklar ve maddi-manevi güvenlik",
	},
	3: {
		house: 3,
		title: "3. Ev",
		description: "İletişim, öğrenme ve yakın çevre.",
		themes: ["iletişim", "öğrenme", "yakın çevre"],
		lifeArea: "iletişim, öğrenme ve yakın çevre ilişkileri",
	},
	4: {
		house: 4,
		title: "4. Ev",
		description: "Aile, kökler ve özel yaşam alanı.",
		themes: ["aile", "kökler", "özel alan"],
		lifeArea: "aile, kökler ve özel yaşam",
	},
	5: {
		house: 5,
		title: "5. Ev",
		description: "Yaratıcılık, keyif ve kendini ifade.",
		themes: ["yaratıcılık", "keyif", "ifade"],
		lifeArea: "yaratıcılık, keyif ve kendini ifade",
	},
	6: {
		house: 6,
		title: "6. Ev",
		description: "Günlük düzen, çalışma ve sorumluluk ritmi.",
		themes: ["günlük düzen", "çalışma", "sorumluluk"],
		lifeArea: "günlük düzen, çalışma ve pratik sorumluluklar",
	},
	7: {
		house: 7,
		title: "7. Ev",
		description: "İlişkiler ve ortaklıklar.",
		themes: ["ilişkiler", "ortaklık", "karşılıklılık"],
		lifeArea: "ilişkiler, ortaklıklar ve karşılıklı bağlar",
	},
	8: {
		house: 8,
		title: "8. Ev",
		description: "Paylaşım, dönüşüm ve mahremiyet.",
		themes: ["paylaşım", "dönüşüm", "mahremiyet"],
		lifeArea: "paylaşım, derin bağlar ve dönüşüm süreçleri",
	},
	9: {
		house: 9,
		title: "9. Ev",
		description: "İnançlar, uzaklar ve yüksek öğrenim.",
		themes: ["inanç", "ufuk", "öğrenme"],
		lifeArea: "inançlar, uzak bakış açıları ve yüksek öğrenim",
	},
	10: {
		house: 10,
		title: "10. Ev",
		description: "Kariyer, toplumsal yön ve hedefler.",
		themes: ["kariyer", "toplumsal yön", "hedefler"],
		lifeArea: "kariyer, toplumsal görünürlük ve uzun vadeli hedefler",
	},
	11: {
		house: 11,
		title: "11. Ev",
		description: "Arkadaşlar, gruplar ve gelecek planları.",
		themes: ["arkadaşlık", "gruplar", "gelecek"],
		lifeArea: "arkadaşlar, gruplar ve gelecek vizyonu",
	},
	12: {
		house: 12,
		title: "12. Ev",
		description: "İç dünya, geri çekilme ve bilinçdışı süreçler.",
		themes: ["iç dünya", "geri çekilme", "bilinçdışı"],
		lifeArea: "iç dünya, yalnızlaşma ve bilinçdışı süreçler",
	},
};

export const ALL_HOUSE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
