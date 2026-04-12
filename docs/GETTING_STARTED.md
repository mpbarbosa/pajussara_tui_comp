# Getting Started

Welcome to **pajussara_tui_comp**! This guide will help you install and render your first TUI component.

---

## Installation

```bash
npm install pajussara_tui_comp
```

**Peer dependencies** (install separately if not already present):

```bash
npm install ink react
```

---

## Basic Usage

All components are pure React function components rendered with [Ink](https://github.com/vadimdemedes/ink).
Use `React.createElement` directly (no JSX required).

### Minimal `DirectoryPanel` example

```typescript
import React from 'react';
import { render } from 'ink';
import { DirectoryPanel } from 'pajussara_tui_comp';

render(
  React.createElement(DirectoryPanel, {
    directoryPath: process.cwd(),
    width: 50,
    isFocused: true,
    title: 'WORKSPACE',
  })
);
```

---

### Minimal `ListPanel` example

```typescript
import React from 'react';
import { render } from 'ink';
import { ListPanel } from 'pajussara_tui_comp';

const items = {
  task1: { id: 'task1', name: 'Fetch data',   status: 'done',    duration: 1200 },
  task2: { id: 'task2', name: 'Process items', status: 'running', duration: null },
  task3: { id: 'task3', name: 'Write output',  status: 'pending', duration: null },
};

render(
  React.createElement(ListPanel, {
    items,
    currentItemId: 'task2',
    width: 40,
    isFocused: true,
  })
);
```

---

## Peer dependency versions

| Package | Minimum |
|---------|---------|
| `ink`   | `5.0.0` |
| `react` | `19.0.0` |

---

## Next Steps

- [API Reference](./API.md) — full props, types, and exports
- [ARCHITECTURE.md](./ARCHITECTURE.md) — module structure and build pipeline
- [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md) — acceptance criteria per component
- [`demos/`](../demos/) — runnable examples
