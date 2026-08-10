import {
	PLANET_CLUSTER_GAP_DEGREES,
	PLANET_MIN_SEPARATION_DEGREES,
} from "@/features/astrology/chart/constants/chart-layout";
import type {
	PlanetLayoutInput,
	PlanetLayoutItem,
} from "@/features/astrology/chart/types/chart-geometry";
import {
	assertFiniteNumber,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

function angularDistance(a: number, b: number): number {
	const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
	return Math.min(diff, 360 - diff);
}

function circularMean(longitudes: number[]): number {
	if (longitudes.length === 0) {
		return 0;
	}

	let sinSum = 0;
	let cosSum = 0;
	for (const longitude of longitudes) {
		const radians = (normalizeLongitude(longitude) * Math.PI) / 180;
		sinSum += Math.sin(radians);
		cosSum += Math.cos(radians);
	}

	const meanRadians = Math.atan2(
		sinSum / longitudes.length,
		cosSum / longitudes.length,
	);
	return normalizeLongitude((meanRadians * 180) / Math.PI);
}

function clusterPlanets(
	sorted: PlanetLayoutInput[],
	clusterGap: number,
): PlanetLayoutInput[][] {
	if (sorted.length === 0) {
		return [];
	}

	const clusters: PlanetLayoutInput[][] = [];
	let current: PlanetLayoutInput[] = [sorted[0]];

	for (let index = 1; index < sorted.length; index += 1) {
		const previous = sorted[index - 1];
		const planet = sorted[index];
		if (
			angularDistance(previous.longitude, planet.longitude) <= clusterGap
		) {
			current.push(planet);
		} else {
			clusters.push(current);
			current = [planet];
		}
	}
	clusters.push(current);

	if (clusters.length > 1) {
		const first = clusters[0];
		const last = clusters[clusters.length - 1];
		const wrapDistance = angularDistance(
			last[last.length - 1].longitude,
			first[0].longitude,
		);
		if (wrapDistance <= clusterGap) {
			clusters[0] = [...last, ...first];
			clusters.pop();
		}
	}

	return clusters;
}

function layoutCluster(
	cluster: PlanetLayoutInput[],
	minSeparation: number,
): PlanetLayoutItem[] {
	if (cluster.length === 1) {
		const only = cluster[0];
		const trueLongitude = normalizeLongitude(only.longitude);
		return [
			{
				planet: only.key,
				trueLongitude,
				displayLongitude: trueLongitude,
				radialLane: 0,
				displacement: 0,
			},
		];
	}

	const trueLongitudes = cluster.map((item) =>
		normalizeLongitude(item.longitude),
	);
	const center = circularMean(trueLongitudes);
	const count = cluster.length;
	const span = (count - 1) * minSeparation;
	const start = center - span / 2;

	return cluster.map((item, index) => {
		const trueLongitude = normalizeLongitude(item.longitude);
		const displayLongitude = normalizeLongitude(start + index * minSeparation);
		const displacement = normalizeLongitude(
			displayLongitude - trueLongitude + 180,
		) - 180;
		const radialLane =
			count >= 4 ? index % 3 : count >= 3 && index !== 1 ? 1 : 0;

		return {
			planet: item.key,
			trueLongitude,
			displayLongitude,
			radialLane,
			displacement,
		};
	});
}

export function layoutPlanets(
	inputs: readonly PlanetLayoutInput[],
	options?: {
		minSeparation?: number;
		clusterGap?: number;
	},
): PlanetLayoutItem[] {
	const minSeparation = options?.minSeparation ?? PLANET_MIN_SEPARATION_DEGREES;
	const clusterGap = options?.clusterGap ?? PLANET_CLUSTER_GAP_DEGREES;

	assertFiniteNumber(minSeparation, "minSeparation");
	assertFiniteNumber(clusterGap, "clusterGap");

	const copied = inputs.map((item) => {
		assertFiniteNumber(item.longitude, `${item.key} longitude`);
		return {
			key: item.key,
			longitude: normalizeLongitude(item.longitude),
		};
	});

	copied.sort((a, b) => a.longitude - b.longitude);

	const clusters = clusterPlanets(copied, clusterGap);
	const layouts = clusters.flatMap((cluster) =>
		layoutCluster(cluster, minSeparation),
	);

	layouts.sort((a, b) => a.trueLongitude - b.trueLongitude);
	return layouts;
}
