/**
 * @fileoverview ListPanel component — scrollable, keyboard-navigable list panel
 * @module components/ListPanel
 *
 * Renders a bordered list of items with status icons and elapsed durations.
 * The currently-active item is highlighted. Supports keyboard selection
 * (↑/↓ or k/j) and mouse click to select an item.
 *
 * @version 1.1.2
 * @since 2026-03-07
 */
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { formatStepIcon, statusColor, formatDuration } from '../helpers/index.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Scrollable, keyboard-navigable list panel for Ink TUI applications.
 *
 * @param props - {@link ListPanelProps}
 */
export function ListPanel({ items, currentItemId, width, height = 20, selectedItemId = null, onSelectItem, isFocused = false, title = 'STEPS', emptyText = 'Waiting for steps…', }) {
    const entries = Object.values(items);
    // Internal selection index for keyboard navigation
    const [selIdx, setSelIdx] = useState(() => {
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
            if (idx >= 0)
                setSelIdx(idx);
        }
    }, [selectedItemId, entries.length]);
    // Keep a scrolling window: show the last (height - 2) entries, always
    // including the current item.
    const maxVisible = Math.max(1, height - 2);
    let visible = entries;
    if (entries.length > maxVisible) {
        const currentIdx = entries.findIndex((item) => item.id === currentItemId);
        const end = Math.max(currentIdx + 1, maxVisible);
        const start = Math.max(0, end - maxVisible);
        visible = entries.slice(start, end);
    }
    useInput((input, key) => {
        if (entries.length === 0)
            return;
        if (key.downArrow || input === 'j') {
            const next = Math.min(selIdx + 1, entries.length - 1);
            setSelIdx(next);
            onSelectItem?.(entries[next]?.id);
        }
        else if (key.upArrow || input === 'k') {
            const prev = Math.max(selIdx - 1, 0);
            setSelIdx(prev);
            onSelectItem?.(entries[prev]?.id);
        }
    }, { isActive: isFocused });
    const labelWidth = Math.max(8, width - 12);
    const currentSelId = entries[selIdx]?.id ?? selectedItemId;
    return React.createElement(Box, {
        flexDirection: 'column',
        borderStyle: 'single',
        borderColor: isFocused ? 'white' : 'gray',
        width,
        paddingX: 1,
    }, React.createElement(Text, { bold: true, color: 'white', dimColor: !isFocused }, title), visible.length === 0
        ? React.createElement(Text, { color: 'gray', dimColor: true }, emptyText)
        : null, ...visible.map((item) => {
        const isActive = item.id === currentItemId;
        const isSelected = isFocused && item.id === currentSelId;
        const icon = formatStepIcon(item.status);
        const color = statusColor(item.status);
        const durationStr = item.status === 'done' && item.duration != null
            ? formatDuration(item.duration)
            : item.status === 'running'
                ? '…'
                : '';
        const label = item.name.length > labelWidth
            ? `${item.name.slice(0, labelWidth - 1)}…`
            : item.name.padEnd(labelWidth);
        const cursor = isSelected ? '>' : ' ';
        return React.createElement(Box, { key: item.id, flexDirection: 'row', gap: 1 }, React.createElement(Text, { color: isSelected ? 'cyan' : 'gray' }, cursor), React.createElement(Text, null, icon), React.createElement(Text, {
            color: isSelected ? 'cyan' : color,
            bold: isActive || isSelected,
            dimColor: item.status === 'pending' && !isSelected,
        }, label), React.createElement(Text, { color: 'gray', dimColor: true }, durationStr));
    }));
}
/** @deprecated Use {@link ListPanel} instead */
export { ListPanel as StepsPanel };
export default ListPanel;
//# sourceMappingURL=ListPanel.js.map