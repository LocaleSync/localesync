// src/ui/overflow/LikeLine.test.ts — the LS-35 line, rendered with react-dom/server (plain Node).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LIKE_PROMPT_COPY } from '../../common/community';
import { LikeLine } from './LikeLine';

const html = renderToStaticMarkup(createElement(LikeLine, { onClose: () => {} }));

describe('LikeLine', () => {
	it('renders the lead, the link and the dismiss button', () => {
		expect(html).toContain(LIKE_PROMPT_COPY.lead);
		expect(html).toContain(`>${LIKE_PROMPT_COPY.link}<`);
		expect(html).toContain(`aria-label="${LIKE_PROMPT_COPY.dismiss}"`);
	});

	it('uses real buttons, so both controls are keyboard-focusable', () => {
		expect(html.match(/<button type="button"/g)).toHaveLength(2);
	});

	it('never uses a brand colour on its small text (accent rule)', () => {
		expect(html).not.toContain('--ls-text-brand');
		expect(html).not.toContain('--ls-bg-brand');
	});

	it('gives the × a 24px hit area', () => {
		expect(html).toMatch(/width:24px;height:24px/);
	});
});
