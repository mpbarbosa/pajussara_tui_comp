/**
 * @fileoverview ErrorDetailPanel — error/stack trace modal overlay
 * @module components/ErrorDetailPanel
 *
 * Displays the failed step name, error message, and a truncated stack trace.
 * This is adapted from ai_workflow.js so it can be reused as a generic
 * terminal error/details panel within pajussara_tui_comp.
 *
 * @version 1.4.0
 * @since 2026-04-29
 */

import React from 'react';
import { Box, Text, useInput, type Key } from 'ink';
import { truncateStackTrace } from './helpers/reusable.js';

export interface ErrorDetailPanelError {
  stepId: string;
  stepName: string;
  message: string;
  stack: string | null;
}

export interface ErrorDetailPanelProps {
  error: ErrorDetailPanelError | null;
  onClose: () => void;
}

export function ErrorDetailPanel({
  error,
  onClose,
}: ErrorDetailPanelProps): React.ReactElement {
  useInput((input: string, key: Key): void => {
    if (key.escape || input === 'e' || input === 'E') {
      onClose();
    }
  });

  if (!error) {
    return React.createElement(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'single',
        borderColor: 'red',
        padding: 1,
        marginX: 4,
      },
      React.createElement(Text, { color: 'gray' }, 'No error recorded.'),
      React.createElement(Text, { color: 'gray', dimColor: true }, 'Press [e] or [Esc] to close')
    );
  }

  const stackLines = truncateStackTrace(error.stack, 20);

  return React.createElement(
    Box,
    { flexDirection: 'column', borderStyle: 'single', borderColor: 'red', padding: 1, marginX: 4 },
    React.createElement(
      Text,
      { bold: true, color: 'red' },
      `✗ Failed: ${error.stepName || '(unknown)'}`
    ),
    React.createElement(Text, { color: 'white' }, error.message || 'Unknown error'),
    stackLines.length > 0
      ? React.createElement(
          React.Fragment,
          { key: 'stack' },
          React.createElement(Text, { key: 'sep', color: 'gray' }, ''),
          React.createElement(
            Text,
            { key: 'title', bold: true, color: 'gray', dimColor: true },
            '── Stack trace ──'
          ),
          ...stackLines.map((line: string, index: number) =>
            React.createElement(Text, { key: `s${index}`, color: 'gray', dimColor: true }, line)
          )
        )
      : null,
    React.createElement(Text, null, ''),
    React.createElement(Text, { color: 'gray', dimColor: true }, 'Press [e] or [Esc] to close')
  );
}

export default ErrorDetailPanel;
