/**
 * @fileoverview Shared async-status helpers for Ink components
 * @module helpers/status
 *
 * Centralizes status checks and display labels used by the status-aware badge,
 * chronometer, and status bar components.
 *
 * @version 1.4.0
 * @since 2026-04-29
 */
// ── Status predicates ──────────────────────────────────────────────────────────
/** Returns whether the status should animate a spinner or running timer. */
export function isActivePanelStatus(status) {
    return status === 'loading' || status === 'streaming';
}
/** Returns whether the status should render a visible badge at all. */
export function shouldRenderStatusBadge(status) {
    return (status === 'done' ||
        status === 'error' ||
        isActivePanelStatus(status));
}
// ── Labels ─────────────────────────────────────────────────────────────────────
/** Returns the display label for an active async status. */
export function getActiveStatusLabel(status) {
    return status === 'streaming' ? 'Streaming…' : 'Loading…';
}
//# sourceMappingURL=status.js.map