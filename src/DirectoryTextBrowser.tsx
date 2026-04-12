/**
 * @fileoverview DirectoryTextBrowser component — DirectoryPanel and TextListPanel side by side
 * @module components/DirectoryTextBrowser
 *
 * Renders a two-pane browser with a directory navigator on the left and a
 * ListPanel-backed text view on the right. Focus can be moved between panes
 * with Tab, ← / h, and → / l.
 *
 * @version 1.2.2
 * @since 2026-04-12
 */

import React, { useMemo, useState } from 'react';
import { Box, useInput, Key } from 'ink';
import { DirectoryPanel } from './DirectoryPanel.js';
import { TextListPanel } from './TextListPanel.js';
import type { TextListItem } from './TextListPanel.js';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Focusable pane names used by {@link DirectoryTextBrowser}. */
export type DirectoryTextBrowserPane = 'directories' | 'text';

/** Props for {@link DirectoryTextBrowser}. */
export interface DirectoryTextBrowserProps {
  /** Filesystem path whose direct child folders should be listed. */
  directoryPath: string;
  /** Function that returns the text items for the currently selected directory. */
  getTextItems: (directoryPath: string | null) => TextListItem[];
  /** Total width of the two-pane layout in terminal columns. */
  width: number;
  /** Panel height shared by both panes (default: 20). */
  height?: number;
  /** Width of the left directory pane (default: 40% of the layout width). */
  directoryPanelWidth?: number;
  /** Horizontal gap between panes (default: 1). */
  gap?: number;
  /** Currently selected directory path, or `null`. */
  selectedDirectoryPath?: string | null;
  /** Fired when the user moves the directory selection. */
  onSelectDirectory?: (directoryPath: string) => void;
  /** ID of the active text row, or `null`. */
  currentTextItemId?: string | null;
  /** ID of the currently selected text row, or `null`. */
  selectedTextItemId?: string | null;
  /** Fired when the user moves the text selection. */
  onSelectTextItem?: (id: string) => void;
  /** Focused pane name for controlled focus management. */
  focusedPane?: DirectoryTextBrowserPane;
  /** Initial focused pane when focus is uncontrolled (default: `'directories'`). */
  initialFocusedPane?: DirectoryTextBrowserPane;
  /** Fired when focus moves between panes. */
  onFocusPaneChange?: (pane: DirectoryTextBrowserPane) => void;
  /** Header label for the left directory pane (default: `'FOLDERS'`). */
  directoryTitle?: string;
  /** Text shown while the left pane reads the directory. */
  directoryLoadingText?: string;
  /** Text shown when the left pane has no child folders. */
  directoryEmptyText?: string;
  /** Header label for the right text pane (default: `'TEXT'`). */
  textTitle?: string;
  /** Text shown when the selected directory has no text items. */
  textEmptyText?: string;
  /** Text shown when no directory is selected yet. */
  textPlaceholderText?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Two-pane browser that combines {@link DirectoryPanel} and
 * {@link TextListPanel} into a single focused layout.
 *
 * @param props - {@link DirectoryTextBrowserProps}
 */
export function DirectoryTextBrowser({
  directoryPath,
  getTextItems,
  width,
  height = 20,
  directoryPanelWidth,
  gap = 1,
  selectedDirectoryPath,
  onSelectDirectory,
  currentTextItemId = null,
  selectedTextItemId = null,
  onSelectTextItem,
  focusedPane,
  initialFocusedPane = 'directories',
  onFocusPaneChange,
  directoryTitle = 'FOLDERS',
  directoryLoadingText = 'Loading folders…',
  directoryEmptyText = 'No folders found.',
  textTitle = 'TEXT',
  textEmptyText = 'No text items for this directory.',
  textPlaceholderText = 'Select a directory to view its text items.',
}: DirectoryTextBrowserProps): React.ReactElement {
  const [internalSelectedDirectoryPath, setInternalSelectedDirectoryPath] =
    useState<string | null>(selectedDirectoryPath ?? null);
  const [internalFocusedPane, setInternalFocusedPane] =
    useState<DirectoryTextBrowserPane>(focusedPane ?? initialFocusedPane);

  const currentSelectedDirectoryPath: string | null =
    selectedDirectoryPath ?? internalSelectedDirectoryPath;
  const currentFocusedPane: DirectoryTextBrowserPane =
    focusedPane ?? internalFocusedPane;

  const resolvedGap: number = Math.max(1, gap);
  const minPanelWidth = 18;
  const maxDirectoryWidth = Math.max(minPanelWidth, width - resolvedGap - minPanelWidth);
  const preferredDirectoryWidth =
    directoryPanelWidth ?? Math.floor((width - resolvedGap) * 0.4);
  const resolvedDirectoryWidth = Math.min(
    maxDirectoryWidth,
    Math.max(minPanelWidth, preferredDirectoryWidth)
  );
  const resolvedTextWidth = Math.max(
    minPanelWidth,
    width - resolvedGap - resolvedDirectoryWidth
  );

  const textItems: TextListItem[] = useMemo(
    () => getTextItems(currentSelectedDirectoryPath),
    [currentSelectedDirectoryPath, getTextItems]
  );

  function updateFocusedPane(nextPane: DirectoryTextBrowserPane): void {
    if (focusedPane === undefined) {
      setInternalFocusedPane(nextPane);
    }

    onFocusPaneChange?.(nextPane);
  }

  function handleSelectDirectory(nextDirectoryPath: string): void {
    if (selectedDirectoryPath === undefined) {
      setInternalSelectedDirectoryPath(nextDirectoryPath);
    }

    onSelectDirectory?.(nextDirectoryPath);
  }

  useInput((input: string, key: Key): void => {
    if (key.tab) {
      updateFocusedPane(
        currentFocusedPane === 'directories' ? 'text' : 'directories'
      );
      return;
    }

    if (key.rightArrow || input === 'l') {
      updateFocusedPane('text');
    } else if (key.leftArrow || input === 'h') {
      updateFocusedPane('directories');
    }
  });

  return React.createElement(
    Box,
    { flexDirection: 'row', gap: resolvedGap },
    React.createElement(DirectoryPanel, {
      directoryPath,
      width: resolvedDirectoryWidth,
      height,
      selectedDirectoryPath: currentSelectedDirectoryPath,
      onSelectDirectory: handleSelectDirectory,
      isFocused: currentFocusedPane === 'directories',
      title: directoryTitle,
      loadingText: directoryLoadingText,
      emptyText: directoryEmptyText,
    }),
    React.createElement(TextListPanel, {
      items: textItems,
      width: resolvedTextWidth,
      height,
      currentTextItemId,
      selectedTextItemId,
      onSelectTextItem,
      isFocused: currentFocusedPane === 'text',
      title: textTitle,
      emptyText: currentSelectedDirectoryPath ? textEmptyText : textPlaceholderText,
    })
  );
}

export default DirectoryTextBrowser;
