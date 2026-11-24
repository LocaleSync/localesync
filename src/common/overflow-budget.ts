// src/common/overflow-budget.ts — the LS-15 large-file advisory, expressed as a time budget. Pure;
// imported by the UI panel and the main-side benchmark.
//
// Users experience waiting, not nodes, so the bound is "projected scan time exceeds N seconds" and
// the node count is DERIVED from the measured per-node cost of the Approach A clone cycle. A
// hardcoded count would be silently invalidated by any change in clone cost (LS-15).
//
// Advisory only: it decides when the pre-scan `large-file` state shows and never blocks a scan.

/** Projected scan time above which the pre-scan `large-file` advisory shows. */
export const LARGE_FILE_SECONDS = 10;

/**
 * Measured cost of one eligible node through scanOverflow (re-fetch + clone + font load + reads +
 * remove), in ms, one target language. PROVISIONAL: 20 ms reproduces the old 500-node placeholder
 * at a 10 s budget. Replace with the median `msPerNode` that the dev "Benchmark overflow" button
 * reports on fixtures/large-file.fig (LS-15).
 */
export const MS_PER_NODE = 20;

/** The node count at which a scan is projected to exceed `seconds`. Always at least 1. */
export function largeFileNodeThreshold(seconds: number = LARGE_FILE_SECONDS, msPerNode: number = MS_PER_NODE): number {
	if (!(msPerNode > 0) || !(seconds > 0)) return 1;
	return Math.max(1, Math.ceil((seconds * 1000) / msPerNode));
}

/** Projected wall-clock time for a scan of `nodes` eligible nodes, in seconds. */
export function projectedScanSeconds(nodes: number, msPerNode: number = MS_PER_NODE): number {
	return (Math.max(0, nodes) * msPerNode) / 1000;
}
