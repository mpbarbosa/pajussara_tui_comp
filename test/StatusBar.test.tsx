import React, { act } from 'react';
import { render, cleanup as inkCleanup } from 'ink-testing-library';
import { jest } from '@jest/globals';
import StatusBarDefault, {
  StatusBar,
  type StatusBarHint,
  type StatusBarProps,
} from '../src/StatusBar';

describe('StatusBar component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      inkCleanup();
    });
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const renderComponent = (overrides: Partial<StatusBarProps> = {}) =>
    render(<StatusBar width={80} {...overrides} />);

  it('renders default keybinding hints', () => {
    const { lastFrame } = renderComponent();
    const output = lastFrame() ?? '';

    expect(output).toContain('[q]');
    expect(output).toContain('Quit');
    expect(output).toContain('[Tab]');
    expect(output).toContain('Focus');
    expect(output).not.toContain('Loading…');
  });

  it('renders complete hints when isComplete is true', () => {
    const { lastFrame } = renderComponent({ isComplete: true });
    const output = lastFrame() ?? '';

    expect(output).toContain('[q]');
    expect(output).toContain('Exit');
    expect(output).not.toContain('Quit');
  });

  it('renders custom hints when provided', () => {
    const hints: StatusBarHint[] = [
      { key: 'n', label: 'Next' },
      { key: 'p', label: 'Previous' },
    ];
    const { lastFrame } = renderComponent({ hints });
    const output = lastFrame() ?? '';

    expect(output).toContain('[n]');
    expect(output).toContain('Next');
    expect(output).toContain('[p]');
    expect(output).toContain('Previous');
  });

  it('shows the loading badge and running chronometer when status is loading', () => {
    const { lastFrame } = renderComponent({ status: 'loading', width: 90 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    const output = lastFrame() ?? '';

    expect(output).toContain('Loading');
    expect(output).toContain('0.2s');
  });

  it('shows the done badge when status is done', () => {
    const { lastFrame } = renderComponent({ status: 'done' });
    const output = lastFrame() ?? '';

    expect(output).toContain('Done');
    expect(output).toContain('0.0s');
  });

  it('shows the error message when status is error', () => {
    const { lastFrame } = renderComponent({
      status: 'error',
      errorMessage: 'Network failure',
    });
    const output = lastFrame() ?? '';

    expect(output).toContain('Network');
    expect(output).toContain('failure');
  });

  it('exports StatusBarProps and StatusBarHint types', () => {
    const hints: StatusBarHint[] = [{ key: 'x', label: 'Close' }];
    const props: StatusBarProps = { hints, status: 'idle' };

    expect(props.hints).toEqual(hints);
  });

  it('default export matches named export', () => {
    expect(StatusBarDefault).toBe(StatusBar);
  });
});
