/**
 * @fileoverview ListPanel component — scrollable, keyboard-navigable list panel
 * @module components/ListPanel
 *
 * Renders a bordered list of items with status icons and elapsed durations.
 * The currently-active item is highlighted. Supports keyboard selection
 * (↑/↓ or k/j) and mouse click to select an item.
 *
 * @version 1.1.7
 * @since 2026-03-07
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, Key } from 'ink';
import { formatStepIcon, statusColor, formatDuration } from '../helpers/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape of a single list item displayed by {@link ListPanel}. */
export interface ListItem {
  id: string;
  name: string;
  status: string;
  duration?: number | null;
}

/** Props for {@link ListPanel}. */
export interface ListPanelProps {
  /** Map of item ID → item data. */
  items: Record<string, ListItem>;
  /** ID of the currently active/running item, or `null`. */
  currentItemId: string | null;
  /** Panel width in terminal columns. */
  width: number;
  /** Panel height in terminal rows (default: 20). */
  height?: number;
  /** ID of the externally-controlled selected item, or `null`. */
  selectedItemId?: string | null;
  /** Fired when the user moves the selection to a new item. */
  onSelectItem?: (id: string) => void;
  /** Whether this panel holds keyboard focus (default: false). */
  isFocused?: boolean;
  /** Header label rendered at the top of the panel (default: 'STEPS'). */
  title?: string;
  /** Text shown when the items map is empty (default: 'Waiting for steps…'). */
  emptyText?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Scrollable, keyboard-navigable list panel for Ink TUI applications.
 *
 * @param props - {@link ListPanelProps}
 */
export function ListPanel({
  items = {},
  currentItemId,
  width,
  height = 20,
  selectedItemId = null,
  onSelectItem,
  isFocused = false,
  title = 'STEPS',
  emptyText = 'Waiting for steps…',
}: ListPanelProps): React.ReactElement {
  const entries: ListItem[] = Object.values(items);

  // Internal selection index for keyboard navigation
  const [selIdx, setSelIdx] = useState<number>(() => {
    if (selectedItemId) {
      const idx = entries.findIndex((item) => item.id === selectedItemId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // Sync selIdx with selectedItemId prop changes
  useEffect(() => {
    if (selectedItemId) {
      const idx = entries.findIndex((item) => item.id === selectedItemId);
      if (idx >= 0) setSelIdx(idx);
    }
  }, [selectedItemId, entries.length]);

  // Keep a scrolling window: show the last (height - 2) entries, always
  // including the current item.
  const maxVisible: number = Math.max(1, height - 2);
  let visible: ListItem[] = entries;
  if (entries.length > maxVisible) {
    const currentIdx = entries.findIndex((item) => item.id === currentItemId);
    const end = Math.max(currentIdx + 1, maxVisible);
    const start = Math.max(0, end - maxVisible);
    visible = entries.slice(start, end);
  }

  useInput(
    (input: string, key: Key) => {
      if (entries.length === 0) return;

      if (key.downArrow || input === 'j') {
        const next = Math.min(selIdx + 1, entries.length - 1);
        setSelIdx(next);
        onSelectItem?.(entries[next]?.id);
      } else if (key.upArrow || input === 'k') {
        const prev = Math.max(selIdx - 1, 0);
        setSelIdx(prev);
        onSelectItem?.(entries[prev]?.id);
      }
    },
    { isActive: isFocused }
  );

  const labelWidth: number = Math.max(8, width - 12);
  const currentSelId: string | null = entries[selIdx]?.id ?? selectedItemId;

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
    visible.length === 0
      ? React.createElement(Text, { color: 'gray', dimColor: true }, emptyText)
      : null,
    ...visible.map((item) => {
      const isActive: boolean = item.id === currentItemId;
      const isSelected: boolean = isFocused && item.id === currentSelId;
      const icon: string = formatStepIcon(item.status);
      const color: string = statusColor(item.status);
      const durationStr: string =
        item.status === 'done' && item.duration != null
          ? formatDuration(item.duration)
          : item.status === 'running'
            ? '…'
            : '';

      const label: string =
        item.name.length > labelWidth
          ? `${item.name.slice(0, labelWidth - 1)}…`
          : item.name.padEnd(labelWidth);

      const cursor: string = isSelected ? '>' : ' ';

      return React.createElement(
        Box,
        { key: item.id, flexDirection: 'row', gap: 1 },
        React.createElement(Text, { color: isSelected ? 'cyan' : 'gray' }, cursor),
        React.createElement(Text, null, icon),
        React.createElement(
          Text,
          {
            color: isSelected ? 'cyan' : color,
            bold: isActive || isSelected,
            dimColor: item.status === 'pending' && !isSelected,
          },
          label
        ),
        React.createElement(Text, { color: 'gray', dimColor: true }, durationStr)
      );
    })
  );
}

/** @deprecated Use {@link ListPanel} instead */
export { ListPanel as StepsPanel };

export default ListPanel;
