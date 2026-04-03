# Changelog

All notable changes to `pajussara_tui_comp` will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-03-07

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
