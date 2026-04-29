# src/helpers/

Shared display utilities consumed by all `pajussara_tui_comp` components.

This directory currently has two helper modules:

- `src/helpers/index.ts` — the existing library-specific display helpers used by
  shipped components such as `ListPanel` and `Chronometer`
- `src/helpers/reusable.ts` — a broader internal reusable helper set copied from
  `ai_workflow.js` and adapted to TypeScript for richer TUI/dashboard use cases

Import from sibling component files in `src/` when you need the existing
component-facing helpers:

```ts
import { formatStepIcon, statusColor, formatDuration } from './helpers/index.js';
```

Import from the dedicated module path when you need the broader reusable helper
set:

```ts
import {
  formatProgressLine,
  formatTimestamp,
  terminalIsSufficient,
} from './helpers/reusable.js';
```

## Exports

### `src/helpers/index.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `formatStepIcon` | `(status: string) => string` | Maps a status string to a terminal icon character (`✔`, `●`, `✘`, `○`, `·`) |
| `statusColor` | `(status: string) => string` | Maps a status string to an Ink color name (`green`, `cyan`, `red`, `gray`, `white`) |
| `formatDuration` | `(ms: number) => string` | Formats milliseconds as a human-readable string, e.g. `4500` → `"4.5s"`, `61500` → `"1m 1s"` |

### `src/helpers/reusable.ts`

| Function group | Examples |
|----------------|----------|
| Status formatting | `formatStepIcon`, `statusColor` |
| Time and progress formatting | `formatDuration`, `formatTimestamp`, `formatEta`, `formatProgressBar`, `formatProgressLine` |
| Log helpers | `truncateLogLine`, `filterLogLines`, `highlightSearchMatch`, `truncateStackTrace`, `keepLast` |
| Layout helpers | `terminalIsSufficient`, `stepsPanelWidth` |
| Detail formatting | `formatStepDetail` |

`src/helpers/reusable.ts` intentionally remains a separate module because some
overlapping helper names, especially `formatStepIcon`, `statusColor`, and
`formatDuration`, follow `ai_workflow.js` display conventions rather than this
library's existing public helper behaviour.

## Conventions

- Helpers are pure functions with no side effects.
- Components must **not** duplicate helper logic inline.
- Use `src/helpers/index.ts` for the current component-library display semantics.
- Use `src/helpers/reusable.ts` for broader internal dashboard/TUI utilities.
