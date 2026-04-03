# helpers/

Shared display utilities consumed by all `pajussara_tui_comp` components.
Import from the package root of this directory:

```ts
import { formatStepIcon, statusColor, formatDuration } from '../helpers';
```

## Exports

| Function | Signature | Description |
|----------|-----------|-------------|
| `formatStepIcon` | `(status: string) => string` | Maps a status string to a terminal icon character (`✔`, `●`, `✘`, `○`, `·`) |
| `statusColor` | `(status: string) => string` | Maps a status string to an Ink color name (`green`, `cyan`, `red`, `gray`, `white`) |
| `formatDuration` | `(ms: number) => string` | Formats milliseconds as a human-readable string, e.g. `4500` → `"4.5s"`, `61500` → `"1m 1s"` |

## Conventions

- Helpers are pure functions with no side effects.
- All helpers accept `string` or `number` and return `string`.
- Components must **not** duplicate this logic inline — always import from `helpers`.
