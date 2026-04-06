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
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { formatDuration } from '../helpers/index.js';
// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Elapsed-time display with start, stop, and reset keyboard controls.
 *
 * @param props - {@link ChronometerProps}
 */
export function Chronometer({ width, isFocused = false, title = 'CHRONOMETER', initialElapsedMs = 0, showBorder = true, onTick, onStop, onReset, }) {
    const [elapsedMs, setElapsedMs] = useState(initialElapsedMs);
    const [status, setStatus] = useState('idle');
    // Tick interval — only active while running
    useEffect(() => {
        if (status !== 'running')
            return;
        const id = setInterval(() => {
            setElapsedMs((prev) => {
                const next = prev + 100;
                onTick?.(next);
                return next;
            });
        }, 100);
        return () => clearInterval(id);
    }, [status]);
    useInput((_input, key) => {
        if (key.return)
            return; // ignore Enter
        if (_input === ' ') {
            if (status === 'running') {
                setStatus('stopped');
                onStop?.(elapsedMs);
            }
            else {
                // idle or stopped → running
                setStatus('running');
            }
        }
        else if (_input === 'r') {
            setElapsedMs(0);
            setStatus('idle');
            onReset?.();
        }
    }, { isActive: isFocused });
    const timeColor = status === 'running' ? 'cyan' : status === 'stopped' ? 'green' : 'gray';
    const borderProps = showBorder
        ? { borderStyle: 'single', borderColor: isFocused ? 'white' : 'gray' }
        : {};
    return React.createElement(Box, {
        flexDirection: 'column',
        ...borderProps,
        width,
        paddingX: 1,
    }, React.createElement(Text, { bold: true, color: 'white', dimColor: !isFocused }, title), React.createElement(Text, { color: timeColor, bold: status === 'running' }, formatDuration(elapsedMs)), React.createElement(Text, { color: 'gray', dimColor: true }, '[space] start/stop  [r] reset'));
}
export default Chronometer;
//# sourceMappingURL=Chronometer.js.map