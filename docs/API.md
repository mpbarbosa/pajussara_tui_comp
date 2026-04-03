# API Reference

This document provides an overview of the public API for the `pajussara_tui_comp` TypeScript project. It covers all exported functions, classes, and modules, including their signatures, parameters, return values, and usage examples.

---

## Table of Contents
- [Modules](#modules)
- [Classes](#classes)
- [Functions](#functions)

---

## Modules

> _List and describe each main module. Add more as needed._

### `src/index.ts`
- **Purpose**: Main entry point; exports all public APIs.

### `src/components/`
- **Purpose**: Contains reusable TUI components.

---

## Classes

> _Document each public class. Add more as needed._

### `TuiApp`
- **Description**: Main application class for initializing and running the TUI.
- **Constructor**:
  ```typescript
  constructor(config: TuiConfig)
  ```
- **Methods**:
  - `start(): void` — Starts the TUI application.
  - `stop(): void` — Stops the application and cleans up resources.

#### Example
```typescript
import { TuiApp } from 'pajussara_tui_comp';
const app = new TuiApp({ /* config */ });
app.start();
```

---

## Functions

> _Document each exported function. Add more as needed._

### `renderComponent`
- **Signature**:
  ```typescript
  function renderComponent(component: TuiComponent, target: HTMLElement): void
  ```
- **Description**: Renders a TUI component into the specified target element.
- **Parameters**:
  - `component`: The TUI component to render
  - `target`: The DOM element to render into
- **Returns**: `void`

#### Example
```typescript
import { renderComponent, Button } from 'pajussara_tui_comp';
renderComponent(new Button({ label: 'Click Me' }), document.getElementById('root'));
```

---

## Types

### `TuiConfig`
- **Description**: Configuration object for `TuiApp`.
- **Fields**:
  - `theme`: string — Theme name
  - `debug`: boolean — Enable debug mode

---

## Notes
- All APIs are subject to semantic versioning.
- For advanced usage and custom components, see the guides in `docs/guides/`.

---

_Last updated: 2026-04-03_
