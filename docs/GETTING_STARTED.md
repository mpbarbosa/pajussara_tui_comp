# Getting Started

Welcome to **pajussara_tui_comp**! This guide will help you install, configure, and run your first TUI application using this library.

---

## Installation

```bash
npm install pajussara_tui_comp
```

---

## Basic Usage

1. **Import the library:**
   ```typescript
   import { TuiApp, Button } from 'pajussara_tui_comp';
   ```
2. **Create an app instance:**
   ```typescript
   const app = new TuiApp({ theme: 'default', debug: false });
   ```
3. **Add components and start:**
   ```typescript
   app.addComponent(new Button({ label: 'Hello' }));
   app.start();
   ```

---

## Configuration

- **theme**: Set the color theme (e.g., 'default', 'dark')
- **debug**: Enable debug logging (true/false)

---

## Example

```typescript
import { TuiApp, Button } from 'pajussara_tui_comp';
const app = new TuiApp({ theme: 'dark', debug: true });
app.addComponent(new Button({ label: 'Welcome!' }));
app.start();
```

---

## Next Steps
- Explore the [API Reference](./API.md)
- Read the guides in `docs/guides/`
- See example projects in `examples/`

---

_Last updated: 2026-04-03_
