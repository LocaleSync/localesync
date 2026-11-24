// src/ui/overflow/like.test.ts — pure.
import { describe, expect, it } from 'vitest';
import { showLikePrompt } from './like';
import type { ScanPhase } from './state';

const shown = { phase: 'done' as ScanPhase, inEmptyState: false, rowCount: 3, dismissed: false };

describe('showLikePrompt — rule B (LS-35)', () => {
	it('shows after a completed scan with rows', () => {
		expect(showLikePrompt(shown)).toBe(true);
	});

	it.each<ScanPhase>(['idle', 'scanning', 'stopped', 'failed'])('hides in phase %s', (phase) => {
		expect(showLikePrompt({ ...shown, phase })).toBe(false);
	});

	it('hides when the scan found no rows to show', () => {
		expect(showLikePrompt({ ...shown, rowCount: 0 })).toBe(false);
	});

	it('hides over an empty state', () => {
		expect(showLikePrompt({ ...shown, inEmptyState: true })).toBe(false);
	});

	it('hides for good once dismissed', () => {
		expect(showLikePrompt({ ...shown, dismissed: true })).toBe(false);
	});
});
