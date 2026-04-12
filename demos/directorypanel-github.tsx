/**
 * @fileoverview Demo — DirectoryPanel browsing the local GitHub workspace
 * @module demo/directorypanel-github
 *
 * Interactive demo of the DirectoryPanel component. It reads the direct child
 * folders of `/home/mpb/Documents/GitHub`, lets you move the highlighted
 * selection with ↑ / ↓ (or k / j), and shows the selected folder path below the
 * panel. Press q to quit.
 *
 * Run with:
 *   npx tsx demos/directorypanel-github.tsx
 *
 * @version 1.2.2
 * @since 2026-04-12
 */

import React, { useState } from 'react';
import { fileURLToPath } from 'node:url';
import { render, Box, Text, useApp, useInput } from 'ink';
import { DirectoryPanel } from '../src/DirectoryPanel.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const GITHUB_ROOT = '/home/mpb/Documents/GitHub';

// ── App ───────────────────────────────────────────────────────────────────────

export function DirectoryPanelDemo(): React.ReactElement {
  const { exit } = useApp();
  const [selectedDirectoryPath, setSelectedDirectoryPath] = useState<string | null>(
    null
  );

  useInput((input: string) => {
    if (input === 'q') {
      exit();
    }
  });

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'white' },
      'DirectoryPanel Demo  ·  ↑/↓ navigate  ·  q quit'
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(DirectoryPanel, {
      directoryPath: GITHUB_ROOT,
      width: 64,
      height: 18,
      isFocused: true,
      title: 'GITHUB FOLDERS',
      selectedDirectoryPath,
      onSelectDirectory: setSelectedDirectoryPath,
    }),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(
      Text,
      { color: selectedDirectoryPath ? 'cyan' : 'gray' },
      selectedDirectoryPath
        ? `Selected: ${selectedDirectoryPath}`
        : `Selected: (move the cursor to choose a folder in ${GITHUB_ROOT})`
    )
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  render(React.createElement(DirectoryPanelDemo, null));
}
