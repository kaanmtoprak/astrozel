import { ZODIAC_SIGN_LABELS } from "@/features/astrology/constants/astrology-labels";
import type { ZodiacSign } from "@/features/astrology/types/astrology";
import type { ZodiacPosition } from "@/features/astrology/types/natal-chart";

const ZODIAC_SIGNS: ZodiacSign[] = [
	"aries",
	"taurus",
	"gemini",
	"cancer",
	"leo",
	"virgo",
	"libra",
	"scorpio",
	"sagittarius",
	"capricorn",
	"aquarius",
	"pisces",
];

export function assertFiniteNumber(value: unknown, label: string): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error(`${label} geçerli bir sayı değil.`);
	}
	return value;
}

export function normalizeLongitude(value: number): number {
	assertFiniteNumber(value, "Longitude");
	const normalized = ((value % 360) + 360) % 360;
	return Object.is(normalized, -0) ? 0 : normalized;
}

export function longitudeToZodiacSign(longitude: number): ZodiacSign {
	const normalized = normalizeLongitude(longitude);
	const index = Math.min(11, Math.floor(normalized / 30));
	return ZODIAC_SIGNS[index];
}

export function longitudeToSignDegree(longitude: number): number {
	return normalizeLongitude(longitude) % 30;
}

export function decimalDegreeToDms(value: number): {
	degree: number;
	minute: number;
	second: number;
} {
	assertFiniteNumber(value, "Derece");
	if (value < 0) {
		throw new Error("Negatif derece desteklenmiyor.");
	}

	let totalSeconds = Math.round(value * 3600);
	let degree = Math.floor(totalSeconds / 3600);
	totalSeconds -= degree * 3600;
	let minute = Math.floor(totalSeconds / 60);
	let second = totalSeconds - minute * 60;

	if (second === 60) {
		second = 0;
		minute += 1;
	}
	if (minute === 60) {
		minute = 0;
		degree += 1;
	}

	return { degree, minute, second };
}

export function formatZodiacPosition(
	sign: ZodiacSign,
	degree: number,
	minute: number,
	second = 0,
): string {
	const paddedMinute = String(minute).padStart(2, "0");
	const paddedSecond = String(second).padStart(2, "0");
	return `${degree}°${paddedMinute}′${paddedSecond}″ ${ZODIAC_SIGN_LABELS[sign]}`;
}

export function longitudeToZodiacPosition(longitude: number): ZodiacPosition {
	const normalized = normalizeLongitude(longitude);
	const sign = longitudeToZodiacSign(normalized);
	const signDegree = longitudeToSignDegree(normalized);
	const dms = decimalDegreeToDms(signDegree);

	let degree = dms.degree;
	let minute = dms.minute;
	let second = dms.second;
	let resolvedSign = sign;
	let resolvedSignDegree = signDegree;

	if (degree >= 30) {
		degree = 0;
		minute = 0;
		second = 0;
		resolvedSignDegree = 0;
		const nextIndex = (ZODIAC_SIGNS.indexOf(sign) + 1) % 12;
		resolvedSign = ZODIAC_SIGNS[nextIndex];
	}

	return {
		longitude: normalized,
		sign: resolvedSign,
		signDegree: resolvedSignDegree,
		degree,
		minute,
		second,
		formatted: formatZodiacPosition(resolvedSign, degree, minute, second),
	};
}
