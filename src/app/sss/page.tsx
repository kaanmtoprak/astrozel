import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";

export const metadata: Metadata = {
	title: "Sıkça Sorulan Sorular",
	description:
		"Doğum haritası, yükselen, doğum saati, ev sistemi ve gizlilik hakkında kısa yanıtlar.",
	alternates: { canonical: "/sss" },
};

const faqs = [
	{
		q: "Doğum haritası nedir?",
		a: "Doğum anındaki gökyüzü konumlarının haritasıdır. Güneş, Ay, yükselen ve diğer gezegenlerin burç ve ev konumlarını gösterir.",
	},
	{
		q: "Yükselen burç neden doğum saatine bağlıdır?",
		a: "Yükselen, doğum anında doğu ufkunda yükselen burçtur. Saat değiştikçe ufuk hızla kaydığı için yükselen de değişir.",
	},
	{
		q: "Neden doğum yeri seçmeliyim?",
		a: "Konum; enlem, boylam ve saat dilimini belirler. Evler ve yükselen bu bilgilere bağlıdır.",
	},
	{
		q: "Doğum saatimi bilmiyorsam ne olur?",
		a: "Saat olmadan yükselen ve evler güvenilir hesaplanamaz. Güneş burcu gibi daha az saate bağlı bilgiler kısmen yorumlanabilir; tam harita için saat gerekir.",
	},
	{
		q: "Hangi ev sistemi kullanılıyor?",
		a: "Placidus ev sistemi kullanılır.",
	},
	{
		q: "Tropikal zodyak nedir?",
		a: "Mevsimsel noktalara (ekinoks/gündönümü) dayalı zodyak sistemidir. Astrozel tropikal zodyak kullanır.",
	},
	{
		q: "Bilgilerim kaydediliyor mu?",
		a: "Şu anda veritabanına kayıt yoktur. Form taslağı yalnızca tarayıcı sekmesinin sessionStorage alanında tutulur.",
	},
	{
		q: "Sonuçlar başka sitelerden neden farklı olabilir?",
		a: "Farklı ev sistemleri, zodyak tercihleri, saat dilimi veya yuvarlama kuralları sonuçları değiştirebilir.",
	},
	{
		q: "Astrolojik yorumlar kesin midir?",
		a: "Hayır. Yorumlar sembolik ve geneldir; kişiselleştirilmiş danışmanlık veya kesin öngörü değildir.",
	},
	{
		q: "Site ücretsiz mi?",
		a: "Şu anki doğum haritası hesaplama deneyimi ücretsiz sunulmaktadır. Özellikler zamanla değişebilir.",
	},
] as const;

export default function FaqPage() {
	return (
		<ContentPage
			title="Sıkça Sorulan Sorular"
			description="Doğum haritası ve Astrozel kullanımı hakkında kısa yanıtlar."
		>
			<div className="space-y-3">
				{faqs.map((item) => (
					<details
						key={item.q}
						className="group rounded-2xl border border-border/80 bg-background/60 px-4 py-3 open:bg-background"
					>
						<summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
							<span className="flex items-start justify-between gap-3">
								<span>{item.q}</span>
								<span
									aria-hidden="true"
									className="mt-0.5 shrink-0 text-foreground/40 transition group-open:rotate-45"
								>
									+
								</span>
							</span>
						</summary>
						<p className="mt-3 text-sm leading-relaxed text-foreground/70">
							{item.a}
						</p>
					</details>
				))}
			</div>
		</ContentPage>
	);
}
