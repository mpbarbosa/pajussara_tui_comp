/**
 * @fileoverview Demo — DirectoryTextBrowser across the repository root
 * @module demo/directory-text-browser
 *
 * Interactive demo of the DirectoryTextBrowser component. Browse the direct
 * child folders of the project root on the left and inspect directory-specific
 * text notes on the right. Use Tab or ←/→ (h/l) to switch focus, ↑/↓ (or k/j)
 * to move within the focused pane, and q to quit.
 *
 * Run with:
 *   npx tsx demos/directory-text-browser.tsx
 *
 * @version 1.4.0
 * @since 2026-04-12
 */

import React, { useState } from 'react';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, Box, Text, useApp, useInput } from 'ink';
import { DirectoryTextBrowser } from '../src/DirectoryTextBrowser.js';
import type { DirectoryTextBrowserPane } from '../src/DirectoryTextBrowser.js';
import type { TextListItem } from '../src/TextListPanel.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const DEMO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

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
    { id: 'demos-focus', text: 'Use focus-aware demos to show keyboard behavior clearly.', status: 'pending' },
  ],
};

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

// ── App ───────────────────────────────────────────────────────────────────────

export function DirectoryTextBrowserDemo(): React.ReactElement {
  const { exit } = useApp();
  const [focusedPane, setFocusedPane] =
    useState<DirectoryTextBrowserPane>('directories');
  const [selectedDirectoryPath, setSelectedDirectoryPath] =
    useState<string | null>(join(DEMO_ROOT, 'src'));
  const [selectedTextItemId, setSelectedTextItemId] = useState<string | null>(null);

  useInput((input: string) => {
    if (input === 'q') {
      exit();
    }
  });

  const focusedLabel =
    focusedPane === 'directories' ? 'Directories' : 'Text details';

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'white' },
      'DirectoryTextBrowser Demo  ·  Tab/←/→ switch focus  ·  ↑/↓ navigate  ·  q quit'
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(DirectoryTextBrowser, {
      directoryPath: DEMO_ROOT,
      getTextItems,
      width: 96,
      height: 18,
      selectedDirectoryPath,
      onSelectDirectory: setSelectedDirectoryPath,
      selectedTextItemId,
      onSelectTextItem: setSelectedTextItemId,
      focusedPane,
      onFocusPaneChange: setFocusedPane,
      directoryTitle: 'REPOSITORY FOLDERS',
      textTitle: 'DIRECTORY NOTES',
    }),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(
      Text,
      { color: 'cyan' },
      `Focused pane: ${focusedLabel}`
    ),
    React.createElement(
      Text,
      { color: selectedDirectoryPath ? 'white' : 'gray' },
      selectedDirectoryPath
        ? `Selected directory: ${selectedDirectoryPath}`
        : 'Selected directory: (none)'
    ),
    React.createElement(
      Text,
      { color: selectedTextItemId ? 'white' : 'gray' },
      selectedTextItemId
        ? `Selected text item: ${selectedTextItemId}`
        : 'Selected text item: (none)'
    )
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  render(React.createElement(DirectoryTextBrowserDemo, null));
}
