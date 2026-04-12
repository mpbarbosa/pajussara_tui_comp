/**
 * @fileoverview MermaidPanel — terminal Mermaid diagram renderer
 * @module components/MermaidPanel
 *
 * Converts Mermaid diagram syntax into Unicode box-drawing ASCII art and
 * renders it line-by-line inside a bordered Ink panel. Supports scrolling
 * when the diagram is taller than the visible viewport.
 *
 * Rendering is synchronous (via `useMemo`) using `beautiful-mermaid`'s
 * `renderMermaidASCII` function. Invalid syntax is caught and displayed
 * as a red inline error rather than thrown.
 *
 * **Syntax note:** `beautiful-mermaid` requires multi-line notation.
 * The diagram type header must be on its own line:
 * ```
 * graph TD
 *   A --> B
 * ```
 * Single-line shorthand (e.g. `graph TD; A-->B`) is NOT supported.
 *
 * Supported diagram types: `graph`, `flowchart`, `stateDiagram-v2`,
 * `sequenceDiagram`, `classDiagram`, `erDiagram`, `xychart-beta`.
 *
 * @version 1.2.1
 * @since 2026-04-07
 */

import React, { useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { renderMermaidASCII } from 'beautiful-mermaid';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Props for {@link MermaidPanel}. */
export interface MermaidPanelProps {
  /** Mermaid diagram syntax string. Must use multi-line notation. */
  diagram: string;
  /** Render width in terminal columns. */
  width: number;
  /** Render height in terminal rows including the border. Defaults to `20`. */
  height?: number;
  /** Panel header label. Defaults to `"DIAGRAM"`. */
  title?: string;
  /** Whether this panel has keyboard focus. Defaults to `false`. */
  isFocused?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Renders a Mermaid diagram string to ASCII art lines, or returns an error
 * line array if the diagram syntax is invalid.
 */
function renderToLines(diagram: string): { lines: string[]; error: boolean } {
  try {
    const ascii = renderMermaidASCII(diagram);
    return { lines: ascii.split('\n'), error: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { lines: [`Error: ${msg}`], error: true };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Terminal Mermaid diagram panel for Ink TUI applications.
 *
 * Renders a bordered panel containing Unicode ASCII art generated from Mermaid
 * diagram syntax. When focused, ↑/↓ (or k/j) scroll the diagram vertically
 * if it is taller than the visible body area.
 */
export function MermaidPanel({
  diagram,
  width,
  height = 20,
  title = 'DIAGRAM',
  isFocused = false,
}: MermaidPanelProps): React.JSX.Element {
  // header line + footer line + top/bottom borders = 4 rows overhead
  const bodyHeight = Math.max(1, height - 4);

  // ── Render ASCII ───────────────────────────────────────────────────────────
  const { lines, error } = useMemo(() => renderToLines(diagram), [diagram]);

  // ── Scroll state ───────────────────────────────────────────────────────────
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxScroll = Math.max(0, lines.length - bodyHeight);
  const isScrollable = lines.length > bodyHeight;

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useInput(
    (_input, key) => {
      if (key.upArrow || _input === 'k') {
        setScrollOffset((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow || _input === 'j') {
        setScrollOffset((prev) => Math.min(maxScroll, prev + 1));
      }
    },
    { isActive: isFocused }
  );

  // ── Visible slice ──────────────────────────────────────────────────────────
  const clampedOffset = Math.min(scrollOffset, maxScroll);
  const visibleLines = lines.slice(clampedOffset, clampedOffset + bodyHeight);
  while (visibleLines.length < bodyHeight) visibleLines.push('');

  // ── Footer ─────────────────────────────────────────────────────────────────
  const scrollLabel = isScrollable
    ? ` ${clampedOffset + 1}–${Math.min(clampedOffset + bodyHeight, lines.length)}/${lines.length}`
    : '';
  const keyHint = isFocused && isScrollable ? '  ↑/↓ scroll' : '';
  const footerText = error
    ? 'Invalid diagram syntax'
    : `lines${scrollLabel}${keyHint}`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      width,
      borderStyle: 'single',
      borderColor: isFocused ? 'cyan' : 'gray',
    },
    React.createElement(
      Box,
      { paddingX: 1 },
      React.createElement(
        Text,
        { bold: true, color: isFocused ? 'cyan' : 'white', wrap: 'truncate' },
        title
      )
    ),
    ...visibleLines.map((line, i) =>
      React.createElement(
        Box,
        { key: i, paddingX: 1 },
        React.createElement(
          Text,
          { color: error ? 'red' : undefined, wrap: 'truncate' },
          line || ' '
        )
      )
    ),
    React.createElement(
      Box,
      { paddingX: 1 },
      React.createElement(
        Text,
        { color: error ? 'red' : 'gray', wrap: 'truncate' },
        footerText
      )
    )
  );
}

export default MermaidPanel;
