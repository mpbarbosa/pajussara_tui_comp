/**
 * @fileoverview DirectoryPanel component — scrollable, keyboard-navigable folder panel
 * @module components/DirectoryPanel
 *
 * Reads the folders from a filesystem path and renders them in a bordered Ink
 * panel. Supports keyboard selection (↑/↓ or k/j) and surfaces loading, empty,
 * and filesystem error states inline.
 *
 * @version 1.2.2
 * @since 2026-04-12
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, Key } from 'ink';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape of a single folder entry displayed by {@link DirectoryPanel}. */
export interface DirectoryEntry {
  /** Folder name relative to {@link DirectoryPanelProps.directoryPath}. */
  name: string;
  /** Absolute or joined path for the folder entry. */
  path: string;
}

/** Props for {@link DirectoryPanel}. */
export interface DirectoryPanelProps {
  /** Filesystem path whose direct child folders should be listed. */
  directoryPath: string;
  /** Panel width in terminal columns. */
  width: number;
  /** Panel height in terminal rows (default: 20). */
  height?: number;
  /** Currently selected folder path, or `null`. */
  selectedDirectoryPath?: string | null;
  /** Fired when the user moves the selection to a new folder. */
  onSelectDirectory?: (directoryPath: string) => void;
  /** Whether this panel holds keyboard focus (default: false). */
  isFocused?: boolean;
  /** Header label rendered at the top of the panel (default: 'FOLDERS'). */
  title?: string;
  /** Text shown while folders are being loaded. */
  loadingText?: string;
  /** Text shown when the directory contains no child folders. */
  emptyText?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Scrollable, keyboard-navigable directory panel for Ink TUI applications.
 *
 * @param props - {@link DirectoryPanelProps}
 */
export function DirectoryPanel({
  directoryPath,
  width,
  height = 20,
  selectedDirectoryPath = null,
  onSelectDirectory,
  isFocused = false,
  title = 'FOLDERS',
  loadingText = 'Loading folders…',
  emptyText = 'No folders found.',
}: DirectoryPanelProps): React.ReactElement {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selIdx, setSelIdx] = useState<number>(0);

  useEffect(() => {
    let isStale = false;

    async function loadDirectories(): Promise<void> {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const entries = await readdir(directoryPath, { withFileTypes: true });
        const nextDirectories: DirectoryEntry[] = entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => ({
            name: entry.name,
            path: join(directoryPath, entry.name),
          }))
          .sort((left, right) => left.name.localeCompare(right.name));

        if (!isStale) {
          setDirectories(nextDirectories);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unknown filesystem error';

        if (!isStale) {
          setDirectories([]);
          setErrorMessage(message);
        }
      } finally {
        if (!isStale) {
          setIsLoading(false);
        }
      }
    }

    void loadDirectories();

    return (): void => {
      isStale = true;
    };
  }, [directoryPath]);

  useEffect(() => {
    if (directories.length === 0) {
      setSelIdx(0);
      return;
    }

    if (selectedDirectoryPath) {
      const idx = directories.findIndex(
        (directory) => directory.path === selectedDirectoryPath
      );

      setSelIdx(idx >= 0 ? idx : 0);
      return;
    }

    setSelIdx((prevIdx) => Math.min(prevIdx, directories.length - 1));
  }, [directories, selectedDirectoryPath]);

  useInput(
    (input: string, key: Key): void => {
      if (directories.length === 0 || isLoading || errorMessage) {
        return;
      }

      if (key.downArrow || input === 'j') {
        const next = Math.min(selIdx + 1, directories.length - 1);
        setSelIdx(next);
        onSelectDirectory?.(directories[next]?.path);
      } else if (key.upArrow || input === 'k') {
        const prev = Math.max(selIdx - 1, 0);
        setSelIdx(prev);
        onSelectDirectory?.(directories[prev]?.path);
      }
    },
    { isActive: isFocused }
  );

  const maxVisible: number = Math.max(1, height - 2);
  let visibleDirectories: DirectoryEntry[] = directories;
  if (directories.length > maxVisible) {
    const end = Math.max(selIdx + 1, maxVisible);
    const start = Math.max(0, end - maxVisible);
    visibleDirectories = directories.slice(start, end);
  }

  const labelWidth: number = Math.max(8, width - 10);
  const currentSelectedPath: string | null =
    directories[selIdx]?.path ?? selectedDirectoryPath;

  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'single',
      borderColor: isFocused ? 'white' : 'gray',
      width,
      paddingX: 1,
    },
    React.createElement(Text, { bold: true, color: 'white', dimColor: !isFocused }, title),
    isLoading
      ? React.createElement(Text, { color: 'gray', dimColor: true }, loadingText)
      : null,
    errorMessage
      ? React.createElement(
          Text,
          { color: 'red' },
          `Unable to read folders: ${errorMessage}`
        )
      : null,
    !isLoading && !errorMessage && visibleDirectories.length === 0
      ? React.createElement(Text, { color: 'gray', dimColor: true }, emptyText)
      : null,
    ...visibleDirectories.map((directory) => {
      const isSelected: boolean =
        isFocused && directory.path === currentSelectedPath;
      const labelWithSuffix = `${directory.name}/`;
      const label: string =
        labelWithSuffix.length > labelWidth
          ? `${labelWithSuffix.slice(0, labelWidth - 1)}…`
          : labelWithSuffix.padEnd(labelWidth);
      const cursor: string = isSelected ? '>' : ' ';

      return React.createElement(
        Box,
        { key: directory.path, flexDirection: 'row', gap: 1 },
        React.createElement(Text, { color: isSelected ? 'cyan' : 'gray' }, cursor),
        React.createElement(Text, { color: 'yellow' }, '[D]'),
        React.createElement(
          Text,
          {
            color: isSelected ? 'cyan' : 'white',
            bold: isSelected,
          },
          label
        )
      );
    })
  );
}

export default DirectoryPanel;
