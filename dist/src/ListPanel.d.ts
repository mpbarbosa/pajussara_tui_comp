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
import React from 'react';
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
/**
 * Scrollable, keyboard-navigable list panel for Ink TUI applications.
 *
 * @param props - {@link ListPanelProps}
 */
export declare function ListPanel({ items, currentItemId, width, height, selectedItemId, onSelectItem, isFocused, title, emptyText, }: ListPanelProps): React.ReactElement;
/** @deprecated Use {@link ListPanel} instead */
export { ListPanel as StepsPanel };
export default ListPanel;
//# sourceMappingURL=ListPanel.d.ts.map