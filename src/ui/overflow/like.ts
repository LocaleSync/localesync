// src/ui/overflow/like.ts — when the LS-35 "Like on Community" line shows. Pure (no DOM, no shell).
import type { ScanPhase } from './state';

/**
 * Rule B (LS-35): after every COMPLETED scan that leaves rows on screen, until the user clicks the
 * link or the ×. Never mid-stream (`scanning`), never after Stop (`stopped`, even with partial
 * rows — the user cut the scan short, so it is not the moment), and never over an empty state.
 * `dismissed` defaults to true UI-side until main answers, so a slow or failed state request hides
 * the line rather than flashing it.
 */
export function showLikePrompt(input: {
	phase: ScanPhase;
	inEmptyState: boolean;
	rowCount: number;
	dismissed: boolean;
}): boolean {
	return input.phase === 'done' && !input.inEmptyState && input.rowCount > 0 && !input.dismissed;
}
