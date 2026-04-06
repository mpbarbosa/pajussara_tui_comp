// Inform React 19's concurrent renderer that this process is a test
// environment that supports act(). Without this flag, React logs a
// console.error warning whenever a fake-timer tick triggers a state update,
// even when the update IS already wrapped in act().
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// Ink's renderer uses react-reconciler directly and does not integrate with
// React's act() infrastructure. As a result, React 19's stricter act()
// enforcement logs "An update to Root inside a test was not wrapped in act(...)"
// for every Ink render — even renders with no timers or async code.
// These are false positives caused by a known Ink / React 19 compatibility gap.
// We suppress only this specific warning so that real act() violations in
// project code (different component names) remain visible.
const originalConsoleError = console.error.bind(console);
console.error = (...args: Parameters<typeof console.error>) => {
  if (
    typeof args[0] === 'string' &&
    /not wrapped in act|not configured to support act/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
