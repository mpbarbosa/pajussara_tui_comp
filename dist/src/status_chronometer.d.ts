/**
 * @fileoverview StatusChronometer component — StatusBadge and Chronometer displayed side by side
 * @module components/StatusChronometer
 *
 * Renders a horizontal row with a {@link StatusBadge} on the left and a
 * {@link Chronometer} panel on the right. Keyboard controls (space / r) are
 * forwarded to the Chronometer and are only active when `isFocused` is true.
 *
 * @version 1.0.0
 * @since 2026-04-05
 */
import React from 'react';
import type { StatusBadgeProps } from './status_badge.js';
import type { ChronometerProps } from './Chronometer.js';
/**
 * Props for {@link StatusChronometer}.
 *
 * Merges all {@link ChronometerProps} with the badge-specific props from
 * {@link StatusBadgeProps} (`status` and `errorMessage`).
 */
export interface StatusChronometerProps extends ChronometerProps, Pick<StatusBadgeProps, 'status' | 'errorMessage'> {
}
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
export declare function StatusChronometer({ status, errorMessage, ...chronometerProps }: StatusChronometerProps): React.ReactElement;
export default StatusChronometer;
//# sourceMappingURL=status_chronometer.d.ts.map