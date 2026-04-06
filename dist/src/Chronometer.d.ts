/**
 * @fileoverview Chronometer component — elapsed-time display with start/stop/reset controls
 * @module components/Chronometer
 *
 * Renders a bordered panel showing a running elapsed time. Keyboard controls
 * (space to start/stop, r to reset) are active only when the component is focused.
 * Time display is delegated to the shared `formatDuration` helper.
 *
 * @version 1.1.9
 * @since 2026-04-05
 */
import React from 'react';
/** Running state of a {@link Chronometer}. */
export type ChronometerStatus = 'idle' | 'running' | 'stopped';
/** Props for {@link Chronometer}. */
export interface ChronometerProps {
    /** Panel width in terminal columns. */
    width: number;
    /** Whether this component holds keyboard focus (default: false). */
    isFocused?: boolean;
    /** Header label at the top of the panel (default: 'CHRONOMETER'). */
    title?: string;
    /** Initial elapsed milliseconds when the component mounts (default: 0). */
    initialElapsedMs?: number;
    /** Whether to render the surrounding border (default: true). */
    showBorder?: boolean;
    /** Callback fired on every tick (~100 ms) with the current elapsed ms. */
    onTick?: (elapsedMs: number) => void;
    /** Callback fired when the chronometer transitions to 'stopped'. */
    onStop?: (elapsedMs: number) => void;
    /** Callback fired when the chronometer resets. */
    onReset?: () => void;
}
/**
 * Elapsed-time display with start, stop, and reset keyboard controls.
 *
 * @param props - {@link ChronometerProps}
 */
export declare function Chronometer({ width, isFocused, title, initialElapsedMs, showBorder, onTick, onStop, onReset, }: ChronometerProps): React.ReactElement;
export default Chronometer;
//# sourceMappingURL=Chronometer.d.ts.map