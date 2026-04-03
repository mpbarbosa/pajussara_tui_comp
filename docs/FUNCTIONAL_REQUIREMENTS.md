# Functional Requirements

Feature catalogue and acceptance criteria for `pajussara_tui_comp`.

---

## Components

### ListPanel

A scrollable, keyboard-navigable list panel for Ink TUI applications.

**Exported as:** `ListPanel` (primary), `StepsPanel` (deprecated alias)

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `Record<string, ListItem>` | ✓ | — | Map of item ID → item data |
| `currentItemId` | `string \| null` | ✓ | — | ID of the currently active (running) item |
| `width` | `number` | ✓ | — | Render width in terminal columns |
| `title` | `string` | | `"STEPS"` | Panel header label |
| `emptyText` | `string` | | `"Waiting for steps…"` | Text shown when `items` is empty |
| `isFocused` | `boolean` | | `false` | Whether this panel has keyboard focus |
| `selectedItemId` | `string \| null` | | `null` | ID of the currently selected (highlighted) item |
| `onSelectItem` | `(id: string) => void` | | — | Callback fired when user selects an item |

#### Acceptance criteria

- **AC-01** Renders all items in insertion order with status icon, label,
  and elapsed duration.
- **AC-02** Displays `emptyText` when `items` is empty.
- **AC-03** Highlights the `currentItemId` row with a distinct marker.
- **AC-04** When `isFocused` is `true`, ↑/↓ and k/j move selection; Enter
  fires `onSelectItem`.
- **AC-05** Keyboard input is inactive when `isFocused` is `false`.
- **AC-06** Scroll window follows the active item so it is always visible.
- **AC-07** Status icons and colours are rendered via `formatStepIcon` and
  `statusColor` helpers — no inline colour/icon logic.
- **AC-08** A `">"` cursor is rendered on the `selectedItemId` row.

### ListItem (data shape)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✓ | Unique identifier |
| `name` | `string` | ✓ | Display label |
| `status` | `string` | ✓ | One of: `pending`, `running`, `done`, `error` |
| `duration` | `number \| null` | | Elapsed time in milliseconds; `null` = in progress |

---

## Helpers

### formatStepIcon

Maps a status string to a terminal icon. Pure function.

### statusColor

Maps a status string to an Ink color name. Pure function.

### formatDuration

Formats milliseconds as a human-readable string. Pure function.

---

## Roadmap — Minor Issues

> Populated by the `fix-log-issues` skill. Each item was verified against
> the live codebase before being marked done.

| ID | Source step | Description | File / Path | Priority | Status |
|----|-------------|-------------|-------------|----------|--------|
| RI-001 | step_05 | docs/ directory has no README | docs/README.md | Medium | done |
| RI-002 | step_05 | helpers/ directory has no README | helpers/README.md | Low | done |
| RI-003 | step_09 | package.json missing engines field | package.json | Low | done |
| RI-004 | step_09 | package.json missing exports field | package.json | Low | done |
| RI-005 | step_0b | CONTRIBUTING.md missing | CONTRIBUTING.md | Medium | done |
| RI-006 | step_0b | docs/ARCHITECTURE.md missing | docs/ARCHITECTURE.md | Medium | done |
| RI-007 | step_05 | docs/FUNCTIONAL_REQUIREMENTS.md missing | docs/FUNCTIONAL_REQUIREMENTS.md | Medium | done |
| RI-008 | step_13 | CHANGELOG.md markdown-lint violations | CHANGELOG.md | Low | done |
| RI-009 | step_06 | Type-only runtime test is a no-op in index.test.ts | test/index.test.ts | Medium | done |
| RI-010 | step_06 | DRY violations in ListPanel.test.tsx inflate test code | test/ListPanel.test.tsx | Low | done |
| RI-011 | step_13 | MD056 table column mismatch in README.md | README.md | Medium | done |
| RI-012 | step_13 | MD007 list indentation violation in CHANGELOG.md | CHANGELOG.md | Low | done |
| RI-013 | step_13 | MD029 ordered list item prefixes in CONTRIBUTING.md | CONTRIBUTING.md | Low | done |
| RI-014 | step_13 | MD013 line-length violations across multiple docs | README.md, docs/* | Low | done |
