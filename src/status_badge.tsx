/**
 * StatusBadge — animated spinner / completion / error indicator.
 * @module ui/status_badge
 *
 * Used by async and streaming panels to show:
 *   ⠋ Loading…   (idle / loading)
 *   ⠋ Streaming… (streaming)
 *   ✓ Done       (done)
 *   ✗ <message>  (error)
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import type { PanelStatus } from './types.js';

const SPINNER_FRAMES = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'] as const;

export interface StatusBadgeProps {
	status: PanelStatus;
	/** Error message shown when status === 'error'. */
	errorMessage?: string;
}

export function StatusBadge({ status, errorMessage }: StatusBadgeProps): React.ReactElement {
	const [frame, setFrame] = useState(0);

	useEffect(() => {
		if (status !== 'loading' && status !== 'streaming') return;
		const t = setInterval(
			() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length),
			100,
		);
		return () => clearInterval(t);
	}, [status]);

	if (status === 'done') {
		return (
			<Box>
				<Text bold color="green">✓ </Text>
				<Text>Done</Text>
			</Box>
		);
	}

	if (status === 'error') {
		return (
			<Box>
				<Text bold color="red">✗ </Text>
				<Text color="red">{errorMessage ?? 'An error occurred.'}</Text>
			</Box>
		);
	}

	if (status === 'loading' || status === 'streaming') {
		const label = status === 'streaming' ? 'Streaming…' : 'Loading…';
		return (
			<Box>
				<Text color="yellow">{SPINNER_FRAMES[frame]} </Text>
				<Text dimColor>{label}</Text>
			</Box>
		);
	}

	// 'idle' — render nothing
	return <></>;
}

export default StatusBadge;
