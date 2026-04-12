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
import React from 'react';
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
/**
 * Terminal Mermaid diagram panel for Ink TUI applications.
 *
 * Renders a bordered panel containing Unicode ASCII art generated from Mermaid
 * diagram syntax. When focused, ↑/↓ (or k/j) scroll the diagram vertically
 * if it is taller than the visible body area.
 */
export declare function MermaidPanel({ diagram, width, height, title, isFocused, }: MermaidPanelProps): React.JSX.Element;
export default MermaidPanel;
//# sourceMappingURL=MermaidPanel.d.ts.map