# Usability Heuristics for pajussara_tui_comp

This guide maps Nielsen's 10 Usability Heuristics to the specific features, props, and helpers
provided by this library. It is intended as a reference for contributors adding new components or
props, and for consumers evaluating how well their application-level usage aligns with established
usability principles.

> **Scope note:** pajussara_tui_comp is a low-level TUI component library. Some heuristics
> (particularly #3 and #9) touch concerns that belong to the consuming application rather than the
> library itself. Where the library does not implement a behaviour directly, this guide explains
> what the library provides as a foundation and how a consumer can build on it.

---

## 1. Visibility of System Status

> *Keep users informed about what is going on, through appropriate feedback within reasonable time.*

**Library support:** Every `ListItem` carries a `status` string that drives both the icon and
colour rendered for that item. The shared helpers translate status values into visual feedback
automatically:

| `status` value | Icon (`formatStepIcon`) | Colour (`statusColor`) |
|----------------|-------------------------|------------------------|
| `'pending'`    | `○`                     | gray                   |
| `'running'`    | `●`                     | cyan                   |
| `'done'`       | `✔`                     | green                  |
| `'error'`      | `✘`                     | red                    |

The `currentItemId` prop highlights the actively-running item in bold so the user can locate the
current operation at a glance without scanning the full list.

Elapsed time is surfaced automatically: a `'running'` item shows `…` as a live activity indicator,
and a `'done'` item shows its `duration` (milliseconds) formatted by `formatDuration` — for
example `4.5s` or `1m 2s`.

**Usage pattern:**

```ts
const item: ListItem = {
  id: 'build',
  name: 'Build',
  status: 'running',   // ● cyan, "…" duration indicator
  duration: null,
};
```

---

## 2. Match Between System and the Real World

> *Use words, phrases, and concepts familiar to the user rather than system-oriented jargon.*

**Library support:** The four built-in status values (`'pending'`, `'running'`, `'done'`,
`'error'`) map directly to the language used in CI/CD pipelines, build tools, and task runners —
the primary domains where a TUI step-list component appears.

The icons chosen for each status (○ ● ✔ ✘) are widely recognised conventions in terminal UIs:
a hollow circle for "not started", a filled circle for "in progress", a check for success, and
a cross for failure.

The `title` prop defaults to `'STEPS'`, which is intentionally generic. Consumers should override
it with domain-appropriate language:

```ts
// Generic:  title="STEPS"
// CI build: title="BUILD STAGES"
// Deploy:   title="DEPLOYMENT"
```

The `emptyText` prop (default: `'Waiting for steps…'`) should similarly be overridden to reflect
the real-world context:

```ts
emptyText="No tasks queued"
emptyText="Waiting for pipeline…"
```

---

## 3. User Control and Freedom

> *Support undo and redo so users can leave unwanted states without having to go through extended
> dialogue.*

**Library support (selection):** `ListPanel` implements a controlled-selection pattern. The
`selectedItemId` prop accepts an externally-managed selection, and `onSelectItem` fires whenever
the user moves the cursor. This lets the consuming application own the selection state and restore
it freely:

```ts
const [selected, setSelected] = React.useState<string | null>(null);

React.createElement(ListPanel, {
  items,
  currentItemId,
  width: 40,
  selectedItemId: selected,
  onSelectItem: setSelected,
  isFocused: true,
});
```

**Consumer responsibility (undo/redo):** The library does not implement undo/redo for item
operations — doing so requires knowledge of the application's domain model. A consumer can provide
undo/redo by maintaining a history stack in their own state and re-passing updated `items` and
`selectedItemId` props on each state change. The library will re-render immediately on prop
updates.

---

## 4. Consistency and Standards

> *Users should not have to wonder whether different words, situations, or actions mean the same
> thing.*

**Library support:** Status icons and colours are defined once in the shared `helpers` module and
reused by every component. Adding a new component to the library means importing from
`'../helpers'` rather than re-implementing icon or colour logic inline, ensuring all panels present
the same visual language.

Keyboard navigation follows established TUI conventions: arrow keys (`↑`/`↓`) for users
unfamiliar with terminal shortcuts, and vi-style keys (`k`/`j`) for keyboard-centric workflows.
Both bindings are active simultaneously so the two user populations do not need to adapt.

When building multi-panel layouts, consistency is maintained through `isFocused`: the focused panel
renders a white border while unfocused panels use gray, giving a consistent affordance for "this
panel is active" across the application.

---

## 5. Error Prevention

> *Prevent problems from occurring in the first place, rather than relying on error messages.*

**Library support:** The `isFocused` prop gates all `useInput` event handling. Only the panel that
holds focus consumes key events:

```ts
useInput(handler, { isActive: isFocused });
```

Without this gate, every mounted `ListPanel` would respond to the same keystrokes simultaneously,
producing unpredictable navigation across panels. Passing `isFocused={false}` (the default) means
a panel is inert until the application explicitly activates it.

The `emptyText` prop prevents a blank, context-free panel from being shown when no items have
arrived yet. Rather than rendering an empty box that looks broken, the panel always displays
informative text in the empty state.

---

## 6. Recognition Rather Than Recall

> *Minimise the user's memory load by making objects, actions, and options visible.*

**Library support:** Status information is always visible inline — the icon and colour for every
item are rendered on every frame without requiring the user to select or hover over an item to see
its state.

The `title` prop labels the panel so users scanning a multi-panel layout can identify each panel's
purpose without memorising its position.

The `>` cursor indicator is drawn next to the currently-selected row when the panel is focused,
making the selection unambiguous. The cursor disappears when `isFocused` is false, so the user is
never misled into thinking a panel is interactive when it isn't.

---

## 7. Flexibility and Efficiency of Use

> *Allow users to tailor frequent actions. Accelerators — unseen by the novice user — may often
> speed up the interaction for the expert user.*

**Library support:** `ListPanel` supports two navigation idioms simultaneously:

- **Arrow keys** (`↑` / `↓`) — discoverable, require no prior knowledge
- **Vi-style keys** (`k` / `j`) — efficient for keyboard-centric users

Both are always active when the panel is focused; no configuration is required to enable the
vi-style bindings.

For multi-panel applications, `isFocused` allows focus to move between panels programmatically.
The consuming application can implement tab-cycling or any focus management strategy without
changes to the library:

```ts
const [focusedPanel, setFocusedPanel] = React.useState<'steps' | 'log'>('steps');

// Pass isFocused per panel
React.createElement(ListPanel, { ..., isFocused: focusedPanel === 'steps' })
React.createElement(LogPanel,  { ..., isFocused: focusedPanel === 'log'   })
```

---

## 8. Aesthetic and Minimalist Design

> *Dialogues should not contain irrelevant or rarely-needed information. Every extra unit of
> information competes with the relevant units of information.*

**Library support:** `ListPanel` uses Ink's `Box` and `Text` primitives to compose a clean layout
with no extraneous chrome. The only structural elements are:

- A single-line border (`borderStyle: 'single'`) — provides panel separation without visual noise
- A bold title row — identifies the panel
- Per-item rows containing only the cursor, icon, name, and duration

Duration is shown only when meaningful: `'running'` items show `…` (activity), `'done'` items show
the elapsed time, and items in any other state show nothing. This avoids filling the panel with
empty or zero-value cells.

Long item names are truncated with an ellipsis (`…`) to the available column width, ensuring the
panel layout never overflows its `width` prop.

---

## 9. Help Users Recognise, Diagnose, and Recover from Errors

> *Error messages should be expressed in plain language, indicate the problem precisely, and
> constructively suggest a solution.*

**Library support:** Items in the `'error'` status are rendered with the `✘` icon in red, making
failed items immediately identifiable in a list of otherwise-passing steps. No scanning or
decoding is needed.

```ts
const failedItem: ListItem = {
  id: 'tests',
  name: 'Run tests',
  status: 'error',   // ✘ rendered in red
  duration: 3200,    // 3.2s shown — useful for diagnosing timeouts
};
```

**Consumer responsibility (recovery):** The library does not implement retry or recovery actions —
those are domain-specific. A consumer can allow the user to trigger a retry by listening for a
keypress in the application layer and updating the relevant item's `status` back to `'pending'` or
`'running'`:

```ts
useInput((input) => {
  if (input === 'r' && selectedItem?.status === 'error') {
    retryItem(selectedItem.id);          // consumer-defined
    updateItemStatus(selectedItem.id, 'running');
  }
});
```

When the status prop changes, `ListPanel` re-renders automatically, so the error indicator is
replaced with the running indicator without any additional library interaction.

---

## 10. Help and Documentation

> *Even though it is better if the system can be used without documentation, it may be necessary to
> provide help. Such information should be easy to search and focused on the user's task.*

**Library support:** The primary reference for this library is the [README](../README.md), which
documents every prop, status value, keyboard binding, and usage pattern with runnable code
examples.

Within the UI itself, the `title` and `emptyText` props allow consumers to embed contextual labels
directly in the terminal output — reducing the need for users to consult external documentation to
understand what a panel represents or why it is empty:

```ts
React.createElement(ListPanel, {
  title: 'TEST SUITE',
  emptyText: 'No tests discovered yet — check your test glob.',
  items,
  currentItemId,
  width: 50,
  isFocused: true,
})
```

TypeScript consumers benefit from the exported `ListPanelProps` and `ListItem` interfaces, which
surface prop descriptions as IDE hover documentation without leaving the editor.
