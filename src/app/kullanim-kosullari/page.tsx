import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "Kullanım Koşulları",
	description:
		"Astrozel hizmetinin bilgilendirme amacı, sorumluluklar ve kullanım sınırları.",
	alternates: { canonical: "/kullanim-kosullari" },
};

export default function TermsPage() {
	return (
		<ContentPage
			title="Kullanım Koşulları"
			description="Kısa bilgilendirme metni. Profesyonel hukuk belgesi değildir."
			updatedAtLabel={siteConfig.legalUpdatedAtLabel}
		>
			<ContentSection title="Hizmetin niteliği">
				<p>
					Astrozel bilgilendirme ve eğlence amaçlı bir doğum haritası
					deneyimidir. Astrolojik yorumlar sembolik ve geneldir.
				</p>
				<p>
					Hizmet sağlık, hukuk, psikoloji veya finans danışmanlığı değildir.
				</p>
			</ContentSection>

			<ContentSection title="Kullanıcı sorumluluğu">
				<p>
					Doğru doğum bilgisi girmek kullanıcının sorumluluğundadır. Yanlış
					tarih, saat veya konum sonuçları değiştirir.
				</p>
			</ContentSection>

			<ContentSection title="Teknik sınırlar">
				<p>
					Teknik hata, saat dilimi farkı veya hesaplama yaklaşımlarından kaynaklı
					farklılıklar oluşabilir.
				</p>
			</ContentSection>

			<ContentSection title="Kabul edilemeyen kullanım">
				<p>
					Otomatik yoğun istek, servisi zorlayan veya kötüye kullanan davranışlar
					yasaktır.
				</p>
				<p>
					İçerik izinsiz olarak toplu biçimde kopyalanamaz veya yeniden
					yayımlanamaz.
				</p>
			</ContentSection>

			<ContentSection title="Değişiklikler">
				<p>
					Hizmet ve bu metin zaman içinde değişebilir. Güncel sürüm bu sayfada
					yayımlanır.
				</p>
			</ContentSection>
		</ContentPage>
	);
}
