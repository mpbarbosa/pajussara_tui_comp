# Changelog

All notable changes to `pajussara_tui_comp` will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.2] - 2026-04-07

### Added

- `Chronometer` — `forceRunning` prop: when `true` the chronometer starts automatically on
  mount; when `false` it stops if currently running; `undefined` (default) keeps fully manual
  keyboard control.
- `Chronometer` — `showLabel` prop (default: `true`): controls whether the panel title is
  rendered, enabling embedding without the "CHRONOMETER" header.
- `Chronometer` — `showHints` prop (default: `true`): controls whether the keyboard-hints bar
  is rendered (`[space] start/stop  [r] reset`).
- `StatusChronometer` — `syncWithStatus` prop (default: `false`): when `true`, `forceRunning`
  is derived automatically from `status` (`loading`/`streaming` → running; otherwise stopped).
  When `false` the caller's own `forceRunning` prop is passed through unchanged.
- Demo `status-chronometer-cities5.tsx` — world-cities tour with `forceRunning: true` so the
  chronometer starts immediately on mount without any user interaction.

---

## [1.1.9] - 2026-03-07

### Added

- `ListPanel` — scrollable, keyboard-navigable list panel for Ink TUI applications
  - Keyboard selection via ↑/↓ or k/j
  - Mouse click selection support
  - Scroll window that follows the active item
  - Status icons and elapsed duration display
  - `isFocused` prop for multi-panel focus management
  - Configurable `title` and `emptyText` props
- `ListItem` and `ListPanelProps` TypeScript interfaces
- `StepsPanel` deprecated alias for `ListPanel`
- `StreamViewer` — live AI token stream panel (added 2026-03-10)
  - Real-time token display with scrollable body
  - Header showing `stepId` and `persona`; footer showing token rate and count
  - History navigation via `[` / `]` keys when focused
  - Border colour reflects focus state (cyan when focused, gray otherwise)
- `Chronometer` — elapsed-time display panel with start/stop/reset keyboard controls (added 2026-04-05)
- `StatusBadge` — animated spinner / completion / error indicator driven by `PanelStatus` (added 2026-04-05)
- `StatusChronometer` — composite panel combining `StatusBadge` and `Chronometer` side by side (added 2026-04-05)
- `PanelStatus` shared type (`idle | loading | streaming | done | error`) in `src/types.ts` (added 2026-04-05)
