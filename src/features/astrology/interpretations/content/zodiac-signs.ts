import type { ZodiacSign } from "@/features/astrology/types/astrology";
import type {
	InterpretationElement,
	InterpretationModality,
} from "@/features/astrology/interpretations/types/interpretation";

export interface ZodiacSignContent {
	sign: ZodiacSign;
	approach: string;
	strength: string;
	challenge: string;
	element: InterpretationElement;
	modality: InterpretationModality;
}

export const ZODIAC_SIGN_CONTENT: Record<ZodiacSign, ZodiacSignContent> = {
	aries: {
		sign: "aries",
		approach: "doğrudan harekete geçerek ve yeni başlangıçlara cesaretle yaklaşarak",
		strength: "inisiyatif alma ve hızlı karar verme",
		challenge: "acelecilik ve sabırsızlık",
		element: "fire",
		modality: "cardinal",
	},
	taurus: {
		sign: "taurus",
		approach: "güvenilir ve sürdürülebilir bir temel kurarak",
		strength: "sabır ve istikrar",
		challenge: "alışılan düzeni bırakmakta zorlanma",
		element: "earth",
		modality: "fixed",
	},
	gemini: {
		sign: "gemini",
		approach: "merakla öğrenerek ve fikirleri paylaşarak",
		strength: "esnek iletişim ve hızlı kavrama",
		challenge: "dikkat dağınıklığı ve yarım bırakma",
		element: "air",
		modality: "mutable",
	},
	cancer: {
		sign: "cancer",
		approach: "koruyucu bir duyarlılık ve yakın bağlar üzerinden",
		strength: "empati ve duygusal bağ kurma",
		challenge: "aşırı içe kapanma veya korunmacılık",
		element: "water",
		modality: "cardinal",
	},
	leo: {
		sign: "leo",
		approach: "kendini ifade ederek ve görünür bir güvenle",
		strength: "yaratıcı cömertlik ve liderlik ısısı",
		challenge: "onay ihtiyacının öne çıkması",
		element: "fire",
		modality: "fixed",
	},
	virgo: {
		sign: "virgo",
		approach: "ayrıntıları inceleyerek ve pratik sonuç arayarak",
		strength: "analiz, düzen ve hizmet bilinci",
		challenge: "aşırı eleştirellik veya mükemmeliyetçilik",
		element: "earth",
		modality: "mutable",
	},
	libra: {
		sign: "libra",
		approach: "denge, uyum ve adil ilişki arayışıyla",
		strength: "diplomasi ve estetik duyarlılık",
		challenge: "kararsızlık veya başkalarını fazla kollama",
		element: "air",
		modality: "cardinal",
	},
	scorpio: {
		sign: "scorpio",
		approach: "derinlemesine bakarak ve dönüşümü kabullenerek",
		strength: "yoğun odak ve duygusal cesaret",
		challenge: "kontrol ihtiyacı veya güvensizlik",
		element: "water",
		modality: "fixed",
	},
	sagittarius: {
		sign: "sagittarius",
		approach: "anlam arayışı ve geniş bir bakış açısıyla",
		strength: "umut, keşif ve dürüst ifade",
		challenge: "aşırı genelleme veya sabırsız kaçış",
		element: "fire",
		modality: "mutable",
	},
	capricorn: {
		sign: "capricorn",
		approach: "sorumluluk alarak ve uzun vadeli yapı kurarak",
		strength: "disiplin ve gerçekçi hedef koyma",
		challenge: "aşırı ciddiyet veya kendini fazla kısıtlama",
		element: "earth",
		modality: "cardinal",
	},
	aquarius: {
		sign: "aquarius",
		approach: "özgün düşünce ve toplumsal bakışla",
		strength: "yenilikçilik ve bağımsız perspektif",
		challenge: "mesafe koyma veya aşırı soyutlaşma",
		element: "air",
		modality: "fixed",
	},
	pisces: {
		sign: "pisces",
		approach: "sezgi, hayal gücü ve duygusal akışla",
		strength: "şefkat ve yaratıcı duyarlılık",
		challenge: "sınır belirsizliği veya kaçınma",
		element: "water",
		modality: "mutable",
	},
};

export const ALL_ZODIAC_SIGNS = Object.keys(ZODIAC_SIGN_CONTENT) as ZodiacSign[];
