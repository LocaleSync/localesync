import { useState } from 'react';
import { LIKE_PROMPT_COPY, type LikePromptAction } from '../../common/community';
import { CloseIcon } from '../shell/icons/CloseIcon';
import { Tooltip } from '../shell/primitives/Tooltip';

/**
 * The LS-35 "Like on Community" line: one row of secondary text directly under the last overflow
 * result. Not a banner. The link is secondary text with an underline, never selection-blue — the
 * accent rule allows brand colour on fills and indicators only, never small text (design.md).
 * The × is the 24px UI3 close icon, so its hit area is 24px without extra padding.
 */
export function LikeLine(props: { onClose: (action: LikePromptAction) => void }) {
	const [hover, setHover] = useState(false);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 'var(--spacer-1)',
				padding: `var(--spacer-1) var(--spacer-1) var(--spacer-1) var(--spacer-3)`,
				color: 'var(--ls-text-secondary)',
				fontSize: 'var(--ls-text-size)',
				lineHeight: 'var(--ls-text-line)',
				letterSpacing: 'var(--ls-text-tracking)',
			}}
		>
			<span style={{ flex: 1, minWidth: 0 }}>
				{LIKE_PROMPT_COPY.lead}{' '}
				<button
					type="button"
					onClick={() => props.onClose('like')}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					style={{
						padding: 0,
						border: 'none',
						background: 'none',
						font: 'inherit',
						letterSpacing: 'inherit',
						color: hover ? 'var(--ls-text-default)' : 'var(--ls-text-secondary)',
						textDecoration: 'underline',
						textUnderlineOffset: 2,
						cursor: 'pointer',
					}}
				>
					{LIKE_PROMPT_COPY.link}
				</button>
			</span>
			<Tooltip label={LIKE_PROMPT_COPY.dismiss} placement="top">
				<button
					type="button"
					aria-label={LIKE_PROMPT_COPY.dismiss}
					onClick={() => props.onClose('dismiss')}
					style={{
						display: 'flex',
						width: 24,
						height: 24,
						padding: 0,
						border: 'none',
						borderRadius: 'var(--radius-medium)',
						background: 'none',
						color: 'var(--ls-icon-secondary)',
						cursor: 'pointer',
						flexShrink: 0,
					}}
				>
					<CloseIcon />
				</button>
			</Tooltip>
		</div>
	);
}
