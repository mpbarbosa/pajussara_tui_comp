/**
 * @fileoverview TextListPanel component — ListPanel-backed text list
 * @module components/TextListPanel
 *
 * Adapts plain text entries into the status-aware {@link ListPanel} API so the
 * same scrolling, highlighting, and keyboard navigation behavior can be reused
 * for textual content.
 *
 * @version 1.2.2
 * @since 2026-04-12
 */
import React from 'react';
import { ListPanel } from './ListPanel.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * ListPanel-backed text browser for Ink TUI applications.
 *
 * @param props - {@link TextListPanelProps}
 */
export function TextListPanel({ items, currentTextItemId = null, selectedTextItemId = null, onSelectTextItem, width, height = 20, isFocused = false, title = 'TEXT', emptyText = 'No text items.', }) {
    const listItems = Object.fromEntries(items.map((item) => [
        item.id,
        {
            id: item.id,
            name: item.text,
            status: item.status ?? 'pending',
            duration: item.duration ?? null,
        },
    ]));
    return React.createElement(ListPanel, {
        items: listItems,
        currentItemId: currentTextItemId,
        selectedItemId: selectedTextItemId,
        onSelectItem: onSelectTextItem,
        width,
        height,
        isFocused,
        title,
        emptyText,
    });
}
export default TextListPanel;
//# sourceMappingURL=TextListPanel.js.map