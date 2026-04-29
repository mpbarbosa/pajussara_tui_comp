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

// ── Types ─────────────────────────────────────────────────────────────────────

/** Statuses that animate and drive running chronometers. */
export type ActivePanelStatus = Extract<PanelStatus, 'loading' | 'streaming'>;

// ── Status predicates ──────────────────────────────────────────────────────────

/** Returns whether the status should animate a spinner or running timer. */
export function isActivePanelStatus(status: PanelStatus): status is ActivePanelStatus {
  return status === 'loading' || status === 'streaming';
}

/** Returns whether the status should render a visible badge at all. */
export function shouldRenderStatusBadge(status: PanelStatus): boolean {
  return (
    status === 'done' ||
    status === 'error' ||
    isActivePanelStatus(status)
  );
}

// ── Labels ─────────────────────────────────────────────────────────────────────

/** Returns the display label for an active async status. */
export function getActiveStatusLabel(status: ActivePanelStatus): string {
  return status === 'streaming' ? 'Streaming…' : 'Loading…';
}
