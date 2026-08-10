import type { PlanetKey } from "@/features/astrology/types/astrology";

export interface PlanetContent {
	key: PlanetKey;
	label: string;
	role: string;
	/** Gezegen-burç cümlesinde kullanılan işlev vurgusu. */
	functionFocus: string;
	/** Cümle kalıbı varyantı: her gezegen farklı yapı kullanır. */
	signTemplate:
		| "identity"
		| "emotion"
		| "mind"
		| "relation"
		| "drive"
		| "growth"
		| "structure"
		| "freedom"
		| "vision"
		| "depth";
	retrogradeNote: string;
	/** Büyük üçlüde uzun metin varken liste için kısa yerleşim girişi. */
	compactPlacementLead: string;
}

export const PLANET_CONTENT: Record<PlanetKey, PlanetContent> = {
	sun: {
		key: "sun",
		label: "Güneş",
		role: "kimlik, irade ve kendini ortaya koyma",
		functionFocus: "kendini tanımlama ve görünür olma biçimin",
		signTemplate: "identity",
		retrogradeNote: "",
		compactPlacementLead: "Kimlik ifaden",
	},
	moon: {
		key: "moon",
		label: "Ay",
		role: "duygusal ihtiyaçlar, iç güvenlik ve alışkanlıklar",
		functionFocus: "duygusal ihtiyaçların ve iç ritmin",
		signTemplate: "emotion",
		retrogradeNote: "",
		compactPlacementLead: "Duygusal ihtiyaçların",
	},
	mercury: {
		key: "mercury",
		label: "Merkür",
		role: "düşünme, öğrenme ve iletişim",
		functionFocus: "düşünme ve ifade tarzın",
		signTemplate: "mind",
		retrogradeNote:
			"Merkür’ün retro dönemi, düşüncelerini daha içe dönük gözden geçirme, eski konulara dönme veya iletişimi yavaşlatarak netleştirme eğilimini vurgulayabilir.",
		compactPlacementLead: "Düşünme biçimin",
	},
	venus: {
		key: "venus",
		label: "Venüs",
		role: "ilişkiler, değerler ve zevkler",
		functionFocus: "bağ kurma ve değer verme biçimin",
		signTemplate: "relation",
		retrogradeNote:
			"Venüs’ün retro hareketi, ilişkilerde ve değerlerde yeniden değerlendirme, geçmiş bağları gözden geçirme veya zevklerini daha kişisel bir süzgeçten geçirme eğilimini işaret edebilir.",
		compactPlacementLead: "İlişki ve değer anlayışın",
	},
	mars: {
		key: "mars",
		label: "Mars",
		role: "hareket, mücadele ve istek",
		functionFocus: "harekete geçme ve isteklerini savunma biçimin",
		signTemplate: "drive",
		retrogradeNote:
			"Mars’ın retro dönemi, öfkeyi veya isteği dışa vurmak yerine içsel motivasyonu yeniden düzenleme, yönünü gözden geçirme eğilimini güçlendirebilir.",
		compactPlacementLead: "Harekete geçme tarzın",
	},
	jupiter: {
		key: "jupiter",
		label: "Jüpiter",
		role: "gelişim, anlam ve genişleme",
		functionFocus: "büyüme ve anlam arayışın",
		signTemplate: "growth",
		retrogradeNote:
			"Jüpiter’in retro hareketi, büyüme ve inanç konularını daha içsel bir sorgulamayla, dışarıdan görünür genişlemeden önce kişisel anlam üzerinden deneyimleme eğilimini vurgulayabilir.",
		compactPlacementLead: "Gelişim arayışın",
	},
	saturn: {
		key: "saturn",
		label: "Satürn",
		role: "sorumluluk, sınırlar ve yapı",
		functionFocus: "sorumluluk alma ve yapı kurma biçimin",
		signTemplate: "structure",
		retrogradeNote:
			"Satürn’ün retro dönemi, sınırlar ve sorumlulukları dış baskıdan çok içsel standartlar üzerinden yeniden tanımlama ihtiyacını öne çıkarabilir.",
		compactPlacementLead: "Sorumluluk anlayışın",
	},
	uranus: {
		key: "uranus",
		label: "Uranüs",
		role: "özgürlük, değişim ve özgünlük",
		functionFocus: "özgünleşme ve değişim ihtiyacın",
		signTemplate: "freedom",
		retrogradeNote:
			"Uranüs’ün retro hareketi, özgürlük ve yenilik arayışını daha kişisel, içsel bir uyanış veya alışkanlıkları sessizce sorgulama üzerinden yaşatma eğilimini gösterebilir.",
		compactPlacementLead: "Özgünleşme ihtiyacın",
	},
	neptune: {
		key: "neptune",
		label: "Neptün",
		role: "hayal gücü, sezgi ve ideal",
		functionFocus: "hayal, sezgi ve ideal arayışın",
		signTemplate: "vision",
		retrogradeNote:
			"Neptün’ün retro dönemi, hayaller ve idealleri dış dünyada aramaktan çok içsel netleşme, sezgiyi süzme ve sınırları yumuşakça fark etme sürecini vurgulayabilir.",
		compactPlacementLead: "Sezgi ve ideal arayışın",
	},
	pluto: {
		key: "pluto",
		label: "Plüton",
		role: "dönüşüm, güç ve derinlik",
		functionFocus: "dönüşüm ve derinlik ihtiyacın",
		signTemplate: "depth",
		retrogradeNote:
			"Plüton’un retro hareketi, güç ve dönüşüm temalarını daha içe dönük bir süreçte, eski kalıpları sessizce çözerek deneyimleme eğilimini işaret edebilir.",
		compactPlacementLead: "Dönüşüm sürecin",
	},
};

export const ALL_PLANET_KEYS = Object.keys(PLANET_CONTENT) as PlanetKey[];
