import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { CitiesApp, CITIES, VISIT_MS } from '../demo/listpanel-cities2';

// Prevent the module-level render() call from doing anything
jest.mock('ink', () => {
  const actual = jest.requireActual<typeof import('ink')>('ink');
  return { ...actual, render: jest.fn() };
});

jest.mock('../helpers', () => ({
  formatStepIcon: (status: string) => `[${status}]`,
  statusColor: (status: string) => (status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray'),
  formatDuration: (ms: number) => `${ms}ms`,
}));

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
    act(() => {
      jest.advanceTimersByTime(CITIES.length * VISIT_MS + 100);
    });
    const output = lastFrame();
    expect(output).toContain('Done');
    expect(output).toContain('CITIES');
  });

  it('shows CITIES title throughout the tour', () => {
    const { lastFrame } = render(React.createElement(CitiesApp, null));

    // midway through the tour — still loading
    act(() => {
      jest.advanceTimersByTime(Math.floor(CITIES.length / 2) * VISIT_MS);
    });
    expect(lastFrame()).toContain('CITIES');
    expect(lastFrame()).toContain('Loading…');

    // finish the tour — now done
    act(() => {
      jest.advanceTimersByTime(CITIES.length * VISIT_MS + 100);
    });
    expect(lastFrame()).toContain('CITIES');
    expect(lastFrame()).toContain('Done');
  });
});
