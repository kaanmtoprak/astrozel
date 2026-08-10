"use client";

import { useSyncExternalStore } from "react";

export type VisualViewportMetrics = {
	height: number;
	offsetTop: number;
	width: number;
};

const FALLBACK: VisualViewportMetrics = {
	height: 0,
	offsetTop: 0,
	width: 0,
};

let cached: VisualViewportMetrics = FALLBACK;
const listeners = new Set<() => void>();
let attached = false;

function readMetrics(): VisualViewportMetrics {
	if (typeof window === "undefined") {
		return FALLBACK;
	}
	const vv = window.visualViewport;
	if (!vv) {
		return {
			height: window.innerHeight,
			offsetTop: 0,
			width: window.innerWidth,
		};
	}
	return {
		height: vv.height,
		offsetTop: vv.offsetTop,
		width: vv.width,
	};
}

function emit() {
	cached = readMetrics();
	for (const listener of listeners) {
		listener();
	}
}

function ensureAttached() {
	if (attached || typeof window === "undefined") {
		return;
	}
	attached = true;
	cached = readMetrics();
	const vv = window.visualViewport;
	vv?.addEventListener("resize", emit);
	vv?.addEventListener("scroll", emit);
	window.addEventListener("resize", emit);
}

function subscribe(onStoreChange: () => void) {
	ensureAttached();
	listeners.add(onStoreChange);
	return () => {
		listeners.delete(onStoreChange);
	};
}

function getSnapshot() {
	ensureAttached();
	return cached;
}

function getServerSnapshot() {
	return FALLBACK;
}

/**
 * Shared visualViewport metrics for mobile sheets (iOS keyboard safe).
 */
export function useVisualViewport(): VisualViewportMetrics {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function visualViewportStyle(
	metrics: VisualViewportMetrics,
): Record<string, string> {
	const height =
		metrics.height > 0 ? `${metrics.height}px` : "100dvh";
	return {
		"--astrozel-visual-viewport-height": height,
		"--astrozel-visual-viewport-offset-top": `${metrics.offsetTop}px`,
	};
}
