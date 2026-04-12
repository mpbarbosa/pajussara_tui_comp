/**
 * @file MermaidPanel.test.tsx
 * @description Unit tests for MermaidPanel — terminal Mermaid diagram renderer.
 */

import React from 'react';
import { render } from 'ink-testing-library';
import MermaidPanelDefault, { MermaidPanel, type MermaidPanelProps } from '../src/MermaidPanel';

// ── Fixtures ──────────────────────────────────────────────────────────────────

/** Minimal valid flowchart — single-hop, 3-node output from beautiful-mermaid. */
const SIMPLE_DIAGRAM = 'graph LR\n  A --> B';

/** Diagram string that will cause renderMermaidASCII to throw. */
const INVALID_DIAGRAM = 'this is not valid mermaid at all';

function makeMermaidPanel(overrides: Partial<MermaidPanelProps> = {}) {
  return render(
    React.createElement(MermaidPanel, { diagram: SIMPLE_DIAGRAM, width: 40, ...overrides })
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MermaidPanel component', () => {
  // ── Rendering basics ───────────────────────────────────────────────────────

  it('renders the default title "DIAGRAM"', () => {
    const { lastFrame } = makeMermaidPanel();
    expect(lastFrame()).toContain('DIAGRAM');
  });

  it('renders a custom title', () => {
    const { lastFrame } = makeMermaidPanel({ title: 'FLOW' });
    expect(lastFrame()).toContain('FLOW');
  });

  it('renders Unicode box-drawing characters from ASCII art', () => {
    const { lastFrame } = makeMermaidPanel();
    const frame = lastFrame() ?? '';
    // beautiful-mermaid produces box-drawing characters
    expect(frame).toMatch(/[┌└│─►]/);
  });

  it('renders node labels from the diagram', () => {
    const { lastFrame } = makeMermaidPanel();
    const frame = lastFrame() ?? '';
    expect(frame).toContain('A');
    expect(frame).toContain('B');
  });

  it('renders a footer with "lines" text', () => {
    const { lastFrame } = makeMermaidPanel();
    expect(lastFrame()).toContain('lines');
  });

  // ── Named and default exports ──────────────────────────────────────────────

  it('named export MermaidPanel renders without error', () => {
    const { lastFrame } = makeMermaidPanel();
    expect(lastFrame()).toBeTruthy();
  });

  it('default export is the same component', () => {
    const { lastFrame } = render(
      React.createElement(MermaidPanelDefault, { diagram: SIMPLE_DIAGRAM, width: 40 })
    );
    expect(lastFrame()).toContain('DIAGRAM');
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('displays "Error:" when diagram syntax is invalid', () => {
    const { lastFrame } = makeMermaidPanel({ diagram: INVALID_DIAGRAM });
    expect(lastFrame()).toContain('Error:');
  });

  it('shows "Invalid diagram syntax" footer on error', () => {
    const { lastFrame } = makeMermaidPanel({ diagram: INVALID_DIAGRAM });
    expect(lastFrame()).toContain('Invalid diagram syntax');
  });

  it('does not throw when diagram syntax is invalid', () => {
    expect(() => makeMermaidPanel({ diagram: INVALID_DIAGRAM })).not.toThrow();
  });

  // ── Focus state ────────────────────────────────────────────────────────────

  it('renders without focus by default', () => {
    const { lastFrame } = makeMermaidPanel({ isFocused: false });
    expect(lastFrame()).toContain('DIAGRAM');
  });

  it('renders correctly when focused', () => {
    const { lastFrame } = makeMermaidPanel({ isFocused: true });
    expect(lastFrame()).toContain('DIAGRAM');
  });

  // ── Scroll behaviour ───────────────────────────────────────────────────────

  it('shows scroll hint in footer when focused and diagram is scrollable', () => {
    // height=6 → bodyHeight = max(1, 6-4) = 2 rows; simple diagram renders 3+ lines → scrollable
    const { lastFrame } = makeMermaidPanel({ height: 6, isFocused: true });
    expect(lastFrame()).toContain('↑/↓ scroll');
  });

  it('does not show scroll hint when not focused even if scrollable', () => {
    const { lastFrame } = makeMermaidPanel({ height: 6, isFocused: false });
    expect(lastFrame()).not.toContain('↑/↓ scroll');
  });

  it('does not show scroll hint when diagram fits in viewport', () => {
    // height=30 → bodyHeight=26; simple diagram << 26 lines → not scrollable
    const { lastFrame } = makeMermaidPanel({ height: 30, isFocused: true });
    expect(lastFrame()).not.toContain('↑/↓ scroll');
  });

  // ── Variety of diagram types ───────────────────────────────────────────────

  it('renders a stateDiagram-v2 without error', () => {
    const stateDiagram = 'stateDiagram-v2\n  [*] --> Active\n  Active --> [*]';
    expect(() =>
      render(React.createElement(MermaidPanel, { diagram: stateDiagram, width: 40 }))
    ).not.toThrow();
  });

  it('renders a sequenceDiagram without error', () => {
    const seqDiagram = 'sequenceDiagram\n  Alice->>Bob: Hello\n  Bob->>Alice: Hi';
    expect(() =>
      render(React.createElement(MermaidPanel, { diagram: seqDiagram, width: 50 }))
    ).not.toThrow();
  });
});

