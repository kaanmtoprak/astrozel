"use client";

import { useId, useState } from "react";

interface GoogleFc {
	callbackQueue?: Array<() => void>;
	showRevocationMessage?: () => void;
}

declare global {
	interface Window {
		googlefc?: GoogleFc;
	}
}

const UNAVAILABLE_MESSAGE =
	"Gizlilik tercihleri şu anda yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.";

const DEFAULT_BUTTON_CLASS =
	"inline-flex min-h-11 cursor-pointer items-center rounded text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/**
 * Official Google Privacy & Messaging consent revocation entrypoint.
 * @see https://support.google.com/adsense/answer/10959060
 */
export function PrivacyOptionsButton({
	className,
}: {
	className?: string;
}) {
	const statusId = useId();
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	function openPrivacyOptions() {
		const googlefc = window.googlefc ?? {};
		window.googlefc = googlefc;
		googlefc.callbackQueue = googlefc.callbackQueue ?? [];

		if (process.env.NODE_ENV === "development") {
			console.info("[privacy-options]", {
				hasGooglefc: Boolean(window.googlefc),
				queueIsArray: Array.isArray(googlefc.callbackQueue),
				showRevocationType: typeof googlefc.showRevocationMessage,
			});
		}

		let opened = false;

		const tryOpen = () => {
			if (typeof window.googlefc?.showRevocationMessage === "function") {
				window.googlefc.showRevocationMessage();
				opened = true;
				setStatusMessage(null);
			}
		};

		tryOpen();

		if (opened) {
			return;
		}

		googlefc.callbackQueue.push(() => {
			tryOpen();
		});

		window.setTimeout(() => {
			if (
				!opened &&
				typeof window.googlefc?.showRevocationMessage !== "function"
			) {
				setStatusMessage(UNAVAILABLE_MESSAGE);
			}
		}, 1200);
	}

	return (
		<span className="inline-flex flex-col items-start gap-1">
			<button
				type="button"
				onClick={openPrivacyOptions}
				aria-describedby={statusMessage ? statusId : undefined}
				className={className ? `${className} cursor-pointer` : DEFAULT_BUTTON_CLASS}
			>
				Gizlilik seçenekleri
			</button>
			{statusMessage ? (
				<span
					id={statusId}
					role="status"
					aria-live="polite"
					className="max-w-[16rem] text-xs leading-snug text-foreground/60"
				>
					{statusMessage}
				</span>
			) : null}
		</span>
	);
}
