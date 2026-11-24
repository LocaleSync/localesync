// src/main/like-prompt-flags.ts — clientStorage memory for the LS-35 "Like on Community" line. Pure.
export const LIKE_PROMPT_KEY = 'localesync:like-prompt:v1';

/**
 * Whether the line is closed for good. Anything malformed reads as not closed: the line is a quiet,
 * dismissible prompt, so showing it once more after a corrupted store is the harmless direction.
 * An UNREADABLE store is different and is handled by the caller (see `likePromptDismissed`).
 */
export function parseLikePromptDismissed(raw: unknown): boolean {
	if (typeof raw !== 'object' || raw === null) return false;
	return (raw as Record<string, unknown>).dismissed === true;
}

/**
 * What the state request answers. `null` means the store could not be read: answer "dismissed" so
 * a broken store never makes the line reappear on every scan with no way to make it stick.
 */
export function likePromptDismissed(stored: boolean | null): boolean {
	return stored === null ? true : stored;
}
