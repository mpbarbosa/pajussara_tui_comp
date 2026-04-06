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

### StreamViewer

A live AI token stream panel for Ink TUI applications.

**Exported as:** `StreamViewer` (primary)

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `streamChunks` | `StreamState` | ✓ | — | Live and historical AI stream state |
| `width` | `number` | ✓ | — | Render width in terminal columns |
| `height` | `number` | | `12` | Render height in terminal rows (including border) |
| `isFocused` | `boolean` | | `false` | Whether this panel has keyboard focus |

#### Acceptance criteria

- **AC-01** Renders `"Waiting for AI response…"` in the footer when no tokens
  have been received (`tokenCount === 0`).
- **AC-02** Displays `streamChunks.liveText` in the scrollable body area.
- **AC-03** Shows `stepId` and `persona` in the header; falls back to `"—"` when
  either field is `null`.
- **AC-04** Shows token rate and count in the footer when `tokenCount > 0`.
- **AC-05** When `isFocused` is `true`, appends `[/] nav history` to the footer.
- **AC-06** Keyboard input is inactive when `isFocused` is `false`.
- **AC-07** `[` navigates backward through `streamChunks.history`; `]` navigates
  forward and returns to the live view when past the last entry.
- **AC-08** Automatically resets to the live view when new live chunks arrive
  (`streamChunks.liveText` changes).
- **AC-09** Long body text is wrapped at `width − 2` characters; only the last
  `height − 3` wrapped lines are visible (bottom-anchored scroll).
- **AC-10** Border colour is `cyan` when focused, `gray` otherwise.

### StreamState (data shape)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `liveText` | `string` | ✓ | Current in-progress token stream text |
| `stepId` | `string \| null` | ✓ | ID of the active step |
| `stepName` | `string \| null` | ✓ | Display name of the active step |
| `persona` | `string \| null` | ✓ | AI persona name |
| `tokenCount` | `number` | ✓ | Total tokens received so far |
| `tokensPerSec` | `number` | ✓ | Current token throughput |
| `history` | `StreamHistoryEntry[]` | ✓ | Completed step responses |

### StreamHistoryEntry (data shape)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stepId` | `string \| null` | ✓ | Step identifier |
| `stepName` | `string \| null` | ✓ | Step display name |
| `persona` | `string \| null` | ✓ | AI persona used |
| `fullText` | `string` | ✓ | Complete AI response text |
| `tokenCount` | `number` | ✓ | Total tokens in this response |
| `tokensPerSec` | `number` | ✓ | Average token throughput |

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
| RI-015 | step_05 | demo/ directory undocumented in ARCHITECTURE.md | docs/ARCHITECTURE.md | Medium | done |
| RI-016 | step_09 | package-lock.json out of sync with ink@^6.8.0 | package-lock.json | Medium | done |
| RI-017 | step_19 | @version 1.0.0 in StreamViewer.tsx outdated | src/StreamViewer.tsx | Low | done |
| RI-018 | step_06 | Mocks not reset between tests in ListPanel.test.tsx | test/ListPanel.test.tsx | Low | done |
| RI-019 | step_05 | ARCHITECTURE.md references demo/ but directory is demos/ | docs/ARCHITECTURE.md | Medium | done |
| RI-020 | step_02 | @version 1.0.0 outdated in src/types.ts | src/types.ts | Low | done |
| RI-021 | step_02 | @version 1.0.0 outdated in src/status_badge.tsx | src/status_badge.tsx | Low | done |
| RI-022 | step_02 | @version 1.0.0 outdated in src/Chronometer.tsx | src/Chronometer.tsx | Low | done |
| RI-023 | step_02 | @version 1.0.0 outdated in src/status_chronometer.tsx | src/status_chronometer.tsx | Low | done |
| RI-024 | step_02 | CHANGELOG.md missing entries for StreamViewer, Chronometer, StatusBadge, StatusChronometer | CHANGELOG.md | Medium | done |
| RI-025 | step_02 | GETTING_STARTED.md broken link demo/ → demos/ | docs/GETTING_STARTED.md | Low | done |
| RI-026 | step_04 | react and ink duplicated in peerDependencies and devDependencies | package.json | Low | done |
| RI-027 | step_02 | @version 1.0.0 outdated in all demos/*.tsx files | demos/ | Low | done |
