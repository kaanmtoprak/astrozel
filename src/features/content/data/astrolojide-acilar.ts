import type { ArticleDefinition } from "@/features/content/types/article";

export const astrolojideAcilarArticle: ArticleDefinition = {
	slug: "astrolojide-acilar",
	title: "Astrolojide Açılar Nedir? Kavuşum, Kare, Üçgen ve Karşıtlık",
	description:
		"Gezegenler arasındaki kavuşum, sekstil, kare, üçgen ve karşıtlık açılarını ve orb kavramını anlaşılır biçimde öğrenin.",
	eyebrow: "Temel rehber",
	cardTitle: "Astrolojide açılar",
	cardDescription:
		"Kavuşum, kare, üçgen, karşıtlık ve orb kavramını tabloyla öğrenin.",
	publishedAt: "2026-08-04",
	updatedAt: "2026-08-04",
	readingTime: 8,
	icon: "aspects",
	relatedSlugs: [
		"dogum-haritasi-nedir",
		"sinastri-nedir",
		"ay-burcu-nedir",
		"astrolojide-evler",
	],
	toolCta: {
		title: "Haritandaki açıları gör",
		description:
			"Doğum haritanızdaki temel gezegen açılarını hesaplayıp sembolik bağlantıları inceleyin.",
		href: "/dogum-haritasi",
		label: "Haritandaki Açıları Gör",
	},
	sections: [
		{
			id: "nedir",
			title: "Açı nedir?",
			paragraphs: [
				"Astrolojide açı, iki gezegen (veya nokta) arasındaki gökyüzü mesafesinin belirli bir geometrik ilişkiye yaklaşmasıdır. Bu ilişki, iki temanın nasıl etkileştiğini yorumlamak için kullanılır.",
				"[Doğum haritasında](/rehber/dogum-haritasi-nedir) açılar, gezegenleri birbirine bağlayan “konuşma hatları” gibidir. Tek başına burç veya ev okumak bu konuşmayı eksik bırakır.",
			],
		},
		{
			id: "mesafe",
			title: "Gezegenler arası açısal mesafe",
			paragraphs: [
				"Haritada gezegenler 360 derecelik bir daire üzerinde durur. İki gezegen arasındaki en kısa yay mesafesi hesaplanır ve bilinen açı kalıplarına (0°, 60°, 90°, 120°, 180° gibi) yakınlığına bakılır.",
				"Tam sayıdan küçük sapmalara orb denir. Orb kabul aralığı okullara ve açı türüne göre değişebilir.",
			],
		},
		{
			id: "major-acilar",
			title: "Başlıca açılar",
			paragraphs: [
				"Aşağıdaki tablo Astrozel’in de kullandığı major açıları ve genel karakterlerini özetler. “Genel karakter” kesin sonuç değil, yorum anahtarıdır.",
			],
			table: {
				caption: "Major açılar ve yaklaşık dereceleri",
				headers: ["Açı", "Derece", "Genel karakter"],
				rows: [
					["Kavuşum", "0°", "Yoğun birleşme, tema kaynaşması"],
					["Sekstil", "60°", "Fırsat, yumuşak destek, işbirliği potansiyeli"],
					["Kare", "90°", "Sürtünme, motivasyon, gerilimli gelişim"],
					["Üçgen", "120°", "Akış, doğal destek, kolay ifade"],
					["Karşıtlık", "180°", "Kutupluluk, denge arayışı, yüzleşme"],
				],
			},
		},
		{
			id: "kavusum",
			title: "Kavuşum",
			paragraphs: [
				"Kavuşumda iki gezegen aynı bölgede birleşir. Temalar iç içe geçer; bu bazen güçlü odak, bazen de sınırların bulanıklaşması gibi okunur.",
				"Kavuşumun niteliği gezegen çiftine bağlıdır. Güneş–Merkür kavuşumu ile Mars–Satürn kavuşumu aynı “his”i vermez.",
			],
		},
		{
			id: "sekstil",
			title: "Sekstil",
			paragraphs: [
				"Sekstil, fırsat ve işbirliği potansiyeliyle ilişkilendirilir. Çoğu zaman “kolayca akan ama biraz çaba isteyen destek” gibi yorumlanır.",
				"Sekstiller haritada sessiz kalabilir; bilinçli kullanılırsa üretken köprüler kurabilir.",
			],
		},
		{
			id: "kare",
			title: "Kare",
			paragraphs: [
				"Kare, sürtünme ve içsel/ dışsal gerilim temasıyla okunur. Rahatsız edici olabilir; fakat harekete geçirici de olabilir.",
				"Kareyi “kötü açı” diye damgalamak yerine, hangi iki ihtiyacın çatıştığını sormak daha faydalıdır.",
			],
		},
		{
			id: "ucgen",
			title: "Üçgen",
			paragraphs: [
				"Üçgen, doğal akış ve destekle ilişkilendirilir. Yeteneklerin kolay ifade bulduğu alanlar olarak görülebilir.",
				"Çok fazla üçgen bazen rehavet de üretebilir. Kolaylık, gelişimin garantisi değildir; fırsatın fark edilmesi gerekir.",
			],
		},
		{
			id: "karsitlik",
			title: "Karşıtlık",
			paragraphs: [
				"Karşıtlık, iki kutup arasında denge arayışını anlatır. İlişkilerde “öteki üzerinden görülme”, iç dünyada ise gel-git olarak hissedilebilir.",
				"Karşıtlık farkındalık ve bütünleşme potansiyeli taşır; sürekli savrulma da üretebilir. Bilinçli denge arayışı anahtardır.",
			],
		},
		{
			id: "orb",
			title: "Orb nedir?",
			paragraphs: [
				"Orb, ideal açı derecesinden sapmaya verilen izindir. Örneğin 90° kare için 5° orb, 85°–95° aralığını kare saymak anlamına gelebilir.",
				"Farklı sistemler farklı orb kullanır. Bu da siteler arasında açı listelerinin değişmesine yol açabilir.",
			],
			callout: {
				type: "tip",
				text: "Küçük orb genellikle daha “sıkı” ve belirgin bir bağlantı gibi okunur. Geniş orb daha gevşek bir etki alanı sunabilir.",
			},
		},
		{
			id: "kucuk-orb",
			title: "Küçük orb ne anlama gelir?",
			paragraphs: [
				"Tam açıya çok yakın bağlantılar, yorumda sıkça önceliklendirilir. Haritada çok açı varsa önce dar orblu olanlara bakmak dağınıklığı azaltır.",
				"Yine de tek bir dar açı tüm kişiliği açıklamaz. Tekrar eden desenler daha önemlidir.",
			],
		},
		{
			id: "uyumlu-zor",
			title: "Uyumlu / zorlayıcı ayrımı",
			paragraphs: [
				"Sekstil ve üçgen çoğu zaman uyumlu; kare ve karşıtlık zorlayıcı diye gruplanır. Kavuşum ise gezegenlere göre her iki yöne de kayabilir.",
				"Bu ayrım pratiktir ama ahlakî bir iyi/kötü yargısı değildir. Zorlayıcı açılar gelişim, uyumlu açılar ise destek ve kör nokta da taşıyabilir.",
			],
		},
		{
			id: "zor-iyi",
			title: "Kare ve karşıtlık neden her zaman kötü değildir?",
			paragraphs: [
				"Gerilim fark ettirir, motive eder, sınır çizer. Birçok üretken hikâye sürtünmeyle şekillenir.",
				"Asıl risk, gerilimi yok saymak veya yalnızca dışarıya yıkmaktır. Harita gerilimi gösterir; onu nasıl taşıyacağınız size kalır.",
			],
		},
		{
			id: "kavusum-degisir",
			title: "Kavuşum neden gezegen çiftine göre değişir?",
			paragraphs: [
				"Her gezegen farklı bir işlev taşır. Ay–Venüs kavuşumu duygusal yumuşaklık ve beğeni dilini; Mars–Plüton kavuşumu ise yoğun irade ve güç temalarını öne çıkarabilir.",
				"Bu yüzden yalnızca “kavuşum var” demek yetmez; hangi iki temanın birleştiğini söylemek gerekir.",
			],
		},
		{
			id: "onemli-acilar",
			title: "Doğum haritasında en önemli açılar nasıl seçilir?",
			paragraphs: [
				"Pratik bir yol: Güneş, Ay, yükselen yöneticisi ve kişisel gezegenleri içeren; orb’u dar olan major açıları önceleyin. Sonra tekrar eden motiflere bakın.",
				"Her açıyı eşit ağırlıkta anlatmaya çalışmak metni şişirir. Az ama net bağlantılar çoğu zaman daha öğreticidir.",
			],
		},
		{
			id: "sinastri",
			title: "Sinastride açılar nasıl çalışır?",
			paragraphs: [
				"[Sinastride](/rehber/sinastri-nedir) açılar iki kişi arasında kurulur: birinin Venüs’ü diğerinin Mars’ına kare yapabilir. Yorum mantığı benzerdir; bağlam ise ilişkidir.",
				"İlişki açıları da kesin gelecek vermez. Dinamikleri görünür kılar; seçimleri ve iletişimi ortadan kaldırmaz.",
			],
		},
	],
};
