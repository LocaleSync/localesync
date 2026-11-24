// src/common/community.ts — the "Like on Community" line (LS-35). Pure; imported by main and UI.
//
// Like the Pro waitlist (./pro), this is a browser navigation, not a fetch: the main thread opens
// the URL with figma.openExternal and the plugin itself sends nothing.

/** The plugin's Figma Community page. Compiled in, so it must keep resolving. */
export const COMMUNITY_URL =
	'https://www.figma.com/community/plugin/1686133899389630393/localesync-localization-and-text-overflow-qa';

export const LIKE_PROMPT_COPY = {
	lead: 'Did this catch something?',
	link: 'Like LocaleSync on Community',
	dismiss: 'Dismiss',
} as const;

/** How the user closed the line. Either one hides it for good (LS-35, rule B). */
export type LikePromptAction = 'like' | 'dismiss';
