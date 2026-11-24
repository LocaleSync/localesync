// src/common/overflow-budget.test.ts — pure.
import { describe, expect, it } from 'vitest';
import { LARGE_FILE_SECONDS, MS_PER_NODE, largeFileNodeThreshold, projectedScanSeconds } from './overflow-budget';

describe('largeFileNodeThreshold — node count derived from a time budget', () => {
	it('derives the count from seconds and per-node cost', () => {
		expect(largeFileNodeThreshold(10, 20)).toBe(500);
		expect(largeFileNodeThreshold(10, 8)).toBe(1250);
		expect(largeFileNodeThreshold(5, 3)).toBe(1667); // rounds up: the warning fires past the budget
	});

	it('keeps the provisional defaults equal to the old 500-node placeholder', () => {
		expect(largeFileNodeThreshold(LARGE_FILE_SECONDS, MS_PER_NODE)).toBe(500);
		expect(largeFileNodeThreshold()).toBe(500);
	});

	it.each([
		[10, 0],
		[10, -1],
		[0, 20],
		[10, Number.NaN],
	])('never returns less than 1 (seconds=%d, msPerNode=%d)', (seconds, ms) => {
		expect(largeFileNodeThreshold(seconds, ms)).toBe(1);
	});
});

describe('projectedScanSeconds', () => {
	it('is linear in node count', () => {
		expect(projectedScanSeconds(1500, 20)).toBe(30);
		expect(projectedScanSeconds(0, 20)).toBe(0);
		expect(projectedScanSeconds(-5, 20)).toBe(0);
	});
});
