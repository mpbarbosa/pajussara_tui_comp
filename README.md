# pajussara_tui_comp

An Ink TUI Component Library in TypeScript.

---

## Installation

```sh
npm install pajussara_tui_comp
```

**Peer dependencies:** `ink >= 4.0.0`, `react >= 18.0.0`

---

## Components

### `ListPanel`

A scrollable, keyboard-navigable list panel for [Ink](https://github.com/vadimdemedes/ink) TUI applications.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Record<string, ListItem>` | — | Map of item ID → item data |
| `currentItemId` | `string \| null` | — | ID of the active/running item |
| `width` | `number` | — | Panel width in terminal columns |
| `height` | `number` | `20` | Panel height in terminal rows |
| `selectedItemId` | `string \| null` | `null` | Externally-controlled selected item ID |
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
