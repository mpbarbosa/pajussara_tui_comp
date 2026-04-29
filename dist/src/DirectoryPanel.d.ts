/**
 * @fileoverview DirectoryPanel component — scrollable, keyboard-navigable folder panel
 * @module components/DirectoryPanel
 *
 * Reads the folders from a filesystem path and renders them in a bordered Ink
 * panel. Supports keyboard selection (↑/↓ or k/j) and surfaces loading, empty,
 * and filesystem error states inline.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */
import React from 'react';
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
/**
 * Scrollable, keyboard-navigable directory panel for Ink TUI applications.
 *
 * @param props - {@link DirectoryPanelProps}
 */
export declare function DirectoryPanel({ directoryPath, width, height, selectedDirectoryPath, onSelectDirectory, isFocused, title, loadingText, emptyText, }: DirectoryPanelProps): React.ReactElement;
export default DirectoryPanel;
//# sourceMappingURL=DirectoryPanel.d.ts.map