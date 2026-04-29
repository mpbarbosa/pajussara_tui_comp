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
import React, { useMemo, useState } from 'react';
import { Box, useInput } from 'ink';
import { DirectoryPanel } from './DirectoryPanel.js';
import { TextListPanel } from './TextListPanel.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Two-pane browser that combines {@link DirectoryPanel} and
 * {@link TextListPanel} into a single focused layout.
 *
 * @param props - {@link DirectoryTextBrowserProps}
 */
export function DirectoryTextBrowser({ directoryPath, getTextItems, width, height = 20, directoryPanelWidth, gap = 1, selectedDirectoryPath, onSelectDirectory, currentTextItemId = null, selectedTextItemId = null, onSelectTextItem, focusedPane, initialFocusedPane = 'directories', onFocusPaneChange, directoryTitle = 'FOLDERS', directoryLoadingText = 'Loading folders…', directoryEmptyText = 'No folders found.', textTitle = 'TEXT', textEmptyText = 'No text items for this directory.', textPlaceholderText = 'Select a directory to view its text items.', }) {
    const [internalSelectedDirectoryPath, setInternalSelectedDirectoryPath] = useState(selectedDirectoryPath ?? null);
    const [internalFocusedPane, setInternalFocusedPane] = useState(focusedPane ?? initialFocusedPane);
    const currentSelectedDirectoryPath = selectedDirectoryPath ?? internalSelectedDirectoryPath;
    const currentFocusedPane = focusedPane ?? internalFocusedPane;
    const resolvedGap = Math.max(1, gap);
    const minPanelWidth = 18;
    const maxDirectoryWidth = Math.max(minPanelWidth, width - resolvedGap - minPanelWidth);
    const preferredDirectoryWidth = directoryPanelWidth ?? Math.floor((width - resolvedGap) * 0.4);
    const resolvedDirectoryWidth = Math.min(maxDirectoryWidth, Math.max(minPanelWidth, preferredDirectoryWidth));
    const resolvedTextWidth = Math.max(minPanelWidth, width - resolvedGap - resolvedDirectoryWidth);
    const textItems = useMemo(() => getTextItems(currentSelectedDirectoryPath), [currentSelectedDirectoryPath, getTextItems]);
    function updateFocusedPane(nextPane) {
        if (focusedPane === undefined) {
            setInternalFocusedPane(nextPane);
        }
        onFocusPaneChange?.(nextPane);
    }
    function handleSelectDirectory(nextDirectoryPath) {
        if (selectedDirectoryPath === undefined) {
            setInternalSelectedDirectoryPath(nextDirectoryPath);
        }
        onSelectDirectory?.(nextDirectoryPath);
    }
    useInput((input, key) => {
        if (key.tab) {
            updateFocusedPane(currentFocusedPane === 'directories' ? 'text' : 'directories');
            return;
        }
        if (key.rightArrow || input === 'l') {
            updateFocusedPane('text');
        }
        else if (key.leftArrow || input === 'h') {
            updateFocusedPane('directories');
        }
    });
    return React.createElement(Box, { flexDirection: 'row', gap: resolvedGap }, React.createElement(DirectoryPanel, {
        directoryPath,
        width: resolvedDirectoryWidth,
        height,
        selectedDirectoryPath: currentSelectedDirectoryPath,
        onSelectDirectory: handleSelectDirectory,
        isFocused: currentFocusedPane === 'directories',
        title: directoryTitle,
        loadingText: directoryLoadingText,
        emptyText: directoryEmptyText,
    }), React.createElement(TextListPanel, {
        items: textItems,
        width: resolvedTextWidth,
        height,
        currentTextItemId,
        selectedTextItemId,
        onSelectTextItem,
        isFocused: currentFocusedPane === 'text',
        title: textTitle,
        emptyText: currentSelectedDirectoryPath ? textEmptyText : textPlaceholderText,
    }));
}
export default DirectoryTextBrowser;
//# sourceMappingURL=DirectoryTextBrowser.js.map