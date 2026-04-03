/**
 * @fileoverview StreamViewer — live AI token stream panel
 * @module components/StreamViewer
 *
 * Displays real-time AI token output as it streams from an AI provider.
 * Shows a header (step + persona), scrollable live token body, a token-rate
 * footer, and allows history navigation with [ / ] keys.
 *
 * Only rendered when the TUI is started with --verbose or the user presses `v`.
 *
 * Architecture: v2.0.0 Pattern
 * - Pure display logic only; all state lives in the parent (streamChunks prop)
 * - This component is the impure boundary (keyboard input)
 *
 * @version 1.1.6
 * @since 2026-03-10
 */
import React from 'react';
/** Shape of a single completed stream entry stored in history. */
export interface StreamHistoryEntry {
    stepId: string | null;
    stepName: string | null;
    persona: string | null;
    fullText: string;
    tokenCount: number;
    tokensPerSec: number;
}
/** Live + historical stream state consumed by {@link StreamViewer}. */
export interface StreamState {
    liveText: string;
    stepId: string | null;
    stepName: string | null;
    persona: string | null;
    tokenCount: number;
    tokensPerSec: number;
    history: StreamHistoryEntry[];
}
/** Props for {@link StreamViewer}. */
export interface StreamViewerProps {
    /** Live and historical AI stream state. */
    streamChunks: StreamState;
    /** Render width in terminal columns. */
    width: number;
    /** Render height in terminal rows (including border). Defaults to `12`. */
    height?: number;
    /** Whether this panel has keyboard focus. Defaults to `false`. */
    isFocused?: boolean;
}
/**
 * Wraps a long string into lines of at most `maxWidth` characters.
 *
 * @param text - The string to wrap.
 * @param maxWidth - Maximum line width in characters.
 * @returns Array of wrapped lines.
 */
export declare function wrapText(text: string, maxWidth: number): string[];
/**
 * Live AI token stream panel for Ink TUI applications.
 *
 * Renders a bordered panel displaying real-time AI output with history
 * navigation. Press `[` to go back through completed step responses and `]`
 * to return toward the live stream.
 */
export declare function StreamViewer({ streamChunks, width, height, isFocused, }: StreamViewerProps): React.JSX.Element;
export default StreamViewer;
//# sourceMappingURL=StreamViewer.d.ts.map