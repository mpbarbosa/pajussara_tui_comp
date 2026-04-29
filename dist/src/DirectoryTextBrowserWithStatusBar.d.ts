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
import { type DirectoryTextBrowserProps } from './DirectoryTextBrowser.js';
import { type StatusBarProps } from './StatusBar.js';
/** Props for {@link DirectoryTextBrowserWithStatusBar}. */
export interface DirectoryTextBrowserWithStatusBarProps extends DirectoryTextBrowserProps {
    /** Optional props forwarded to the bottom status bar; `width` is derived. */
    statusBarProps?: Omit<StatusBarProps, 'width'>;
    /** Vertical gap between the browser and the status bar (default: `0`). */
    statusBarGap?: number;
}
/**
 * Two-pane directory/text browser with a composed bottom status bar.
 *
 * @param props - {@link DirectoryTextBrowserWithStatusBarProps}
 */
export declare function DirectoryTextBrowserWithStatusBar({ statusBarProps, statusBarGap, ...browserProps }: DirectoryTextBrowserWithStatusBarProps): React.ReactElement;
export default DirectoryTextBrowserWithStatusBar;
//# sourceMappingURL=DirectoryTextBrowserWithStatusBar.d.ts.map