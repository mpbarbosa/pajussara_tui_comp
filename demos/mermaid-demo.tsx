/**
 * @fileoverview Demo — MermaidPanel terminal diagram rendering
 * @module demo/mermaid-demo
 *
 * Interactive demo of the MermaidPanel component. Press Tab to cycle focus
 * between the two diagram panels (a flowchart and a state machine). Use ↑/↓
 * (or k/j) to scroll a diagram that is taller than the viewport. Press q to quit.
 *
 * Run with:
 *   npx tsx demos/mermaid-demo.tsx
 *
 * @version 1.2.1
 * @since 2026-04-07
 */

import React, { useState } from 'react';
import { render, Box, Text, useApp, useInput } from 'ink';
import { MermaidPanel } from '../src/MermaidPanel.js';

// ── Data ───────────────────────────────────────────────────────────────────────

const FLOWCHART = `flowchart TD
  A[User Request] --> B{Validate Input}
  B -->|Valid| C[Process Request]
  B -->|Invalid| D[Return Error]
  C --> E[Fetch Data]
  E --> F{Cache Hit?}
  F -->|Yes| G[Return Cached]
  F -->|No| H[Query Database]
  H --> I[Cache Result]
  I --> G`;

const STATE_MACHINE = `stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Paused : pause
  Paused --> Running : resume
  Running --> Done : complete
  Running --> Error : fail
  Done --> [*]
  Error --> Idle : reset`;

// ── App ────────────────────────────────────────────────────────────────────────

function App(): React.JSX.Element {
  const { exit } = useApp();
  const [focusIndex, setFocusIndex] = useState(0);

  useInput((input, key) => {
    if (input === 'q') exit();
    if (key.tab) setFocusIndex((prev) => (prev + 1) % 2);
  });

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'magenta' },
      'MermaidPanel Demo  ·  Tab = cycle focus  ·  ↑/↓ = scroll  ·  q = quit'
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(MermaidPanel, {
      diagram: FLOWCHART,
      width: 60,
      height: 14,
      title: 'REQUEST FLOW',
      isFocused: focusIndex === 0,
    }),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(MermaidPanel, {
      diagram: STATE_MACHINE,
      width: 60,
      height: 14,
      title: 'STATE MACHINE',
      isFocused: focusIndex === 1,
    })
  );
}

render(React.createElement(App));
