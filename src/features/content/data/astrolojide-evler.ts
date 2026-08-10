import type { ArticleDefinition } from "@/features/content/types/article";

export const astrolojideEvlerArticle: ArticleDefinition = {
	slug: "astrolojide-evler",
	title: "Astrolojide 12 Ev Ne Anlama Gelir?",
	description:
		"Doğum haritasındaki 12 evin yaşamın hangi alanlarını temsil ettiğini ve gezegen yerleşimleriyle birlikte nasıl yorumlandığını keşfedin.",
	eyebrow: "Temel rehber",
	cardTitle: "Astrolojide evler",
	cardDescription:
		"On iki evin yaşam alanlarını ve Placidus sistemini sade bir dille inceleyin.",
	publishedAt: "2026-08-04",
	updatedAt: "2026-08-04",
	readingTime: 9,
	icon: "houses",
	relatedSlugs: [
		"dogum-haritasi-nedir",
		"yukselen-burc-nedir",
		"astrolojide-acilar",
		"sinastri-nedir",
	],
	toolCta: {
		title: "Haritandaki evleri gör",
		description:
			"Doğum bilgilerinle Placidus ev cusp’larını ve gezegenlerin hangi evlerde durduğunu hesapla.",
		href: "/dogum-haritasi",
		label: "Haritandaki Evleri Gör",
	},
	sections: [
		{
			id: "nedir",
			title: "Astrolojik ev nedir?",
			paragraphs: [
				"Evler, [doğum haritasını](/rehber/dogum-haritasi-nedir) yaşam alanlarına bölen on iki sektördür. Burçlar “nasıl / hangi üslupla” sorusuna, evler ise “hayatın hangi alanında” sorusuna daha yakındır.",
				"Bir gezegen hem bir burçta hem bir evde durur. Bu iki bilgi birlikte okunduğunda sembolik tablo zenginleşir: burç tonu + yaşam alanı.",
			],
		},
		{
			id: "burc-farki",
			title: "Ev ile burç arasındaki fark",
			paragraphs: [
				"Burçlar tropikal zodyağın sabit dilimleridir; herkes için aynı sırayla akar. Evler ise doğum anı ve konumuna göre kişiselleşir; yükselen noktası ev düzeninin omurgasını kurar.",
				"Bu yüzden aynı Güneş burcuna sahip iki kişinin ev yerleşimleri çok farklı olabilir. Saat ve yer, evleri Güneş burcundan daha fazla etkiler.",
			],
		},
		{
			id: "cusp",
			title: "Ev başlangıcı (cusp) nedir?",
			paragraphs: [
				"Cusp, bir evin başladığı derecedir. Haritada “2. ev cusp’ı Koç 10°” deniyorsa, o andan itibaren ikinci ev alanının sembolik kapısı bu noktadır.",
				"Ev sistemine göre cusp’lar farklı hesaplanır. Bu da aynı doğum verisiyle farklı sitelerde ev numaralarının kaymasına yol açabilir.",
			],
		},
		{
			id: "on-iki-ev",
			title: "1’den 12’ye evlerin kısa anlamları",
			paragraphs: [
				"Aşağıdaki tablo yaygın modern yorumlarda kullanılan kısa eşleşmeleri özetler. Bunlar sabit yasalar değil, okumaya yardımcı anahtar kelimelerdir.",
			],
			table: {
				caption: "On iki evin kısa yaşam alanı özeti",
				headers: ["Ev", "Sembolik alan"],
				rows: [
					["1. Ev", "Benlik, görünüm, başlangıçlar, kişisel üslup"],
					["2. Ev", "Değerler, kaynaklar, gelir, öz-değer"],
					["3. Ev", "İletişim, öğrenme, yakın çevre, günlük hareket"],
					["4. Ev", "Kökler, aile, ev, iç güvenlik"],
					["5. Ev", "Yaratıcılık, keyif, romantik oyun, ifade"],
					["6. Ev", "Günlük düzen, iş alışkanlıkları, hizmet, bakım"],
					["7. Ev", "İkili ilişkiler, ortaklıklar, yüzleşme"],
					["8. Ev", "Paylaşılan kaynaklar, derin bağ, dönüşüm"],
					["9. Ev", "Anlam arayışı, inanç, uzak ufuklar, yüksek öğrenim"],
					["10. Ev", "Toplumsal rol, kariyer imgesi, sorumluluk"],
					["11. Ev", "Topluluklar, dostluklar, ortak hedefler"],
					["12. Ev", "İçe dönüş, görünmeyen süreçler, bırakma"],
				],
			},
		},
		{
			id: "kose-evler",
			title: "Köşe, ardıl ve düşen evler",
			paragraphs: [
				"Köşe evler (1, 4, 7, 10) sıkça “daha görünür / daha yönlendirici” alanlar olarak anılır. Ardıl evler (2, 5, 8, 11) kaynak geliştirme ve sürdürmeyle; düşen evler (3, 6, 9, 12) dağıtma, uyarlama ve arka plan süreçleriyle ilişkilendirilir.",
				"Bu sınıflandırma yardımcı bir haritadır; boş bir köşe ev “hayatınızda o alan yok” anlamına gelmez.",
			],
		},
		{
			id: "bos-ev",
			title: "Boş ev ne demektir?",
			paragraphs: [
				"Bir evde gezegen olmaması, o alanın önemsiz olduğu anlamına gelmez. Ev yöneticisi gezegenin durumu, cusp burcu ve açıları o alanı yine konuşturabilir.",
				"Boş evler bazen “doğrudan gezegen vurgusu az” diye okunur; bu da yorumu sadeleştirir, yok saymayı gerektirmez.",
			],
			callout: {
				type: "tip",
				text: "Boş bir evi yorumlarken önce ev yöneticisine bakmak pratik bir yöntemdir: yönetici nerede, hangi açılarla bağlı?",
			},
		},
		{
			id: "yonetici",
			title: "Ev yöneticisi nasıl okunur?",
			paragraphs: [
				"Her ev cusp’ının burcunun yöneticisi, o evin “temsilci gezegeni” gibi düşünülür. Örneğin 7. ev cusp’ı Akrep ise, geleneksel okumada Mars (veya modernde Plüton vurgusu) ilişki alanına dair ek ipucu taşır.",
				"Yönetici gezegenin burcu ve evi, “bu yaşam alanı enerjisini nereden topluyor?” sorusuna cevap arar. Tek cümlelik kesin yargılar yerine bağlantıları izlemek daha sağlıklıdır.",
			],
		},
		{
			id: "gezegen-evde",
			title: "Gezegen bir eve düştüğünde ne olur?",
			paragraphs: [
				"Gezegen, kendi temasını o evin alanına taşır. Örneğin Ay 4. evdeyse duygusal güvenlik ve kökler teması öne çıkabilir; Merkür 10. evdeyse iletişim toplumsal rolle kesişebilir.",
				"Yorumu dengede tutmak için gezegenin burcunu, açılarını ve tüm haritadaki tekrar eden motifleri birlikte okumak gerekir.",
			],
		},
		{
			id: "farkli-sistemler",
			title: "Farklı ev sistemleri neden farklı sonuç verir?",
			paragraphs: [
				"Whole Sign, Equal, Placidus, Koch gibi sistemler ev sınırlarını farklı matematiğe dayandırır. Özellikle yüksek enlemlerde bazı sistemler daha dramatik farklar üretebilir.",
				"Bu yüzden “evler yanlış” demeden önce hangi sistemin kullanıldığını kontrol etmek gerekir.",
			],
		},
		{
			id: "placidus",
			title: "Placidus sistemi nedir?",
			paragraphs: [
				"Placidus, zaman ve coğrafyaya dayalı, yaygın kullanılan bir ev sistemidir. Astrozel doğum haritası hesaplarında Placidus kullanır.",
				"Placidus’ta [yükselen](/rehber/yukselen-burc-nedir) birinci ev başlangıcıdır; MC (Medium Coeli) ise onuncu evle ilişkilendirilen gökyüzü noktalarından biridir. Ev genişlikleri eşit olmak zorunda değildir.",
			],
		},
		{
			id: "tek-basina",
			title: "Evleri tek başına yorumlamak neden yeterli değildir?",
			paragraphs: [
				"Evler bağlam sağlar; fakat burçlar, gezegenler ve [açılar](/rehber/astrolojide-acilar) olmadan yarım kalır. Aynı şekilde yalnızca ev listesi ezberlemek, yaşayan bir yorum üretmez.",
				"Pratik yol: önce büyük üçlü ve kişisel gezegenler, sonra bunların evleri, sonra tekrar eden açı desenleri. Böylece hem alan hem üslup hem ilişki dinamiği görünür.",
			],
		},
	],
};
