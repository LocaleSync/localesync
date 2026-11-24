// src/main/like-prompt-flags.test.ts — pure (no figma).
import { describe, expect, it } from 'vitest';
import { LIKE_PROMPT_KEY, likePromptDismissed, parseLikePromptDismissed } from './like-prompt-flags';

describe('parseLikePromptDismissed — clientStorage is a cache', () => {
	it('reads a stored dismissal', () => {
		expect(parseLikePromptDismissed({ dismissed: true })).toBe(true);
	});

	it.each([undefined, null, 'x', 3, {}, { dismissed: 'yes' }, { dismissed: 1 }, { dismissed: false }])(
		'reads %j as not dismissed',
		(raw) => {
			expect(parseLikePromptDismissed(raw)).toBe(false);
		},
	);

	it('uses the versioned key', () => {
		expect(LIKE_PROMPT_KEY).toBe('localesync:like-prompt:v1');
	});
});

describe('likePromptDismissed — an unreadable store hides the line', () => {
	it('passes a readable answer through', () => {
		expect(likePromptDismissed(true)).toBe(true);
		expect(likePromptDismissed(false)).toBe(false);
	});

	it('treats an unreadable store as dismissed', () => {
		expect(likePromptDismissed(null)).toBe(true);
	});
});
