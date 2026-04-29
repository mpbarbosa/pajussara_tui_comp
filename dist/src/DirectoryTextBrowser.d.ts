/**
 * @fileoverview DirectoryTextBrowser component — DirectoryPanel and TextListPanel side by side
 * @module components/DirectoryTextBrowser
 *
 * Renders a two-pane browser with a directory navigator on the left and a
 * ListPanel-backed text view on the right. Focus can be moved between panes
 * with Tab, ← / h, and → / l.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */
import React from 'react';
import type { TextListItem } from './TextListPanel.js';
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
/**
 * Two-pane browser that combines {@link DirectoryPanel} and
 * {@link TextListPanel} into a single focused layout.
 *
 * @param props - {@link DirectoryTextBrowserProps}
 */
export declare function DirectoryTextBrowser({ directoryPath, getTextItems, width, height, directoryPanelWidth, gap, selectedDirectoryPath, onSelectDirectory, currentTextItemId, selectedTextItemId, onSelectTextItem, focusedPane, initialFocusedPane, onFocusPaneChange, directoryTitle, directoryLoadingText, directoryEmptyText, textTitle, textEmptyText, textPlaceholderText, }: DirectoryTextBrowserProps): React.ReactElement;
export default DirectoryTextBrowser;
//# sourceMappingURL=DirectoryTextBrowser.d.ts.map