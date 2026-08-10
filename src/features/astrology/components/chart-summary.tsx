"use client";

import Link from "next/link";
import {
	ASPECT_LABELS,
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import { markBirthChartRestoreOnce } from "@/features/birth-chart/utils/birth-chart-draft";
import { buttonClassName } from "@/components/ui/button";
import { formatDateOnlyDisplay } from "@/lib/date";
import { cn } from "@/lib/utils";

function getAngle(
	result: NatalChartResult,
	key: NatalChartResult["angles"][number]["key"],
) {
	return result.angles.find((angle) => angle.key === key);
}

function getPlanet(result: NatalChartResult, key: string) {
	return result.planets.find((planet) => planet.key === key);
}

export function ChartSummary({
	result,
	birthDate,
	birthTime,
}: {
	result: NatalChartResult;
	birthDate: string;
	birthTime: string;
}) {
	const sun = getPlanet(result, "sun");
	const moon = getPlanet(result, "moon");
	const asc = getAngle(result, "ascendant");
	const mc = getAngle(result, "midheaven");

	const highlightCards = [
		sun
			? {
					title: "Güneş",
					symbol: PLANET_SYMBOLS.sun,
					sign: ZODIAC_SIGN_LABELS[sun.position.sign],
					detail: `${sun.position.degree}°${String(sun.position.minute).padStart(2, "0")}′`,
				}
			: null,
		moon
			? {
					title: "Ay",
					symbol: PLANET_SYMBOLS.moon,
					sign: ZODIAC_SIGN_LABELS[moon.position.sign],
					detail: `${moon.position.degree}°${String(moon.position.minute).padStart(2, "0")}′`,
				}
			: null,
		asc
			? {
					title: "Yükselen",
					symbol: "↑",
					sign: ZODIAC_SIGN_LABELS[asc.position.sign],
					detail: `${asc.position.degree}°${String(asc.position.minute).padStart(2, "0")}′`,
				}
			: null,
	].filter(Boolean);

	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 text-center sm:text-left">
					<p className="text-sm font-medium text-primary">
						Hesaplama Beta · Tropikal Zodyak · Placidus
					</p>
					<h1 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Doğum haritan hazır
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						{result.metadata.locationDisplayName} ·{" "}
						{formatDateOnlyDisplay(birthDate)} · {birthTime} ·{" "}
						{result.metadata.timezone}
					</p>
				</div>
				<Link
					href="/dogum-haritasi"
					onClick={() => {
						markBirthChartRestoreOnce();
					}}
					className={cn(
						buttonClassName({ variant: "secondary", size: "sm" }),
						"mx-auto w-full max-w-xs shrink-0 touch-manipulation sm:mx-0 sm:w-auto",
					)}
				>
					Bilgileri Düzenle
				</Link>
			</div>

			<ul className="grid gap-3 sm:grid-cols-3">
				{highlightCards.map((card) =>
					card ? (
						<li
							key={card.title}
							className="rounded-3xl border border-border bg-card p-5 text-center shadow-sm"
						>
							<p className="text-2xl text-primary" aria-hidden="true">
								{card.symbol}
							</p>
							<p className="mt-2 text-xs uppercase tracking-wide text-foreground/50">
								{card.title}
							</p>
							<p className="mt-1 font-serif text-xl text-foreground">{card.sign}</p>
							<p className="mt-1 text-sm text-foreground/70">{card.detail}</p>
						</li>
					) : null,
				)}
			</ul>

			{mc ? (
				<div className="rounded-2xl border border-border/80 bg-muted/50 px-4 py-3 text-sm text-foreground/80">
					<span className="font-medium text-foreground">MC</span>
					{" · "}
					{ZODIAC_SIGN_LABELS[mc.position.sign]}{" "}
					{mc.position.degree}°{String(mc.position.minute).padStart(2, "0")}′
				</div>
			) : null}

			<p className="text-xs text-foreground/50">Hesaplama sürümü: 1</p>
		</section>
	);
}

export function formatAspectOrb(orb: number): string {
	const totalMinutes = Math.round(orb * 60);
	const degrees = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${degrees}°${String(minutes).padStart(2, "0")}′`;
}

export function AspectLine({
	body1,
	body2,
	type,
	symbol,
	orb,
}: {
	body1: string;
	body2: string;
	type: keyof typeof ASPECT_LABELS;
	symbol: string;
	orb: number;
}) {
	return (
		<li className="rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm shadow-sm">
			<p className="font-medium text-foreground">
				{PLANET_LABELS[body1 as keyof typeof PLANET_LABELS]} {symbol}{" "}
				{PLANET_LABELS[body2 as keyof typeof PLANET_LABELS]}
			</p>
			<p className="mt-1 text-foreground/65">
				{ASPECT_LABELS[type]} · Orb {formatAspectOrb(orb)}
			</p>
		</li>
	);
}
