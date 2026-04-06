import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import type { CitiesApp as CitiesAppType } from '../demos/listpanel-cities2.js';

// ── ESM mocks (must be set up before dynamic import of demo) ──────────────────
// The demo imports helpers; mock them so formatDuration returns predictable values.
jest.unstable_mockModule('../helpers/index.js', () => ({
  formatStepIcon: (status: string) => `[${status}]`,
  statusColor: (status: string) => (status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray'),
  formatDuration: (ms: number) => `${ms}ms`,
}));

// ── Module refs (populated after mocks are registered) ────────────────────────
let CitiesApp!: typeof CitiesAppType;
let CITIES!: string[];
let VISIT_MS!: number;

beforeAll(async () => {
  const mod = await import('../demos/listpanel-cities2.js');
  CitiesApp = mod.CitiesApp;
  CITIES = mod.CITIES;
  VISIT_MS = mod.VISIT_MS;
});

// Helper: advance fake timers one step at a time so React can flush effects
// between each timer fire. Required for cascading setTimeout chains.
function advanceTimersBySteps(steps: number, stepMs: number): void {
  for (let i = 0; i < steps; i++) {
    act(() => { jest.advanceTimersByTime(stepMs + 10); });
  }
}

describe('listpanel-cities2 demo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows CITIES title and Loading… on initial render', () => {
    const { lastFrame } = render(React.createElement(CitiesApp, null));
    const output = lastFrame();
    expect(output).toContain('CITIES');
    expect(output).toContain('Loading…');
  });

  it('transitions badge to Done after all cities are visited', () => {
    const { lastFrame } = render(React.createElement(CitiesApp, null));
    advanceTimersBySteps(CITIES.length + 1, VISIT_MS);
    const output = lastFrame();
    expect(output).toContain('Done');
    expect(output).toContain('CITIES');
  });

  it('shows CITIES title throughout the tour', () => {
    const { lastFrame } = render(React.createElement(CitiesApp, null));

    // midway through the tour — still loading
    advanceTimersBySteps(Math.floor(CITIES.length / 2), VISIT_MS);
    expect(lastFrame()).toContain('CITIES');
    expect(lastFrame()).toContain('Loading…');

    // finish the tour — now done
    advanceTimersBySteps(CITIES.length + 1, VISIT_MS);
    expect(lastFrame()).toContain('CITIES');
    expect(lastFrame()).toContain('Done');
  });
});
