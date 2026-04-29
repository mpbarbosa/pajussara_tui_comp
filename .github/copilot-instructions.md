# Copilot Instructions

This file provides durable, high-signal guidance for Copilot-assisted development in this repository. For detailed or evolving information, refer to the authoritative documentation listed below.

## Project Overview

`pajussara_tui_comp` is an [Ink](https://github.com/vadimdemedes/ink) TUI component library in TypeScript. Components render in the terminal using React's programming model.

## Architecture Boundaries

- **Primary source modules**: `src/`
- **Shared helpers**: `src/helpers/`
- **Workflow config**: `.workflow-config.yaml`
- **Runtime artifacts**: `.ai_workflow/`

For further details, see [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) and [README.md](../README.md).

## Validation Commands

- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Build**: `npm run build`

## Module System and Entry Points

- ESM modules (`"type": "module"` in `package.json`)
- Main entry: `dist/src/index.js`
- Types entry: `dist/src/index.d.ts`
- See `package.json` for full export map.

## Key Coding Conventions

- **Component creation**: Use `React.createElement(...)` (no JSX), even in `.tsx` files.
- **File headers**: Start each source file with a JSDoc header including `@fileoverview`, `@module`, `@version`, and `@since`.
- **Section dividers**: Use Unicode box-drawing comments to separate logical blocks.
- **Props and data interfaces**: Define above the component; prefer `interface` over `type` for object shapes.
- **Exports**: Each component must have both a named and a default export. When renaming, keep the old name as a deprecated alias.
- **Naming**: Use domain-agnostic, intention-revealing names for all identifiers.
- **Focus and input**: Components accept `isFocused?: boolean`; keyboard handlers should respect focus.
- **Status display**: Use shared helpers from `src/helpers` for status color and icon logic.

## Copilot Custom Skills

- The `js-to-ts` skill (`.github/skills/js-to-ts/SKILL.md`) converts `.js` files to TypeScript, enforcing the conventions above.

## Authoritative Documentation

For comprehensive and current information, refer to:
- [README.md](../README.md)
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [CHANGELOG.md](../CHANGELOG.md)
