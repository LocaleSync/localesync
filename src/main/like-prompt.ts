// src/main/like-prompt.ts — LS-35 main-thread handlers: the "Like on Community" line's memory and
// its link.
//
// Best-effort like telemetry (LS-13 §1.5): a clientStorage failure never surfaces as an error the UI
// must handle. The one real failure — openExternal throwing — answers `internal`, and in that case
// nothing is saved, so the line comes back rather than vanishing behind a link that never opened.
import { COMMUNITY_URL } from '../common/community';
import { on, respond, send } from './bridge';
import { LIKE_PROMPT_KEY, likePromptDismissed, parseLikePromptDismissed } from './like-prompt-flags';

/** Null when the store cannot be read — distinct from "nothing stored". */
async function readDismissed(): Promise<boolean | null> {
	try {
		return parseLikePromptDismissed(await figma.clientStorage.getAsync(LIKE_PROMPT_KEY));
	} catch {
		return null;
	}
}

async function writeDismissed(): Promise<void> {
	try {
		await figma.clientStorage.setAsync(LIKE_PROMPT_KEY, { dismissed: true });
	} catch (err) {
		if (import.meta.env.DEV) {
			console.warn(`[like-prompt] dismissal not saved: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
}

export function registerLikePrompt(): void {
	on('like-prompt-state-request', (msg) => {
		void (async () => {
			respond<'like-prompt-state-request'>(msg.id, {
				type: 'like-prompt-state',
				dismissed: likePromptDismissed(await readDismissed()),
			});
		})();
	});

	on('like-prompt-close', (msg) => {
		void (async () => {
			if (msg.action === 'like') {
				try {
					figma.openExternal(COMMUNITY_URL);
				} catch (err) {
					send({
						type: 'error',
						id: msg.id,
						code: 'internal',
						severity: 'error',
						message: `Couldn't open the Community page: ${err instanceof Error ? err.message : String(err)}`,
					});
					return;
				}
			}
			await writeDismissed();
			send({ type: 'progress', id: msg.id, completed: 1, total: 1 });
		})();
	});
}
