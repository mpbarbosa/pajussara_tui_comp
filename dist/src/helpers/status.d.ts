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
import type { PanelStatus } from '../types.js';
/** Statuses that animate and drive running chronometers. */
export type ActivePanelStatus = Extract<PanelStatus, 'loading' | 'streaming'>;
/** Returns whether the status should animate a spinner or running timer. */
export declare function isActivePanelStatus(status: PanelStatus): status is ActivePanelStatus;
/** Returns whether the status should render a visible badge at all. */
export declare function shouldRenderStatusBadge(status: PanelStatus): boolean;
/** Returns the display label for an active async status. */
export declare function getActiveStatusLabel(status: ActivePanelStatus): string;
//# sourceMappingURL=status.d.ts.map