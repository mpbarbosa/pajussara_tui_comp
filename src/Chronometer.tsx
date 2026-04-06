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
import { Box, Text, useInput, Key } from 'ink';
import { formatDuration } from '../helpers/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

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
  /** Whether to render the header label (default: true). */
  showLabel?: boolean;
  /** Whether to render the keyboard-hints bar at the bottom (default: true). */
  showHints?: boolean;
  /**
   * External running-state override. When `true` the chronometer starts
   * automatically; when `false` it stops if currently running. Leave
   * `undefined` (default) to keep fully manual keyboard control.
   */
  forceRunning?: boolean;
  /** Callback fired on every tick (~100 ms) with the current elapsed ms. */
  onTick?: (elapsedMs: number) => void;
  /** Callback fired when the chronometer transitions to 'stopped'. */
  onStop?: (elapsedMs: number) => void;
  /** Callback fired when the chronometer resets. */
  onReset?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Elapsed-time display with start, stop, and reset keyboard controls.
 *
 * @param props - {@link ChronometerProps}
 */
export function Chronometer({
  width,
  isFocused = false,
  title = 'CHRONOMETER',
  initialElapsedMs = 0,
  showBorder = true,
  showLabel = true,
  showHints = true,
  forceRunning,
  onTick,
  onStop,
  onReset,
}: ChronometerProps): React.ReactElement {
  const [elapsedMs, setElapsedMs] = useState<number>(initialElapsedMs);
  // Derive initial running state from forceRunning so mount-time forceRunning:true
  // works correctly even before effects have a chance to fire.
  const [status, setStatus] = useState<ChronometerStatus>(() =>
    forceRunning === true ? 'running' : 'idle'
  );

  // Tick interval — only active while running
  useEffect(() => {
    if (status !== 'running') return;

    const id = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 100;
        onTick?.(next);
        return next;
      });
    }, 100);

    return (): void => clearInterval(id);
  }, [status]);

  // External running-state override
  useEffect(() => {
    if (forceRunning === undefined) return;
    if (forceRunning) {
      setStatus('running');
    } else {
      setStatus((prev) => (prev === 'running' ? 'stopped' : prev));
    }
  }, [forceRunning]);

  useInput(
    (_input: string, key: Key) => {
      if (key.return) return; // ignore Enter

      if (_input === ' ') {
        if (status === 'running') {
          setStatus('stopped');
          onStop?.(elapsedMs);
        } else {
          // idle or stopped → running
          setStatus('running');
        }
      } else if (_input === 'r') {
        setElapsedMs(0);
        setStatus('idle');
        onReset?.();
      }
    },
    { isActive: isFocused }
  );

  const timeColor: string =
    status === 'running' ? 'cyan' : status === 'stopped' ? 'green' : 'gray';

  const borderProps = showBorder
    ? ({ borderStyle: 'single', borderColor: isFocused ? 'white' : 'gray' } as const)
    : {};

  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      ...borderProps,
      width,
      paddingX: 1,
    },
    showLabel
      ? React.createElement(Text, { bold: true, color: 'white', dimColor: !isFocused }, title)
      : null,
    React.createElement(
      Text,
      { color: timeColor, bold: status === 'running' },
      formatDuration(elapsedMs)
    ),
    showHints
      ? React.createElement(
          Text,
          { color: 'gray', dimColor: true },
          '[space] start/stop  [r] reset'
        )
      : null
  );
}

export default Chronometer;
