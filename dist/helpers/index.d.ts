/**
 * @fileoverview Shared display helpers for TUI components
 * @module helpers
 */
/** Maps a status string to a terminal icon character. */
export declare function formatStepIcon(status: string): string;
/** Maps a status string to an Ink color name. */
export declare function statusColor(status: string): string;
/**
 * Formats a duration (milliseconds) as a human-readable string.
 * e.g. 61500 → "1m 1s", 4500 → "4.5s"
 */
export declare function formatDuration(ms: number): string;
//# sourceMappingURL=index.d.ts.map