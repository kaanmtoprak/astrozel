import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";
import type { BigThreeKind } from "@/features/astrology/interpretations/content/big-three";
import { PLANET_INTERPRETATION_ORDER } from "@/features/astrology/interpretations/constants/interpretation-settings";

function planetRank(key: PlanetKey): number {
	const index = PLANET_INTERPRETATION_ORDER.indexOf(key);
	return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/** Gezegen çiftini kanonik (düşük sıra önce) hale getirir. */
export function canonicalizePlanetPair(
	body1: PlanetKey,
	body2: PlanetKey,
): [PlanetKey, PlanetKey] {
	return planetRank(body1) <= planetRank(body2) ? [body1, body2] : [body2, body1];
}

export function bigThreeContentKey(kind: BigThreeKind, sign: ZodiacSign): string {
	return `big_three.${kind}.${sign}`;
}

export function planetSignContentKey(planet: PlanetKey, sign: ZodiacSign): string {
	return `planet_sign.${planet}.${sign}`;
}

export function planetHouseContentKey(planet: PlanetKey, house: number): string {
	return `planet_house.${planet}.${house}`;
}

export function aspectContentKey(
	body1: PlanetKey,
	body2: PlanetKey,
	type: AspectType,
): string {
	const [first, second] = canonicalizePlanetPair(body1, body2);
	return `aspect.${first}.${second}.${type}`;
}
