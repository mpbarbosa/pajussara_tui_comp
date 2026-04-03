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
