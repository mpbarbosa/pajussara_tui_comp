/**
 * @fileoverview Demo — StatusBar lifecycle with manual and automatic state changes
 * @module demo/statusbar-lifecycle
 *
 * Interactive demo of the StatusBar component. It shows custom keybinding hints
 * on the left and cycles through loading, streaming, error, and done states on
 * the right so the embedded async badge/chronometer can be inspected in motion.
 * Press 1-5 to set a specific status, c to toggle complete mode, a to pause or
 * resume autoplay, r to restart the cycle, and q to quit.
 *
 * Run with:
 *   npx tsx demos/statusbar-lifecycle.tsx
 *
 * @version 1.4.0
 * @since 2026-04-12
 */

import React, { useEffect, useMemo, useState } from 'react';
import { fileURLToPath } from 'node:url';
import { render, Box, Text, useApp, useInput } from 'ink';
import { StatusBar } from '../src/StatusBar.js';
import type { StatusBarHint } from '../src/StatusBar.js';
import type { PanelStatus } from '../src/types.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_SEQUENCE: readonly PanelStatus[] = [
  'loading',
  'streaming',
  'error',
  'loading',
  'streaming',
  'done',
];

const AUTOPLAY_MS = 2200;

const ACTIVE_HINTS: readonly StatusBarHint[] = [
  { key: '1-5', label: 'Status' },
  { key: 'c', label: 'Complete' },
  { key: 'a', label: 'Autoplay' },
  { key: 'r', label: 'Restart' },
  { key: 'q', label: 'Quit' },
];

const COMPLETE_HINTS: readonly StatusBarHint[] = [
  { key: 'r', label: 'Replay' },
  { key: 'q', label: 'Exit' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function describeStatus(status: PanelStatus): string {
  switch (status) {
    case 'idle':
      return 'Idle — the right-side badge is hidden until async work starts.';
    case 'loading':
      return 'Loading — the chronometer starts and the badge shows a spinner.';
    case 'streaming':
      return 'Streaming — active work continues with a different live label.';
    case 'error':
      return 'Error — the badge switches to the error state and shows the message.';
    case 'done':
      return 'Done — the timer stops and the badge settles into the finished state.';
  }
}

function nextSequenceStatus(stepIndex: number): PanelStatus {
  return STATUS_SEQUENCE[stepIndex] ?? 'done';
}

// ── App ───────────────────────────────────────────────────────────────────────

export function StatusBarDemo(): React.ReactElement {
  const { exit } = useApp();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [status, setStatus] = useState<PanelStatus>(STATUS_SEQUENCE[0]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    'Network timeout while waiting for the upstream worker.',
  );

  useEffect(() => {
    if (!isAutoplayEnabled || status === 'done') {
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((previousStepIndex) => {
        const nextStepIndex = Math.min(previousStepIndex + 1, STATUS_SEQUENCE.length - 1);
        const nextStatus = nextSequenceStatus(nextStepIndex);

        setStatus(nextStatus);
        setIsComplete(nextStatus === 'done');
        setErrorMessage(
          nextStatus === 'error'
            ? 'Network timeout while waiting for the upstream worker.'
            : null,
        );

        return nextStepIndex;
      });
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [isAutoplayEnabled, status]);

  useInput((input: string) => {
    if (input === 'q') {
      exit();
      return;
    }

    if (input === 'a') {
      setIsAutoplayEnabled((previousValue) => !previousValue);
      return;
    }

    if (input === 'c') {
      setIsComplete((previousValue) => !previousValue);
      return;
    }

    if (input === 'r') {
      setStepIndex(0);
      setStatus(STATUS_SEQUENCE[0]);
      setIsComplete(false);
      setIsAutoplayEnabled(true);
      setErrorMessage('Network timeout while waiting for the upstream worker.');
      return;
    }

    const manualStatusMap: Record<string, PanelStatus> = {
      '1': 'idle',
      '2': 'loading',
      '3': 'streaming',
      '4': 'error',
      '5': 'done',
    };

    const nextStatus = manualStatusMap[input];

    if (!nextStatus) {
      return;
    }

    setStatus(nextStatus);
    setIsComplete(nextStatus === 'done');
    setIsAutoplayEnabled(false);
    setErrorMessage(
      nextStatus === 'error'
        ? 'Network timeout while waiting for the upstream worker.'
        : null,
    );
  });

  const modeLabel = useMemo(
    () => (isAutoplayEnabled ? `Autoplay every ${AUTOPLAY_MS} ms` : 'Manual mode'),
    [isAutoplayEnabled],
  );

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'white' },
      'StatusBar Demo  ·  1 idle  2 loading  3 streaming  4 error  5 done  ·  c complete  ·  a autoplay  ·  r restart  ·  q quit',
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(
      Text,
      { color: 'cyan' },
      `State: ${status}  ·  ${modeLabel}  ·  complete hints: ${isComplete ? 'on' : 'off'}`,
    ),
    React.createElement(
      Text,
      { color: status === 'error' ? 'red' : 'gray' },
      describeStatus(status),
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(StatusBar, {
      hints: ACTIVE_HINTS,
      completeHints: COMPLETE_HINTS,
      isComplete,
      status,
      errorMessage,
      width: 92,
    }),
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  render(React.createElement(StatusBarDemo, null));
}
