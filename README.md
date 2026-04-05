# pajussara_tui_comp

An Ink TUI Component Library in TypeScript.

---

## Installation

```sh
npm install pajussara_tui_comp
```

**Peer dependencies:** `ink >= 5.0.0`, `react >= 19.0.0`

---

## Components

### `ListPanel`

A scrollable, keyboard-navigable list panel for [Ink](https://github.com/vadimdemedes/ink) TUI applications.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Record<string, ListItem>` | — | Map of item ID → item data |
| `currentItemId` | `string | null` | — | ID of the active/running item |
| `width` | `number` | — | Panel width in terminal columns |
| `height` | `number` | `20` | Panel height in terminal rows |
| `selectedItemId` | `string | null` | `null` | Externally-controlled selected item ID |
| `onSelectItem` | `(id: string) => void` | — | Fired when the user moves the selection |
| `isFocused` | `boolean` | `false` | Whether this panel holds keyboard focus |
| `title` | `string` | `'STEPS'` | Header label at the top of the panel |
| `emptyText` | `string` | `'Waiting for steps…'` | Text shown when `items` is empty |

#### `ListItem` interface

```ts
interface ListItem {
  id: string;
  name: string;
  status: string;       // 'pending' | 'running' | 'done' | 'error'
  duration?: number | null; // elapsed milliseconds (shown when status is 'done')
}
```

#### Status values

| Status | Icon | Colour |
|---|---|---|
| `pending` | `○` | gray |
| `running` | `●` | cyan |
| `done` | `✔` | green |
| `error` | `✘` | red |

#### Keyboard controls

| Key | Action |
|---|---|
| `↑` or `k` | Move selection up |
| `↓` or `j` | Move selection down |

> Keyboard events are only consumed when `isFocused` is `true`.

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { ListPanel } from 'pajussara_tui_comp';

const items = {
  'step-1': { id: 'step-1', name: 'Install dependencies', status: 'done', duration: 3200 },
  'step-2': { id: 'step-2', name: 'Run tests',            status: 'running' },
  'step-3': { id: 'step-3', name: 'Build',                status: 'pending' },
};

render(
  React.createElement(ListPanel, {
    items,
    currentItemId: 'step-2',
    width: 60,
    isFocused: true,
    title: 'PIPELINE',
  })
);
```

---

### `Chronometer`

An elapsed-time display panel with start, stop, and reset controls driven by keyboard input.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | — | Panel width in terminal columns |
| `isFocused` | `boolean` | `false` | Whether this component holds keyboard focus |
| `title` | `string` | `'CHRONOMETER'` | Header label at the top of the panel |
| `initialElapsedMs` | `number` | `0` | Initial elapsed milliseconds on mount |
| `showBorder` | `boolean` | `true` | Whether to render the surrounding border |
| `onTick` | `(elapsedMs: number) => void` | — | Fired every ~100 ms while running |
| `onStop` | `(elapsedMs: number) => void` | — | Fired when the chronometer transitions to `'stopped'` |
| `onReset` | `() => void` | — | Fired when the chronometer resets |

#### Keyboard controls

| Key | Action |
|---|---|
| `Space` | Start (from idle/stopped) or stop (from running) |
| `r` | Reset elapsed time to zero and return to idle |

> Keyboard events are only consumed when `isFocused` is `true`.

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { Chronometer } from 'pajussara_tui_comp';

render(
  React.createElement(Chronometer, {
    width: 40,
    isFocused: true,
    title: 'ELAPSED',
    onStop: (ms) => console.log(`Stopped at ${ms}ms`),
  })
);
```

---

### `StatusChronometer`

A composed panel that places a [`StatusBadge`](#statusbadge) on the left and a
[`Chronometer`](#chronometer) on the right in a horizontal row.

Use this when you want to show an external async status (loading, streaming, done, error)
alongside a running elapsed-time display in a single component.

#### Props

Merges all [`ChronometerProps`](#props-2) with the badge-specific subset of
[`StatusBadgeProps`](#statusbadge):

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `PanelStatus` | — | Status passed to the `StatusBadge` |
| `errorMessage` | `string` | — | Custom error text shown when `status === 'error'` |
| `width` | `number` | — | `Chronometer` panel width in terminal columns |
| `isFocused` | `boolean` | `false` | Whether the `Chronometer` holds keyboard focus |
| `title` | `string` | `'CHRONOMETER'` | `Chronometer` header label |
| `initialElapsedMs` | `number` | `0` | `Chronometer` initial elapsed milliseconds |
| `showBorder` | `boolean` | `true` | Whether the `Chronometer` renders its surrounding border |
| `onTick` | `(elapsedMs: number) => void` | — | Fired every ~100 ms while the timer is running |
| `onStop` | `(elapsedMs: number) => void` | — | Fired when the timer stops |
| `onReset` | `() => void` | — | Fired when the timer resets |

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { StatusChronometer } from 'pajussara_tui_comp';

render(
  React.createElement(StatusChronometer, {
    status: 'loading',
    width: 40,
    isFocused: true,
    title: 'ELAPSED',
    onStop: (ms) => console.log(`Stopped at ${ms}ms`),
  })
);
```

---

## Helpers

Low-level display utilities exported from `pajussara_tui_comp/helpers` (re-exported for advanced use):

| Function | Signature | Description |
|---|---|---|
| `formatStepIcon` | `(status: string) => string` | Maps a status string to a terminal icon (`✔ ● ✘ ○`) |
| `statusColor` | `(status: string) => string` | Maps a status string to an Ink colour name |
| `formatDuration` | `(ms: number) => string` | Formats milliseconds as a readable string (e.g. `"1m 4s"`, `"4.5s"`) |

---

## Development

```sh
npm run build        # compile TypeScript → dist/
npm run typecheck    # type-check without emitting
npm run lint         # ESLint on src/
npm test             # run Jest test suite
```
