import type { AspectType } from "@/features/astrology/types/astrology";

export interface AspectContent {
	type: AspectType;
	label: string;
	dynamic: string;
	potential: string;
	balance: string;
	/** Açı cümlesinde iki gezegen işlevini bağlayan fiil kalıbı. */
	bridgePhrase: string;
}

export const ASPECT_CONTENT: Record<AspectType, AspectContent> = {
	conjunction: {
		type: "conjunction",
		label: "Kavuşum",
		dynamic: "İki gezegenin işlevlerini yoğun biçimde bir araya getirir.",
		potential: "Ortak bir odak ve birleşik enerji yaratabilir.",
		balance: "Ayrım yapmak zorlaşabilir; iki ihtiyacı bilinçli ayırmak gerekebilir.",
		bridgePhrase: "işlevlerini yoğun biçimde bir araya getirebileceğini",
	},
	sextile: {
		type: "sextile",
		label: "Sekstil",
		dynamic: "İş birliği ve geliştirilebilir fırsat potansiyeli taşır.",
		potential: "Küçük adımlarla büyütülebilecek uyumlu bir alan açabilir.",
		balance: "Fırsatın fark edilip kullanılmasını gerektirir; otomatik çözülmez.",
		bridgePhrase: "birbirini destekleyebilecek fırsatlar taşıyabileceğini",
	},
	square: {
		type: "square",
		label: "Kare",
		dynamic:
			"İki işlev arasında hareket ve gelişim gerektiren gerilim oluşturabilir.",
		potential: "Büyüme için itici bir gerilim ve farkındalık yaratabilir.",
		balance: "Zaman zaman zorlanma veya sabırsızlık hissedilebilir.",
		bridgePhrase: "arasında hareket ve gelişim gerektiren bir gerilim oluşturabileceğini",
	},
	trine: {
		type: "trine",
		label: "Üçgen",
		dynamic: "İki işlevin doğal ve akıcı biçimde desteklenmesini gösterebilir.",
		potential: "Kolay akan bir destek ve doğal uyum sunabilir.",
		balance: "Rahatlık nedeniyle bilinçli çaba gecikebilir.",
		bridgePhrase: "birbirini doğal ve akıcı biçimde destekleyebileceğini",
	},
	opposition: {
		type: "opposition",
		label: "Karşıt",
		dynamic: "İki farklı ihtiyacı karşılıklı dengelemeyi gerektirebilir.",
		potential: "Farklı bakış açılarını bütünleştirmeyi öğretebilir.",
		balance: "Salınım veya aşırı uçlara kayma eğilimi görülebilir.",
		bridgePhrase: "arasında denge kurmayı gerektirebileceğini",
	},
};

export const ALL_ASPECT_TYPES = Object.keys(ASPECT_CONTENT) as AspectType[];
