/**
 * @fileoverview StatusBadge component — animated spinner / completion / error indicator
 * @module components/StatusBadge
 *
 * Used by async and streaming panels to show:
 *   ⠋ Loading…   (idle / loading)
 *   ⠋ Streaming… (streaming)
 *   ✓ Done       (done)
 *   ✗ <message>  (error)
 *
 * @version 1.0.0
 * @since 2026-04-05
 */
import React from 'react';
import type { PanelStatus } from './types.js';
/** Props for {@link StatusBadge}. */
export interface StatusBadgeProps {
    /** Current panel status driving the visual indicator. */
    status: PanelStatus;
    /** Error message shown when status === 'error'. */
    errorMessage?: string;
}
export declare function StatusBadge({ status, errorMessage }: StatusBadgeProps): React.ReactElement;
export default StatusBadge;
//# sourceMappingURL=status_badge.d.ts.map