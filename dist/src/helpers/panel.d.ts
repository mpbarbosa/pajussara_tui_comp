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
/** Moves a selection index by one step while keeping it inside valid bounds. */
export declare function getBoundedSelectionIndex(currentIndex: number, itemCount: number, delta: -1 | 1): number;
/** Returns a scrolling window that keeps the anchor item visible. */
export declare function getVisibleWindow<T>(items: readonly T[], maxVisible: number, anchorIndex: number): T[];
/** Truncates text with an ellipsis or pads it to a fixed display width. */
export declare function formatFixedWidthLabel(label: string, width: number): string;
//# sourceMappingURL=panel.d.ts.map