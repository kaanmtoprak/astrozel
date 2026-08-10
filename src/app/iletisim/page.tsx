import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "İletişim",
	description: "Astrozel iletişim bilgileri.",
	alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
	return (
		<ContentPage
			title="İletişim"
			description="Şimdilik yalnızca bilgilendirme amaçlı bir sayfa."
		>
			<ContentSection>
				{siteConfig.contactEmail ? (
					<p>
						Bize{" "}
						<a
							href={`mailto:${siteConfig.contactEmail}`}
							className="underline underline-offset-2 hover:text-foreground"
						>
							{siteConfig.contactEmail}
						</a>{" "}
						adresinden ulaşabilirsiniz.
					</p>
				) : (
					<p>
						İletişim adresi production alan adı yapılandırması tamamlandığında
						bu sayfaya eklenecektir.
					</p>
				)}
			</ContentSection>
		</ContentPage>
	);
}
