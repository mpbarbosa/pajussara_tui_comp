/**
 * StatusBadge — animated spinner / completion / error indicator.
 * @module ui/status_badge
 *
 * Used by async and streaming panels to show:
 *   ⠋ Loading…   (idle / loading)
 *   ⠋ Streaming… (streaming)
 *   ✓ Done       (done)
 *   ✗ <message>  (error)
 */
import React from 'react';
import type { PanelStatus } from './types.js';
export interface StatusBadgeProps {
    status: PanelStatus;
    /** Error message shown when status === 'error'. */
    errorMessage?: string;
}
export declare function StatusBadge({ status, errorMessage }: StatusBadgeProps): React.ReactElement;
export default StatusBadge;
//# sourceMappingURL=status_badge.d.ts.map