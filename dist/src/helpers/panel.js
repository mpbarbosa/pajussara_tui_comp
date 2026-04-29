/**
 * @fileoverview Shared layout helpers for list-style Ink panels
 * @module helpers/panel
 *
 * Provides reusable selection, viewport, and fixed-width label helpers used by
 * multiple scrollable panel components.
 *
 * @version 1.4.0
 * @since 2026-04-29
 */
// ── Selection helpers ──────────────────────────────────────────────────────────
/** Moves a selection index by one step while keeping it inside valid bounds. */
export function getBoundedSelectionIndex(currentIndex, itemCount, delta) {
    if (itemCount <= 0) {
        return 0;
    }
    return Math.min(itemCount - 1, Math.max(0, currentIndex + delta));
}
// ── Viewport helpers ───────────────────────────────────────────────────────────
/** Returns a scrolling window that keeps the anchor item visible. */
export function getVisibleWindow(items, maxVisible, anchorIndex) {
    const safeMaxVisible = Math.max(1, maxVisible);
    if (items.length <= safeMaxVisible) {
        return [...items];
    }
    const safeAnchorIndex = Math.max(0, anchorIndex);
    // Bottom-anchor: anchor sits at the last visible row. When anchor is at the
    // very top (index 0), fill the viewport from the start instead of showing
    // only a single item.
    const end = safeAnchorIndex === 0
        ? Math.min(items.length, safeMaxVisible)
        : safeAnchorIndex + 1;
    const start = Math.max(0, end - safeMaxVisible);
    return items.slice(start, end);
}
// ── Text helpers ───────────────────────────────────────────────────────────────
/** Truncates text with an ellipsis or pads it to a fixed display width. */
export function formatFixedWidthLabel(label, width) {
    const safeWidth = Math.max(1, width);
    if (label.length > safeWidth) {
        return `${label.slice(0, safeWidth - 1)}…`;
    }
    return label.padEnd(safeWidth);
}
//# sourceMappingURL=panel.js.map