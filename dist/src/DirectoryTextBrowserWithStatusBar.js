/**
 * @fileoverview DirectoryTextBrowserWithStatusBar component — browser layout with bottom status bar
 * @module components/DirectoryTextBrowserWithStatusBar
 *
 * Composes {@link DirectoryTextBrowser} with a bottom-aligned {@link StatusBar}
 * so callers can render the two-pane directory/text browser together with
 * keyboard hints and async status feedback.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */
import React from 'react';
import { Box } from 'ink';
import { DirectoryTextBrowser, } from './DirectoryTextBrowser.js';
import { StatusBar } from './StatusBar.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Two-pane directory/text browser with a composed bottom status bar.
 *
 * @param props - {@link DirectoryTextBrowserWithStatusBarProps}
 */
export function DirectoryTextBrowserWithStatusBar({ statusBarProps, statusBarGap = 0, ...browserProps }) {
    return React.createElement(Box, {
        flexDirection: 'column',
        gap: Math.max(0, statusBarGap),
    }, React.createElement(DirectoryTextBrowser, browserProps), React.createElement(StatusBar, {
        width: browserProps.width,
        ...statusBarProps,
    }));
}
export default DirectoryTextBrowserWithStatusBar;
//# sourceMappingURL=DirectoryTextBrowserWithStatusBar.js.map