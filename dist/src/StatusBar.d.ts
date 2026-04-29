/**
 * @fileoverview StatusBar component — keybinding hints with optional async status badge
 * @module components/StatusBar
 *
 * Renders a bottom status bar with keybinding hints on the left and, when the
 * async `status` is active, a compact {@link StatusChronometer} on the right.
 * This is adapted from ai_workflow.js so it fits pajussara_tui_comp's generic
 * component API and local type/export conventions.
 *
 * @version 1.4.0
 * @since 2026-04-12
 */
import React from 'react';
import type { PanelStatus } from './types.js';
/** Single keybinding hint rendered by {@link StatusBar}. */
export interface StatusBarHint {
    /** Shortcut key label, e.g. `q` or `Tab`. */
    key: string;
    /** Human-readable action label. */
    label: string;
}
/** Props for {@link StatusBar}. */
export interface StatusBarProps {
    /** Normal-state hints rendered on the left side of the bar. */
    hints?: readonly StatusBarHint[];
    /** Replacement hints shown when `isComplete` is true. */
    completeHints?: readonly StatusBarHint[];
    /** Whether the surrounding workflow/task is complete. */
    isComplete?: boolean;
    /** Async status driving the badge/chronometer on the right. */
    status?: PanelStatus;
    /** Optional error message shown when `status === 'error'`. */
    errorMessage?: string | null;
    /** Total terminal width used to budget the chronometer width. */
    width?: number;
}
/**
 * Keybinding status bar with optional right-aligned async activity indicator.
 *
 * @param props - {@link StatusBarProps}
 */
export declare function StatusBar({ hints, completeHints, isComplete, status, errorMessage, width, }: StatusBarProps): React.ReactElement;
export default StatusBar;
//# sourceMappingURL=StatusBar.d.ts.map