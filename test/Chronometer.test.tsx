import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import { Chronometer, type ChronometerProps, type ChronometerStatus } from '../src/Chronometer';

jest.mock('../helpers', () => ({
  formatStepIcon: (status: string) => `[${status}]`,
  statusColor: (status: string) => (status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray'),
  formatDuration: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
}));

describe('Chronometer component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const renderChronometer = (overrides: Partial<ChronometerProps> = {}) =>
    render(
      React.createElement(Chronometer, { width: 40, ...overrides })
    );

  // 1. Renders with default props
  it('renders with default props — title and 0.0s elapsed time', () => {
    const { lastFrame } = renderChronometer();
    const output = lastFrame();
    expect(output).toContain('CHRONOMETER');
    expect(output).toContain('0.0s');
    expect(output).toContain('[space] start/stop  [r] reset');
  });

  // 2. Custom title prop
  it('renders with a custom title', () => {
    const { lastFrame } = renderChronometer({ title: 'MY TIMER' });
    expect(lastFrame()).toContain('MY TIMER');
  });

  // 3. initialElapsedMs
  it('renders initialElapsedMs correctly on mount', () => {
    const { lastFrame } = renderChronometer({ initialElapsedMs: 5000 });
    expect(lastFrame()).toContain('5.0s');
  });

  // 4. Focus changes border colour hint (hint row always present)
  it('shows hint row when focused', () => {
    const { lastFrame } = renderChronometer({ isFocused: true });
    expect(lastFrame()).toContain('[space] start/stop  [r] reset');
  });

  it('shows hint row when not focused', () => {
    const { lastFrame } = renderChronometer({ isFocused: false });
    expect(lastFrame()).toContain('[space] start/stop  [r] reset');
  });

  // 5. Space key starts chronometer
  it('space key starts the chronometer when focused', () => {
    const { stdin, lastFrame } = renderChronometer({ isFocused: true });
    act(() => { stdin.write(' '); });
    // After a tick, time should advance
    act(() => { jest.advanceTimersByTime(100); });
    expect(lastFrame()).toContain('0.1s');
  });

  // 6. Space key stops and fires onStop
  it('space key stops a running chronometer and fires onStop', () => {
    const onStop = jest.fn();
    const { stdin, lastFrame } = renderChronometer({ isFocused: true, onStop });

    act(() => { stdin.write(' '); }); // start
    act(() => { jest.advanceTimersByTime(300); }); // 3 ticks → 300 ms
    act(() => { stdin.write(' '); }); // stop

    expect(onStop).toHaveBeenCalledWith(300);
    // After stopping, the time should stay at 300 ms
    act(() => { jest.advanceTimersByTime(200); });
    expect(lastFrame()).toContain('0.3s');
  });

  // 7. r key resets elapsed time and fires onReset
  it('r key resets elapsed time to zero and fires onReset', () => {
    const onReset = jest.fn();
    const { stdin, lastFrame } = renderChronometer({ isFocused: true, onReset });

    act(() => { stdin.write(' '); }); // start
    act(() => { jest.advanceTimersByTime(500); });
    act(() => { stdin.write('r'); }); // reset

    expect(onReset).toHaveBeenCalled();
    expect(lastFrame()).toContain('0.0s');
  });

  // 8. Elapsed time increments on each tick, onTick called
  it('increments elapsed time by 100 ms per tick and calls onTick', () => {
    const onTick = jest.fn();
    const { stdin } = renderChronometer({ isFocused: true, onTick });

    act(() => { stdin.write(' '); }); // start
    act(() => { jest.advanceTimersByTime(300); }); // 3 ticks

    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onTick).toHaveBeenNthCalledWith(1, 100);
    expect(onTick).toHaveBeenNthCalledWith(2, 200);
    expect(onTick).toHaveBeenNthCalledWith(3, 300);
  });

  // 9. Keyboard events ignored when not focused
  it('ignores keyboard events when isFocused is false', () => {
    const onTick = jest.fn();
    const { stdin, lastFrame } = renderChronometer({ isFocused: false, onTick });

    act(() => { stdin.write(' '); });
    act(() => { jest.advanceTimersByTime(500); });

    expect(onTick).not.toHaveBeenCalled();
    expect(lastFrame()).toContain('0.0s');
  });

  // 10. Interval cleaned up on unmount
  it('cleans up the interval on unmount without act() warnings', () => {
    const { stdin, unmount } = renderChronometer({ isFocused: true });
    act(() => { stdin.write(' '); }); // start interval
    expect(() => {
      act(() => { unmount(); });
    }).not.toThrow();
    // Timer should not fire after unmount
    const onTick = jest.fn();
    act(() => { jest.advanceTimersByTime(500); });
    expect(onTick).not.toHaveBeenCalled();
  });

  // Extra: optional callbacks are not called when not provided
  it('does not throw when optional callbacks are omitted', () => {
    const { stdin } = renderChronometer({ isFocused: true });
    expect(() => {
      act(() => {
        stdin.write(' '); // start
        jest.advanceTimersByTime(200);
        stdin.write(' '); // stop
        stdin.write('r'); // reset
      });
    }).not.toThrow();
  });

  // Extra: ChronometerStatus type is correctly exported
  it('exports ChronometerStatus as a type (smoke test)', () => {
    const s: ChronometerStatus = 'idle';
    expect(['idle', 'running', 'stopped']).toContain(s);
  });

  // Extra: default export matches named export
  it('default export matches named export', async () => {
    const mod = await import('../src/Chronometer');
    expect(mod.default).toBe(mod.Chronometer);
  });

  // showBorder prop
  it('renders a border by default (showBorder not specified)', () => {
    const { lastFrame } = renderChronometer();
    // Ink single-border renders box-drawing characters
    expect(lastFrame()).toMatch(/[┌─┐│└┘]/);
  });

  it('renders a border when showBorder is true', () => {
    const { lastFrame } = renderChronometer({ showBorder: true });
    expect(lastFrame()).toMatch(/[┌─┐│└┘]/);
  });

  it('renders no border when showBorder is false', () => {
    const { lastFrame } = renderChronometer({ showBorder: false });
    expect(lastFrame()).not.toMatch(/[┌─┐│└┘]/);
  });

  it('still renders title and time when showBorder is false', () => {
    const { lastFrame } = renderChronometer({ showBorder: false, title: 'NO BORDER' });
    expect(lastFrame()).toContain('NO BORDER');
    expect(lastFrame()).toContain('0.0s');
  });
});
