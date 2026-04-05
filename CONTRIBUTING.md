# Contributing to pajussara_tui_comp

Thank you for your interest in contributing!

## Getting started

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make your changes, following the conventions below.

4. Run the checks before submitting:

   ```bash
   npm run typecheck   # TypeScript validation
   npm test            # Jest test suite
   npm run lint        # ESLint
   ```

5. Submit a pull request with a clear description of your changes.

## Code conventions

- All components use `React.createElement(...)` directly — no JSX syntax.
- Every source file starts with a `@fileoverview` JSDoc block.
- Use `interface` (not `type`) for object shapes.
- Display helpers (`formatStepIcon`, `statusColor`, `formatDuration`) live
  in `helpers/` and must not be duplicated inline in components.
- Components accept `isFocused?: boolean` and pass `{ isActive: isFocused }`
  to `useInput`.

## JSDoc conventions

Every source file must open with a header block in this exact shape:

```ts
/**
 * @fileoverview <one-line description>
 * @module components/<ComponentName>   // or "helpers", "types"
 *
 * <longer description paragraph(s)>
 *
 * @version x.y.z
 * @since YYYY-MM-DD
 */
```

`@module` naming:
- Components → `components/<ComponentName>` (PascalCase filename, e.g. `components/ListPanel`)
- Helpers entry point → `helpers`
- Shared types → `types`

Logical blocks inside a file are separated with Unicode box-drawing dividers:

```ts
// ── Types ─────────────────────────────────────────────────────────────────────
// ── Component ─────────────────────────────────────────────────────────────────
```

Props and data interfaces go **above** the component function and use `interface`:

```ts
export interface ListPanelProps { ... }
export interface ListItem { ... }
```

Cross-references use the `{@link}` inline tag:

```ts
/** Props for {@link StatusBadge}. */
```

Deprecated symbols must keep the old name as a re-export with a `@deprecated` tag
— only when an export has actually been renamed:

```ts
/** @deprecated Use {@link ListPanel} instead */
export { ListPanel as OldName };
```

## Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(component): add EmptyState component
fix(ListPanel): correct scroll offset on empty items
docs: update ARCHITECTURE.md with new module
```

Always include the Copilot trailer on automated commits:

```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Reporting issues

Use [GitHub Issues](https://github.com/mpbarbosa/pajussara_tui_comp/issues)
for bugs or feature requests.
