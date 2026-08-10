"use client";

import { Suspense } from "react";
import { MobileDebugPanel } from "@/components/debug/mobile-debug-panel";

/**
 * Development-only diagnostics. Visible only with ?mobileDebug=1.
 * No badge on normal development screens.
 */
export function MobileDebugRoot() {
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<Suspense fallback={null}>
			<MobileDebugPanel />
		</Suspense>
	);
}
