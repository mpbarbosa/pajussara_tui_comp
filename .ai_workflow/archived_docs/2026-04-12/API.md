# API Reference

Complete reference for all public exports of `pajussara_tui_comp`.

---

## Table of Contents

- [Components](#components)
  - [DirectoryPanel](#directorypanel)
  - [DirectoryTextBrowser](#directorytextbrowser)
  - [ListPanel](#listpanel)
  - [TextListPanel](#textlistpanel)
  - [StreamViewer](#streamviewer)
  - [StatusBadge](#statusbadge)
  - [Chronometer](#chronometer)
  - [StatusChronometer](#statuschronometer)
- [Types](#types)
  - [DirectoryTextBrowserPane](#directorytextbrowserpane)
  - [DirectoryEntry](#directoryentry)
  - [ListItem](#listitem)
  - [TextListItem](#textlistitem)
  - [StreamState](#streamstate)
  - [StreamHistoryEntry](#streamhistoryentry)
  - [PanelStatus](#panelstatus)
- [Helpers](#helpers)
- [Deprecated Aliases](#deprecated-aliases)

---

## Components

### `DirectoryPanel`

Scrollable, keyboard-navigable folder browser. Reads the direct child folders of
`directoryPath` and renders them in a bordered panel.

```ts
import { DirectoryPanel } from 'pajussara_tui_comp';
```

#### Props — `DirectoryPanelProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `directoryPath` | `string` | ✓ | — | Filesystem path whose child folders should be listed |
| `width` | `number` | ✓ | — | Panel width in terminal columns |
| `height` | `number` | | `20` | Panel height in terminal rows |
| `selectedDirectoryPath` | `string \| null` | | `null` | Currently selected folder path |
| `onSelectDirectory` | `(directoryPath: string) => void` | | — | Callback fired when user moves the selection |
| `isFocused` | `boolean` | | `false` | Whether this panel holds keyboard focus |
| `title` | `string` | | `'FOLDERS'` | Header label at the top of the panel |
| `loadingText` | `string` | | `'Loading folders…'` | Text shown while the directory is being read |
| `emptyText` | `string` | | `'No folders found.'` | Text shown when the directory contains no child folders |

#### Keyboard controls (when `isFocused` is `true`)

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { DirectoryPanel } from 'pajussara_tui_comp';

render(
  React.createElement(DirectoryPanel, {
    directoryPath: process.cwd(),
    width: 48,
    isFocused: true,
    onSelectDirectory: (directoryPath) => {
      console.log(`Selected: ${directoryPath}`);
    },
  })
);
```

---

### `DirectoryTextBrowser`

Two-pane browser that composes [`DirectoryPanel`](#directorypanel) on the left
with [`TextListPanel`](#textlistpanel) on the right.

```ts
import { DirectoryTextBrowser } from 'pajussara_tui_comp';
```

#### Props — `DirectoryTextBrowserProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `directoryPath` | `string` | ✓ | — | Filesystem path whose child folders should be listed |
| `getTextItems` | `(directoryPath: string \| null) => TextListItem[]` | ✓ | — | Returns the text rows for the currently selected directory |
| `width` | `number` | ✓ | — | Total layout width in terminal columns |
| `height` | `number` | | `20` | Shared panel height |
| `directoryPanelWidth` | `number` | | `40% of width` | Width of the left pane |
| `gap` | `number` | | `1` | Horizontal spacing between panes |
| `selectedDirectoryPath` | `string \| null` | | `null` | Controlled selected directory path |
| `onSelectDirectory` | `(directoryPath: string) => void` | | — | Fired when directory selection changes |
| `currentTextItemId` | `string \| null` | | `null` | Active text row ID shown as running/current |
| `selectedTextItemId` | `string \| null` | | `null` | Controlled selected text row ID |
| `onSelectTextItem` | `(id: string) => void` | | — | Fired when text-row selection changes |
| `focusedPane` | [`DirectoryTextBrowserPane`](#directorytextbrowserpane) | | `'directories'` | Controlled focused pane |
| `initialFocusedPane` | [`DirectoryTextBrowserPane`](#directorytextbrowserpane) | | `'directories'` | Initial pane when focus is uncontrolled |
| `onFocusPaneChange` | `(pane: DirectoryTextBrowserPane) => void` | | — | Fired when focus moves between panes |
| `directoryTitle` | `string` | | `'FOLDERS'` | Left-pane title |
| `directoryLoadingText` | `string` | | `'Loading folders…'` | Left-pane loading state |
| `directoryEmptyText` | `string` | | `'No folders found.'` | Left-pane empty state |
| `textTitle` | `string` | | `'TEXT'` | Right-pane title |
| `textEmptyText` | `string` | | `'No text items for this directory.'` | Right-pane empty state after a directory is selected |
| `textPlaceholderText` | `string` | | `'Select a directory to view its text items.'` | Right-pane placeholder before a directory is selected |

#### Keyboard controls

| Key | Action |
|-----|--------|
| `Tab` | Toggle focus between left and right panes |
| `←` / `h` | Focus the directory pane |
| `→` / `l` | Focus the text pane |
| `↑` / `k` | Move within the focused pane |
| `↓` / `j` | Move within the focused pane |

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { DirectoryTextBrowser } from 'pajussara_tui_comp';

render(
  React.createElement(DirectoryTextBrowser, {
    directoryPath: process.cwd(),
    width: 80,
    getTextItems: (directoryPath) =>
      directoryPath
        ? [
            { id: 'summary', text: `Selected: ${directoryPath}`, status: 'done' },
            { id: 'hint', text: 'Choose a new folder with ↑ / ↓.', status: 'pending' },
          ]
        : [],
  })
);
```

---

### `ListPanel`

Scrollable, keyboard-navigable list panel. Displays items with status icons, labels, and elapsed durations.

```ts
import { ListPanel } from 'pajussara_tui_comp';
```

#### Props — `ListPanelProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `items` | `Record<string, ListItem>` | ✓ | — | Map of item ID → item data |
| `currentItemId` | `string \| null` | ✓ | — | ID of the currently active (running) item |
| `width` | `number` | ✓ | — | Panel width in terminal columns |
| `height` | `number` | | `20` | Panel height in terminal rows |
| `title` | `string` | | `'STEPS'` | Header label at the top of the panel |
| `emptyText` | `string` | | `'Waiting for steps…'` | Text shown when `items` is empty |
| `isFocused` | `boolean` | | `false` | Whether this panel holds keyboard focus |
| `selectedItemId` | `string \| null` | | `null` | ID of the currently selected (highlighted) item |
| `onSelectItem` | `(id: string) => void` | | — | Callback fired when user moves the selection |

#### Keyboard controls (when `isFocused` is `true`)

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `Enter` | Fire `onSelectItem` with the selected ID |

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { ListPanel } from 'pajussara_tui_comp';

render(
  React.createElement(ListPanel, {
    items: {
      a: { id: 'a', name: 'Build', status: 'done', duration: 3200 },
      b: { id: 'b', name: 'Test',  status: 'running', duration: null },
    },
    currentItemId: 'b',
    width: 40,
    isFocused: true,
  })
);
```

---

### `TextListPanel`

ListPanel-backed text browser that adapts plain text rows into the
[`ListPanel`](#listpanel) data model.

```ts
import { TextListPanel } from 'pajussara_tui_comp';
```

#### Props — `TextListPanelProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `items` | `TextListItem[]` | ✓ | — | Ordered text rows to render |
| `currentTextItemId` | `string \| null` | | `null` | Active text row ID |
| `selectedTextItemId` | `string \| null` | | `null` | Controlled selected text row ID |
| `onSelectTextItem` | `(id: string) => void` | | — | Fired when the user moves the selection |
| `width` | `number` | ✓ | — | Panel width in terminal columns |
| `height` | `number` | | `20` | Panel height in terminal rows |
| `isFocused` | `boolean` | | `false` | Whether this panel holds keyboard focus |
| `title` | `string` | | `'TEXT'` | Header label |
| `emptyText` | `string` | | `'No text items.'` | Text shown when `items` is empty |

#### Keyboard controls (when `isFocused` is `true`)

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |

#### Usage

```ts
import React from 'react';
import { render } from 'ink';
import { TextListPanel } from 'pajussara_tui_comp';

render(
  React.createElement(TextListPanel, {
    items: [
      { id: 'line-1', text: 'Build output', status: 'done', duration: 1200 },
      { id: 'line-2', text: 'Deploy summary', status: 'running' },
    ],
    currentTextItemId: 'line-2',
    width: 48,
    isFocused: true,
  })
);
```

---

### `StreamViewer`

Live AI token-stream panel with scrollable output, token-rate footer, and history navigation (`[` / `]`).

```ts
import { StreamViewer } from 'pajussara_tui_comp';
```

#### Props — `StreamViewerProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `streamState` | `StreamState` | ✓ | — | Current stream data (see [`StreamState`](#streamstate)) |
| `width` | `number` | ✓ | — | Panel width in terminal columns |
| `height` | `number` | ✓ | — | Panel height in terminal rows |
| `isFocused` | `boolean` | | `false` | Whether this panel holds keyboard focus |

#### Utility export

```ts
import { wrapText } from 'pajussara_tui_comp';
// wrapText(text: string, width: number): string[]
```

---

### `StatusBadge`

Animated spinner / completion / error indicator. Cycles through spinner frames while `status` is `'loading'` or `'streaming'`.

```ts
import { StatusBadge } from 'pajussara_tui_comp';
```

#### Props — `StatusBadgeProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `status` | [`PanelStatus`](#panelstatus) | ✓ | — | Current badge state |
| `errorMessage` | `string` | | — | Custom message shown when `status === 'error'` |

---

### `Chronometer`

Elapsed-time display with start/stop/reset keyboard controls. Time is formatted via `formatDuration`.

```ts
import { Chronometer } from 'pajussara_tui_comp';
```

#### Props — `ChronometerProps`

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `width` | `number` | ✓ | — | Panel width in terminal columns |
| `isFocused` | `boolean` | | `false` | Whether this component holds keyboard focus |
| `title` | `string` | | `'CHRONOMETER'` | Header label |
| `initialElapsedMs` | `number` | | `0` | Initial elapsed milliseconds on mount |
| `onTick` | `(elapsedMs: number) => void` | | — | Fired every ~100 ms while running |
| `onStop` | `(elapsedMs: number) => void` | | — | Fired when the timer stops |
| `onReset` | `() => void` | | — | Fired when the timer resets |

#### Keyboard controls (when `isFocused` is `true`)

| Key | Action |
|-----|--------|
| `Space` | Start / stop the timer |
| `r` | Reset the timer to zero |

---

### `StatusChronometer`

Composite component — renders a [`StatusBadge`](#statusbadge) and a [`Chronometer`](#chronometer) side-by-side in a single row.

```ts
import { StatusChronometer } from 'pajussara_tui_comp';
```

#### Props — `StatusChronometerProps`

Merges all [`ChronometerProps`](#props-3) with the badge-specific props from [`StatusBadgeProps`](#props-2):

| Prop | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| `status` | [`PanelStatus`](#panelstatus) | ✓ | — | Passed to `StatusBadge` |
| `errorMessage` | `string` | | — | Passed to `StatusBadge` |
| `width` | `number` | ✓ | — | `Chronometer` panel width |
| `isFocused` | `boolean` | | `false` | Forwarded to `Chronometer` |
| `title` | `string` | | `'CHRONOMETER'` | `Chronometer` header label |
| `initialElapsedMs` | `number` | | `0` | `Chronometer` initial elapsed ms |
| `onTick` | `(elapsedMs: number) => void` | | — | `Chronometer` tick callback |
| `onStop` | `(elapsedMs: number) => void` | | — | `Chronometer` stop callback |
| `onReset` | `() => void` | | — | `Chronometer` reset callback |

---

## Types

### `DirectoryTextBrowserPane`

Focusable pane names used by `DirectoryTextBrowser`.

```ts
type DirectoryTextBrowserPane = 'directories' | 'text';
```

### `DirectoryEntry`

Shape of each folder entry rendered by `DirectoryPanel`.

```ts
interface DirectoryEntry {
  name: string;
  path: string;
}
```

### `ListItem`

Shape of each entry in the `ListPanel.items` map.

```ts
interface ListItem {
  id: string;
  name: string;
  status: string;          // 'pending' | 'running' | 'done' | 'error'
  duration?: number | null; // elapsed milliseconds; shown when status is 'done'
}
```

### `TextListItem`

Shape of each row rendered by `TextListPanel`.

```ts
interface TextListItem {
  id: string;
  text: string;
  status?: string;
  duration?: number | null;
}
```

### `StreamState`

Snapshot of the current token stream passed to `StreamViewer`.

```ts
interface StreamState {
  stepId: string | null;
  stepName: string | null;
  persona: string | null;
  chunks: string[];
  tokenCount: number;
  startTime: number | null;
  history: StreamHistoryEntry[];
}
```

### `StreamHistoryEntry`

A completed stream entry stored in `StreamState.history`.

```ts
interface StreamHistoryEntry {
  stepId: string | null;
  stepName: string | null;
  persona: string | null;
  fullText: string;
  tokenCount: number;
}
```

### `PanelStatus`

Status values used by `StatusBadge` and `StatusChronometer`.

```ts
type PanelStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error';
```

---

## Helpers

Low-level display utilities. Re-exported for advanced use.

```ts
import { formatStepIcon, statusColor, formatDuration } from 'pajussara_tui_comp';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `formatStepIcon` | `(status: string) => string` | Maps a status to a terminal icon (`✔ ● ✘ ○ ·`) |
| `statusColor` | `(status: string) => string` | Maps a status to an Ink colour name |
| `formatDuration` | `(ms: number) => string` | Formats milliseconds as a readable string (e.g. `"1m 4s"`, `"4.5s"`) |

**Status → icon/colour mapping:**

| `status` | Icon | Colour |
|----------|------|--------|
| `'done'` | `✔` | green |
| `'running'` | `●` | cyan |
| `'error'` | `✘` | red |
| `'pending'` | `○` | gray |
| *(other)* | `·` | white |

---

## Deprecated Aliases

| Alias | Resolves to | Since |
|-------|-------------|-------|
| `StepsPanel` | [`ListPanel`](#listpanel) | v1.0.x |
