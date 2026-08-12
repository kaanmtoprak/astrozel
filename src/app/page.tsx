import { FinalCtaSection } from "@/components/home/final-cta-section";
import { DailySkySection } from "@/components/home/daily-sky-section";
import { GuideSection } from "@/components/home/guide-section";
import {
	HeroBirthChartForm,
	HeroSection,
} from "@/components/home/hero-section";
import { PrecisionSection } from "@/components/home/precision-section";
import { PrivacyTrustSection } from "@/components/home/privacy-trust-section";

export default function HomePage() {
	return (
		<main id="main-content">
			<HeroSection />
			<HeroBirthChartForm />
			<PrecisionSection />
			<PrivacyTrustSection />
			<DailySkySection />
			<GuideSection />
			<FinalCtaSection />
		</main>
	);
}
