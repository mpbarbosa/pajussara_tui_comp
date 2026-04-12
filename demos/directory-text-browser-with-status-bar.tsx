/**
 * @fileoverview Demo — DirectoryTextBrowserWithStatusBar across the repository root
 * @module demo/directory-text-browser-with-status-bar
 *
 * Interactive demo of the composed DirectoryTextBrowserWithStatusBar component.
 * Browse the direct child folders of the project root, inspect directory-specific
 * text notes, and manually switch the bottom status bar between idle, loading,
 * streaming, error, and done states. Use Tab or ←/→ (h/l) to switch focus,
 * ↑/↓ (or k/j) to move within the focused pane, 1-5 to change the status bar
 * state, c to toggle complete hints, r to reset, and q to quit.
 *
 * Run with:
 *   npx tsx demos/directory-text-browser-with-status-bar.tsx
 *
 * @version 1.2.2
 * @since 2026-04-12
 */

import React, { useMemo, useState } from 'react';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, Box, Text, useApp, useInput } from 'ink';
import {
  DirectoryTextBrowserWithStatusBar,
  type DirectoryTextBrowserWithStatusBarProps,
} from '../src/DirectoryTextBrowserWithStatusBar.js';
import type { DirectoryTextBrowserPane } from '../src/DirectoryTextBrowser.js';
import type { StatusBarHint } from '../src/StatusBar.js';
import type { TextListItem } from '../src/TextListPanel.js';
import type { PanelStatus } from '../src/types.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const DEMO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const ACTIVE_HINTS: readonly StatusBarHint[] = [
  { key: 'Tab/←/→', label: 'Focus' },
  { key: '↑/↓', label: 'Move' },
  { key: '1-5', label: 'Status' },
  { key: 'c', label: 'Complete' },
  { key: 'r', label: 'Reset' },
  { key: 'q', label: 'Quit' },
];

const COMPLETE_HINTS: readonly StatusBarHint[] = [
  { key: 'r', label: 'Replay' },
  { key: 'q', label: 'Exit' },
];

const directoryNotesByName: Record<string, TextListItem[]> = {
  docs: [
    { id: 'docs-api', text: 'API and onboarding docs live here.', status: 'done', duration: 2 },
    { id: 'docs-guides', text: 'Use this folder for project-level guides.', status: 'pending' },
  ],
  helpers: [
    { id: 'helpers-status', text: 'Shared status/icon formatting utilities.', status: 'done', duration: 1 },
    { id: 'helpers-reuse', text: 'Prefer importing helpers before duplicating display logic.', status: 'running' },
  ],
  src: [
    { id: 'src-components', text: 'Primary Ink components live in src/.', status: 'done', duration: 1 },
    { id: 'src-exports', text: 'Remember to wire new components through src/index.ts.', status: 'pending' },
  ],
  test: [
    { id: 'test-mirror', text: 'Tests mirror the public components in src/.', status: 'done', duration: 1 },
    { id: 'test-esm', text: 'Jest uses ESM imports and unstable_mockModule for module mocks.', status: 'pending' },
  ],
  demos: [
    { id: 'demos-run', text: 'Runnable examples live here for manual inspection.', status: 'done', duration: 1 },
    { id: 'demos-compose', text: 'This demo shows the browser and status bar composed together.', status: 'running' },
  ],
};

const DEFAULT_DIRECTORY_PATH = join(DEMO_ROOT, 'src');
const DEFAULT_STATUS: PanelStatus = 'loading';
const DEFAULT_ERROR_MESSAGE = 'Worker timeout while fetching additional directory notes.';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTextItems(directoryPath: string | null): TextListItem[] {
  if (!directoryPath) {
    return [];
  }

  const directoryName = directoryPath.split('/').pop() ?? '';
  return directoryNotesByName[directoryName] ?? [
    {
      id: `${directoryName}-empty`,
      text: `No curated notes for ${directoryName}.`,
      status: 'pending',
    },
  ];
}

function formatSelectionLabel(value: string | null, emptyLabel: string): string {
  return value ?? emptyLabel;
}

// ── App ───────────────────────────────────────────────────────────────────────

export function DirectoryTextBrowserWithStatusBarDemo(): React.ReactElement {
  const { exit } = useApp();
  const [focusedPane, setFocusedPane] =
    useState<DirectoryTextBrowserPane>('directories');
  const [selectedDirectoryPath, setSelectedDirectoryPath] =
    useState<string | null>(DEFAULT_DIRECTORY_PATH);
  const [selectedTextItemId, setSelectedTextItemId] = useState<string | null>(null);
  const [status, setStatus] = useState<PanelStatus>(DEFAULT_STATUS);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useInput((input: string): void => {
    if (input === 'q') {
      exit();
      return;
    }

    if (input === 'c') {
      setIsComplete((previousValue) => !previousValue);
      return;
    }

    if (input === 'r') {
      setSelectedDirectoryPath(DEFAULT_DIRECTORY_PATH);
      setSelectedTextItemId(null);
      setFocusedPane('directories');
      setStatus(DEFAULT_STATUS);
      setIsComplete(false);
      setErrorMessage(null);
      return;
    }

    const manualStatusMap: Record<string, PanelStatus> = {
      '1': 'idle',
      '2': 'loading',
      '3': 'streaming',
      '4': 'error',
      '5': 'done',
    };

    const nextStatus = manualStatusMap[input];

    if (!nextStatus) {
      return;
    }

    setStatus(nextStatus);
    setIsComplete(nextStatus === 'done');
    setErrorMessage(nextStatus === 'error' ? DEFAULT_ERROR_MESSAGE : null);
  });

  const focusedLabel = focusedPane === 'directories' ? 'Directories' : 'Text details';
  const browserProps: DirectoryTextBrowserWithStatusBarProps = useMemo(
    () => ({
      directoryPath: DEMO_ROOT,
      getTextItems,
      width: 96,
      height: 16,
      statusBarGap: 1,
      selectedDirectoryPath,
      onSelectDirectory: (directoryPath: string): void => {
        setSelectedDirectoryPath(directoryPath);
        setSelectedTextItemId(null);
      },
      selectedTextItemId,
      onSelectTextItem: setSelectedTextItemId,
      focusedPane,
      onFocusPaneChange: setFocusedPane,
      directoryTitle: 'REPOSITORY FOLDERS',
      textTitle: 'DIRECTORY NOTES',
      statusBarProps: {
        hints: ACTIVE_HINTS,
        completeHints: COMPLETE_HINTS,
        isComplete,
        status,
        errorMessage,
      },
    }),
    [
      errorMessage,
      focusedPane,
      isComplete,
      selectedDirectoryPath,
      selectedTextItemId,
      status,
    ]
  );

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'white' },
      'DirectoryTextBrowserWithStatusBar Demo'
    ),
    React.createElement(
      Text,
      { color: 'cyan' },
      `Focused pane: ${focusedLabel}  ·  Directory: ${formatSelectionLabel(selectedDirectoryPath, '(none)')}`
    ),
    React.createElement(
      Text,
      { color: selectedTextItemId ? 'white' : 'gray' },
      `Selected text item: ${formatSelectionLabel(selectedTextItemId, '(none)')}  ·  Status: ${status}${isComplete ? ' · complete hints on' : ''}`
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(DirectoryTextBrowserWithStatusBar, browserProps)
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  render(React.createElement(DirectoryTextBrowserWithStatusBarDemo, null));
}
