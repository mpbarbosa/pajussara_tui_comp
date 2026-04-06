/**
 * @fileoverview StatusBadge component — animated spinner / completion / error indicator
 * @module components/StatusBadge
 *
 * Used by async and streaming panels to show:
 *   ⠋ Loading…   (idle / loading)
 *   ⠋ Streaming… (streaming)
 *   ✓ Done       (done)
 *   ✗ <message>  (error)
 *
 * @version 1.1.8
 * @since 2026-04-05
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import type { PanelStatus } from './types.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const SPINNER_FRAMES = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

/** Props for {@link StatusBadge}. */
export interface StatusBadgeProps {
  /** Current panel status driving the visual indicator. */
  status: PanelStatus;
  /** Error message shown when status === 'error'. */
  errorMessage?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

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
    return React.createElement(
      Box,
      null,
      React.createElement(Text, { bold: true, color: 'green' }, '✓ '),
      React.createElement(Text, null, 'Done'),
    );
  }

  if (status === 'error') {
    return React.createElement(
      Box,
      null,
      React.createElement(Text, { bold: true, color: 'red' }, '✗ '),
      React.createElement(Text, { color: 'red' }, errorMessage ?? 'An error occurred.'),
    );
  }

  if (status === 'loading' || status === 'streaming') {
    const label = status === 'streaming' ? 'Streaming…' : 'Loading…';
    return React.createElement(
      Box,
      null,
      React.createElement(Text, { color: 'yellow' }, SPINNER_FRAMES[frame] + ' '),
      React.createElement(Text, { dimColor: true }, label),
    );
  }

  // 'idle' — render nothing
  return React.createElement(React.Fragment, null);
}

export default StatusBadge;
