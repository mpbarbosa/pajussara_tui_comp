/**
 * @fileoverview TextListPanel component — ListPanel-backed text list
 * @module components/TextListPanel
 *
 * Adapts plain text entries into the status-aware {@link ListPanel} API so the
 * same scrolling, highlighting, and keyboard navigation behavior can be reused
 * for textual content.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */
import React from 'react';
import type { ListPanelProps } from './ListPanel.js';
/** Shape of a single text entry displayed by {@link TextListPanel}. */
export interface TextListItem {
    /** Stable identifier for keyboard selection and controlled focus. */
    id: string;
    /** Text rendered for the row. */
    text: string;
    /** Visual status forwarded to {@link ListPanel} (default: `'pending'`). */
    status?: string;
    /** Optional elapsed duration shown when `status === 'done'`. */
    duration?: number | null;
}
/** Props for {@link TextListPanel}. */
export interface TextListPanelProps extends Omit<ListPanelProps, 'items' | 'currentItemId' | 'selectedItemId' | 'onSelectItem'> {
    /** Text entries displayed by the panel. */
    items: TextListItem[];
    /** ID of the currently active text entry, or `null`. */
    currentTextItemId?: string | null;
    /** ID of the externally-controlled selected text entry, or `null`. */
    selectedTextItemId?: string | null;
    /** Fired when the user moves the selection to a new text entry. */
    onSelectTextItem?: (id: string) => void;
}
/**
 * ListPanel-backed text browser for Ink TUI applications.
 *
 * @param props - {@link TextListPanelProps}
 */
export declare function TextListPanel({ items, currentTextItemId, selectedTextItemId, onSelectTextItem, width, height, isFocused, title, emptyText, }: TextListPanelProps): React.ReactElement;
export default TextListPanel;
//# sourceMappingURL=TextListPanel.d.ts.map