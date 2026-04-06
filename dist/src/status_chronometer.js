/**
 * @fileoverview StatusChronometer component — StatusBadge and Chronometer displayed side by side
 * @module components/StatusChronometer
 *
 * Renders a horizontal row with a {@link StatusBadge} on the left and a
 * {@link Chronometer} panel on the right. Keyboard controls (space / r) are
 * forwarded to the Chronometer and are only active when `isFocused` is true.
 * When `syncWithStatus` is true the chronometer starts and stops automatically
 * in response to the `status` prop changing.
 *
 * @version 1.1.9
 * @since 2026-04-05
 */
import React from 'react';
import { Box } from 'ink';
import { StatusBadge } from './status_badge.js';
import { Chronometer } from './Chronometer.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Composed component that places a {@link StatusBadge} and a {@link Chronometer}
 * side by side in a horizontal row.
 *
 * The badge reflects an externally-controlled `status` (e.g. a loading or
 * streaming operation), while the chronometer independently tracks elapsed time
 * via its own internal state.
 *
 * @param props - {@link StatusChronometerProps}
 */
export function StatusChronometer({ status, errorMessage, syncWithStatus = false, ...chronometerProps }) {
    // When syncWithStatus is active it drives forceRunning from status;
    // otherwise the caller's forceRunning prop (if any) is passed through.
    const forceRunning = syncWithStatus
        ? status === 'loading' || status === 'streaming'
        : chronometerProps.forceRunning;
    return (React.createElement(Box, { flexDirection: "row", alignItems: "center", gap: 1 },
        React.createElement(StatusBadge, { status: status, errorMessage: errorMessage }),
        React.createElement(Chronometer, { ...chronometerProps, forceRunning: forceRunning })));
}
export default StatusChronometer;
//# sourceMappingURL=status_chronometer.js.map