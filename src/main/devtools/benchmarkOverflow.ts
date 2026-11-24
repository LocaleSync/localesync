// src/main/devtools/benchmarkOverflow.ts — LS-15 dev-only benchmark. Run against
// fixtures/large-file.fig (≈1500 text nodes).
//
// Times the real `scanOverflow` path end to end on the current page, one target language, and
// reports the per-node cost the LS-15 time budget is derived from. Read-only by construction:
// measurement only ever touches clones, which `measureOverflow` removes in `finally`.
//
// Freeze proxy: a 50 ms heartbeat runs alongside the scan and records how late it fires. Figma
// runs plugin main-thread code on the editor's thread, so a long heartbeat lag is the editor
// hitching. Report it alongside the cost; ≲100 ms max lag reads as "doesn't freeze".
import { largeFileNodeThreshold, LARGE_FILE_SECONDS } from '../../common/overflow-budget';
import { traverse } from '../traversal';
import { scanOverflow } from '../overflow';

export interface OverflowBenchmark {
	runs: number;
	language: string;
	traverseMs: number;
	eligibleNodes: number;
	scanMs: number[]; // per run, traversal included (that is what the user waits for)
	msPerNode: number; // median run ÷ eligible nodes
	maxLagMs: number; // worst heartbeat lateness across all runs
	suggestedThreshold: number; // largeFileNodeThreshold(LARGE_FILE_SECONDS, msPerNode)
}

const HEARTBEAT_MS = 50;

function median(values: readonly number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	const hi = sorted[mid] ?? 0;
	return sorted.length % 2 === 1 ? hi : ((sorted[mid - 1] ?? hi) + hi) / 2;
}

/** Self-rescheduling setTimeout rather than setInterval: lateness is measured per beat. */
function startHeartbeat(): { stop: () => number } {
	let maxLag = 0;
	let expected = Date.now() + HEARTBEAT_MS;
	let timer: ReturnType<typeof setTimeout> | null = null;
	const beat = (): void => {
		const now = Date.now();
		maxLag = Math.max(maxLag, now - expected);
		expected = now + HEARTBEAT_MS;
		timer = setTimeout(beat, HEARTBEAT_MS);
	};
	timer = setTimeout(beat, HEARTBEAT_MS);
	return {
		stop: () => {
			if (timer !== null) clearTimeout(timer);
			return maxLag;
		},
	};
}

export async function benchmarkOverflow(runs = 3, language = 'de'): Promise<OverflowBenchmark> {
	const traverseStart = Date.now();
	const models = await traverse('page');
	const traverseMs = Date.now() - traverseStart;
	const eligibleNodes = models.filter((model) => !model.hidden && !model.empty).length;

	const scanMs: number[] = [];
	let maxLagMs = 0;
	for (let run = 0; run < runs; run++) {
		const heartbeat = startHeartbeat();
		const start = Date.now();
		await scanOverflow('page', [language]);
		scanMs.push(Date.now() - start);
		maxLagMs = Math.max(maxLagMs, heartbeat.stop());
	}

	const msPerNode = eligibleNodes > 0 ? median(scanMs) / eligibleNodes : 0;
	return {
		runs,
		language,
		traverseMs,
		eligibleNodes,
		scanMs,
		msPerNode: Math.round(msPerNode * 100) / 100,
		maxLagMs,
		suggestedThreshold: largeFileNodeThreshold(LARGE_FILE_SECONDS, msPerNode),
	};
}
