"use client";

import type { ReactNode, RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
	useVisualViewport,
	visualViewportStyle,
} from "@/hooks/use-visual-viewport";
import { cn } from "@/lib/utils";

export type MobileSheetVariant = "bottom" | "top" | "full";

export type MobileSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
	variant?: MobileSheetVariant;
	contentClassName?: string;
	showCloseButton?: boolean;
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** When false, caller provides its own trigger outside Dialog.Trigger */
	includeTrigger?: boolean;
	trigger?: ReactNode;
	testId?: string;
};

const variantClasses: Record<MobileSheetVariant, string> = {
	bottom:
		"bottom-0 left-0 right-0 max-h-[min(var(--astrozel-visual-viewport-height,100dvh),92%)] rounded-t-3xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
	top: "top-0 left-0 right-0 max-h-[min(var(--astrozel-visual-viewport-height,100dvh),92%)] rounded-b-3xl pt-[env(safe-area-inset-top)] pb-2",
	full: "inset-x-0 top-[var(--astrozel-visual-viewport-offset-top,0px)] h-[var(--astrozel-visual-viewport-height,100dvh)] max-h-[var(--astrozel-visual-viewport-height,100dvh)] rounded-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
};

/**
 * Shared mobile overlay: Radix Dialog sheet with visualViewport-aware sizing.
 * No backdrop-filter. Fixed width 100% (not 100vw).
 */
export function MobileSheet({
	open,
	onOpenChange,
	title,
	description,
	children,
	footer,
	variant = "bottom",
	contentClassName,
	showCloseButton = true,
	initialFocusRef,
	includeTrigger = false,
	trigger,
	testId,
}: MobileSheetProps) {
	const viewport = useVisualViewport();

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			{includeTrigger && trigger ? (
				<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			) : null}

			<Dialog.Portal>
				<Dialog.Overlay
					className="fixed inset-0 bg-[color-mix(in_srgb,var(--foreground)_42%,transparent)]"
					style={{ zIndex: "var(--astrozel-z-scrim)" }}
				/>
				<Dialog.Content
					data-testid={testId}
					onOpenAutoFocus={(event) => {
						if (initialFocusRef?.current) {
							event.preventDefault();
							initialFocusRef.current.focus();
						}
					}}
					style={{
						...visualViewportStyle(viewport),
						zIndex: "var(--astrozel-z-sheet)",
					}}
					className={cn(
						"astrozel-mobile-sheet fixed box-border flex w-full max-w-full flex-col overflow-hidden border border-border/80 bg-card shadow-xl outline-none",
						"left-0 right-0",
						variantClasses[variant],
						contentClassName,
					)}
				>
					<div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 px-4 py-3">
						<div className="min-w-0 flex-1">
							<Dialog.Title className="font-serif text-lg tracking-tight text-foreground">
								{title}
							</Dialog.Title>
							<Dialog.Description className="mt-0.5 text-sm text-foreground/60">
								{description}
							</Dialog.Description>
						</div>
						{showCloseButton ? (
							<Dialog.Close asChild>
								<button
									type="button"
									aria-label="Kapat"
									className="inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-border bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								>
									<X
										className="pointer-events-none h-5 w-5"
										aria-hidden="true"
									/>
								</button>
							</Dialog.Close>
						) : null}
					</div>

					<div className="astrozel-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-3 [touch-action:pan-y]">
						{children}
					</div>

					{footer ? (
						<div className="shrink-0 border-t border-border/70 bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
							{footer}
						</div>
					) : null}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
