import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "Hakkında",
	description:
		"Astrozel’in doğum haritası yaklaşımı, tropikal zodyak ve Placidus ev sistemi hakkında kısa bilgi.",
	alternates: { canonical: "/hakkinda" },
};

export default function AboutPage() {
	return (
		<ContentPage
			title="Astrozel Hakkında"
			description="Doğum haritasını anlaşılır ve sade bir deneyimle sunmak için geliştirilen Türkçe bir uygulama."
		>
			<ContentSection title="Ne sunar?">
				<p>
					Astrozel, doğum tarihi, saati ve yerine göre yükselen burç, evler ve
					gezegen konumlarını hesaplayıp doğum haritanı anlaşılır biçimde
					sunar.
				</p>
			</ContentSection>

			<ContentSection title="Hesaplama yaklaşımı">
				<p>Hesaplamalarda tropikal zodyak ve Placidus ev sistemi kullanılır.</p>
				<p>
					Doğum tarihi, saati ve konumu doğru sonuç için gereklidir. Özellikle
					yükselen burç ve evler doğum saatine duyarlıdır.
				</p>
			</ContentSection>

			<ContentSection title="Yorumlar hakkında">
				<p>
					Astrolojik yorumlar sembolik ve genel niteliktedir. Sağlık, hukuk veya
					finans danışmanlığı değildir.
				</p>
			</ContentSection>

			<ContentSection title="Geliştirme durumu">
				<p>
					Uygulama geliştirilmeye devam etmektedir. Özellikler ve metinler zaman
					içinde güncellenebilir.
				</p>
				<p className="text-xs text-foreground/50">
					{siteConfig.name} — bilgilendirme amaçlı içerik.
				</p>
			</ContentSection>
		</ContentPage>
	);
}
