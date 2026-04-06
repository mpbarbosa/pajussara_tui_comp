# Architecture

`pajussara_tui_comp` is an [Ink](https://github.com/vadimdemedes/ink) TUI component
library written in TypeScript. Components render in the terminal using React's
programming model via Ink's `Box`/`Text` primitives.

## Directory structure

```
pajussara_tui_comp/
├── src/                        # Component source files (.tsx / .ts)
│   ├── index.ts                # Public API barrel — re-exports all components and types
│   ├── types.ts                # Shared type definitions (PanelStatus)
│   ├── ListPanel.tsx           # Scrollable, keyboard-navigable list panel
│   ├── StreamViewer.tsx        # Live AI token stream panel with history navigation
│   ├── Chronometer.tsx         # Elapsed-time display with start/stop/reset controls
│   ├── status_badge.tsx        # Animated spinner / completion / error indicator
│   └── status_chronometer.tsx  # StatusBadge + Chronometer side-by-side composite
├── helpers/                    # Shared display utilities imported by components
│   └── index.ts                # formatStepIcon · statusColor · formatDuration
├── test/                       # Jest test suite
├── dist/                       # Compiled output (tracked for jsDelivr CDN delivery)
│   └── src/                    # Mirrors src/ structure after tsc compilation
├── docs/                       # Project documentation
├── demos/                      # Runnable usage examples (e.g. listpanel-cities.tsx, status-chronometer-cities.tsx)
├── scripts/                    # Shell scripts (deploy.sh, colors.sh)
└── .github/                    # GitHub Actions workflows and Copilot skills
```

## Module boundaries

```
src/ListPanel.tsx
      └── import ← helpers/index.ts   (formatStepIcon, statusColor, formatDuration)
      └── import ← ink                (Box, Text, useInput)
      └── import ← react              (React, useState, useEffect)

src/StreamViewer.tsx
      └── import ← ink                (Box, Text, useInput)
      └── import ← react              (React, useState, useEffect, useRef)

src/Chronometer.tsx
      └── import ← helpers/index.ts   (formatDuration)
      └── import ← ink                (Box, Text, useInput)
      └── import ← react              (React, useState, useEffect)

src/status_badge.tsx
      └── import ← src/types.ts       (PanelStatus)
      └── import ← ink                (Box, Text)
      └── import ← react              (React, useState, useEffect)

src/status_chronometer.tsx
      └── import ← src/status_badge.tsx   (StatusBadge, StatusBadgeProps)
      └── import ← src/Chronometer.tsx    (Chronometer, ChronometerProps)
      └── import ← ink                    (Box)
      └── import ← react                  (React)

src/index.ts
      └── re-exports ← src/ListPanel.tsx
      └── re-exports ← src/StreamViewer.tsx
      └── re-exports ← src/Chronometer.tsx
      └── re-exports ← src/status_badge.tsx
      └── re-exports ← src/status_chronometer.tsx
      └── re-exports ← src/types.ts
```

## Rendering model

Components are pure React function components. All output is declarative:
`React.createElement(Box, ...)` / `React.createElement(Text, ...)`. No JSX
syntax is used in source files — `.tsx` extension is kept for type-checking
only.

## Build

TypeScript compiles `src/**/*` and `helpers/**/*` to `dist/` via `tsc`:

```bash
npm run build      # tsc → dist/
npm run typecheck  # tsc --noEmit (no output)
```

`tsconfig.json` settings of note:

| Setting | Value | Reason |
|---------|-------|--------|
| `rootDir` | `.` | Preserves `src/` and `helpers/` hierarchy under `dist/` |
| `outDir` | `dist` | Output root |
| `module` | `ESNext` | ESM output |
| `moduleResolution` | `Bundler` | Compatible with Ink/React consumer bundlers |
| `declaration` | `true` | Emits `.d.ts` for library consumers |

## CDN delivery

The `dist/` directory is committed and tagged. Consumers can reference
compiled files directly via jsDelivr:

```
https://cdn.jsdelivr.net/gh/mpbarbosa/pajussara_tui_comp@<version>/dist/src/index.js
```

Deployment is handled by `scripts/deploy.sh` (invoked via `ai-workflow deploy`).
