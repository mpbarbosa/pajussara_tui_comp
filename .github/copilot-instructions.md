# Copilot Instructions

## Project

`pajussara_tui_comp` is an [Ink](https://github.com/vadimdemedes/ink) TUI component library written in TypeScript. Components render in the terminal using React's programming model (via Ink's `Box`/`Text` primitives).

## Architecture

- `src/` — component source files (`.tsx`)
- `helpers/` — shared display utilities (`formatStepIcon`, `statusColor`, `formatDuration`) imported by components as `'../helpers'`
- Build/test scripts are configured in `package.json`: `build` (tsc), `test` (jest), `lint` (eslint), `typecheck` (tsc --noEmit)
- Module system: `"type": "module"` in `package.json` (ESM)

## Key Conventions

### React.createElement, not JSX

All components use `React.createElement(...)` directly — **do not use JSX syntax**, even though files use `.tsx`.

### File-level JSDoc header

Every source file starts with:
```ts
/**
 * @fileoverview <short description>
 * @module components/<ComponentName>
 *
 * <longer description>
 *
 * @version x.y.z
 * @since YYYY-MM-DD
 */
```

### Section dividers

Use Unicode box-drawing section comments to separate logical blocks:
```ts
// ── Types ─────────────────────────────────────────────────────────────────────
// ── Component ─────────────────────────────────────────────────────────────────
```

### Props interfaces

- Define a `<ComponentName>Props` interface **above** the component function
- Also define any data-shape interfaces (e.g., `ListItem`) above the component
- Prefer `interface` over `type` alias for object shapes

### Exports

Every component must have both a named export and a `default` export:
```ts
export function ListPanel(...) { ... }
export default ListPanel;
```

When renaming an exported symbol, keep the old name as a deprecated alias:
```ts
/** @deprecated Use {@link ListPanel} instead */
export { ListPanel as OldName };
```

### Domain-agnostic naming

All identifiers — props, types, helpers, variables — must use generic, intention-revealing names rather than project- or application-specific ones. If a rename would break a public API, expose the new name as primary and the old as a `@deprecated` re-export.

### Focus and keyboard input

Components accept an `isFocused?: boolean` prop. Keyboard handlers via `useInput` must pass `{ isActive: isFocused }` so only the focused panel consumes key events.

### Status-driven display

Items carry a `status` string (`'pending'`, `'running'`, `'done'`, etc.). Use the shared `statusColor` and `formatStepIcon` helpers (from `helpers`) rather than inline color/icon logic.

## Custom Skills

The `js-to-ts` skill (`.github/skills/js-to-ts/SKILL.md`) converts `.js` files to TypeScript. It enforces all conventions above (typed signatures, extracted interfaces, named exports, domain-agnostic naming). Invoke it when asked to convert a JS file.
