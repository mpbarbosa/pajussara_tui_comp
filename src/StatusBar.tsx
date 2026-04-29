/**
 * @fileoverview StatusBar component — keybinding hints with optional async status badge
 * @module components/StatusBar
 *
 * Renders a bottom status bar with keybinding hints on the left and, when the
 * async `status` is active, a compact {@link StatusChronometer} on the right.
 * This is adapted from ai_workflow.js so it fits pajussara_tui_comp's generic
 * component API and local type/export conventions.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */

import React from 'react';
import { Box, Text } from 'ink';
import { StatusChronometer } from './status_chronometer.js';
import { isActivePanelStatus, shouldRenderStatusBadge } from './helpers/status.js';
import type { PanelStatus } from './types.js';

/** Single keybinding hint rendered by {@link StatusBar}. */
export interface StatusBarHint {
  /** Shortcut key label, e.g. `q` or `Tab`. */
  key: string;
  /** Human-readable action label. */
  label: string;
}

/** Props for {@link StatusBar}. */
export interface StatusBarProps {
  /** Normal-state hints rendered on the left side of the bar. */
  hints?: readonly StatusBarHint[];
  /** Replacement hints shown when `isComplete` is true. */
  completeHints?: readonly StatusBarHint[];
  /** Whether the surrounding workflow/task is complete. */
  isComplete?: boolean;
  /** Async status driving the badge/chronometer on the right. */
  status?: PanelStatus;
  /** Optional error message shown when `status === 'error'`. */
  errorMessage?: string | null;
  /** Total terminal width used to budget the chronometer width. */
  width?: number;
}

const DEFAULT_HINTS: readonly StatusBarHint[] = [
  { key: 'q', label: 'Quit' },
  { key: 'a', label: 'Abort' },
  { key: 'Tab', label: 'Focus' },
  { key: '↑/↓ j/k', label: 'Scroll' },
  { key: '/', label: 'Search' },
  { key: 'h', label: 'Help' },
  { key: 'e', label: 'Error' },
];

const DEFAULT_COMPLETE_HINTS: readonly StatusBarHint[] = [{ key: 'q', label: 'Exit' }];

function renderStatusBarHint(
  hint: StatusBarHint,
  index: number
): React.ReactElement {
  return React.createElement(
    React.Fragment,
    { key: `${hint.key}:${hint.label}` },
    index > 0 ? React.createElement(Text, { color: 'gray' }, '   ') : null,
    React.createElement(
      Text,
      null,
      React.createElement(Text, { color: 'cyan', bold: true }, `[${hint.key}]`),
      React.createElement(Text, { color: 'white' }, ` ${hint.label}`)
    )
  );
}

/**
 * Keybinding status bar with optional right-aligned async activity indicator.
 *
 * @param props - {@link StatusBarProps}
 */
export function StatusBar({
  hints = DEFAULT_HINTS,
  completeHints = DEFAULT_COMPLETE_HINTS,
  isComplete = false,
  status = 'idle',
  errorMessage = null,
  width = 80,
}: StatusBarProps): React.ReactElement {
  const visibleHints = isComplete ? completeHints : hints;
  const showBadge = shouldRenderStatusBadge(status);
  const forceRunning = isActivePanelStatus(status);

  // Budget roughly one third of the bar for the chronometer, with a sensible floor.
  const chronometerWidth = Math.max(20, Math.floor(width / 3));

  return React.createElement(
    Box,
    {
      borderStyle: 'single',
      borderColor: 'gray',
      paddingX: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    React.createElement(
      Box,
      { flexDirection: 'row' },
      ...visibleHints.map(renderStatusBarHint)
    ),
    showBadge
      ? React.createElement(StatusChronometer, {
          status,
          errorMessage: errorMessage ?? undefined,
          width: chronometerWidth,
          isFocused: false,
          forceRunning,
          showLabel: false,
          showBorder: false,
          showHints: false,
        })
      : null
  );
}

export default StatusBar;
