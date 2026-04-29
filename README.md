## README

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

### `DirectoryPanel`

A scrollable, keyboard-navigable folder browser for
[Ink](https://github.com/vadimdemedes/ink) TUI applications. It reads the direct
child folders from a filesystem path and renders them in a `ListPanel`-style
bordered panel.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `directoryPath` | `string` | — | Filesystem path whose child folders should be listed |
| `width` | `number` | — | Panel width in terminal columns |
| `height` | `number` | `20` | Panel height in terminal rows |
| `selectedDirectoryPath` | `string \| null` | `null` | Externally-controlled selected folder path |
| `onSelectDirectory` | `(directoryPath: string) => void` | — | Fired when the user moves the selection |
| `isFocused` | `boolean` | `false` | Whether this panel holds keyboard focus |
| `title` | `string` | `'FOLDERS'` | Header label at the top of the panel |
| `loadingText` | `string` | `'Loading folders…'` | Text shown while reading the directory |
| `emptyText` | `string` | `'No folders found.'` | Text shown when no child folders are present |

#### `DirectoryEntry` interface

```ts
interface DirectoryEntry {
  name: string;
  path: string;
}
```

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
import { DirectoryPanel } from 'pajussara_tui_comp';

render(
  React.createElement(DirectoryPanel, {
    directoryPath: process.cwd(),
    width: 60,
    isFocused: true,
    title: 'PROJECT FOLDERS',
    onSelectDirectory: (directoryPath) => {
      console.log(`Selected: ${directoryPath}`);
    },
  })
);
```

---

### `DirectoryTextBrowser`

A composite browser that places a [`DirectoryPanel`](#directorypanel) on the
left and a [`TextListPanel`](#textlistpanel) on the right.

Use this when you want a file-system chooser and a coordinated text/details
panel in one reusable component.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `directoryPath` | `string` | — | Filesystem path whose child folders should be listed |
| `getTextItems` | `(directoryPath: string \| null) => TextListItem[]` | — | Returns the right-pane rows for the selected directory |
| `width` | `number` | — | Total width of the two-pane layout |
| `height` | `number` | `20` | Shared panel height |
| `directoryPanelWidth` | `number` | `40% of width` | Width of the left pane |
| `gap` | `number` | `1` | Horizontal spacing between panes |
| `selectedDirectoryPath` | `string \| null` | `null` | Controlled selected directory path |
| `onSelectDirectory` | `(directoryPath: string) => void` | — | Fired when the directory selection changes |
| `currentTextItemId` | `string \| null` | `null` | Active text row ID shown as current |
| `selectedTextItemId` | `string \| null` | `null` | Controlled selected text row ID |
| `onSelectTextItem` | `(id: string) => void` | — | Fired when the text selection changes |
| `focusedPane` | `'directories' \| 'text'` | `'directories'` | Controlled focused pane |
| `initialFocusedPane` | `'directories' \| 'text'` | `'directories'` | Initial pane for uncontrolled focus |
| `onFocusPaneChange` | `(pane: 'directories' \| 'text') => void` | — | Fired when focus moves between panes |
| `directoryTitle` | `string` | `'FOLDERS'` | Left-pane title |
| `directoryLoadingText` | `string` | `'Loading folders…'` | Left-pane loading text |
| `directoryEmptyText` | `string` | `'No folders found.'` | Left-pane empty state |
| `textTitle` | `string` | `'TEXT'` | Right-pane title |
| `textEmptyText` | `string` | `'No text items for this directory.'` | Right-pane empty state after selection |
| `

---

## API

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
  - [ErrorDetailPanel](#errordetailpanel)
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
| `initialFocusedPane
