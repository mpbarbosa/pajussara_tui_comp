/**
 * @fileoverview Shared display helpers for TUI components
 * @module helpers
 */
/** Maps a status string to a terminal icon character. */
export function formatStepIcon(status) {
    switch (status) {
        case 'done': return '✔';
        case 'running': return '●';
        case 'error': return '✘';
        case 'pending': return '○';
        default: return '·';
    }
}
/** Maps a status string to an Ink color name. */
export function statusColor(status) {
    switch (status) {
        case 'done': return 'green';
        case 'running': return 'cyan';
        case 'error': return 'red';
        case 'pending': return 'gray';
        default: return 'white';
    }
}
/**
 * Formats a duration (milliseconds) as a human-readable string.
 * e.g. 61500 → "1m 1s", 4500 → "4.5s"
 */
export function formatDuration(ms) {
    if (ms >= 60000) {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}m ${s}s`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
}
//# sourceMappingURL=index.js.map