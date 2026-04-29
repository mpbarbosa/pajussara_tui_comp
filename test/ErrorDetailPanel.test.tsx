/**
 * @file ErrorDetailPanel.test.tsx
 * @description Unit tests for ErrorDetailPanel — error/stack trace modal overlay.
 */

import React from 'react';
import { cleanup, render } from 'ink-testing-library';
import { jest } from '@jest/globals';

import ErrorDetailPanelDefault, {
  ErrorDetailPanel,
  type ErrorDetailPanelError,
  type ErrorDetailPanelProps,
} from '../src/ErrorDetailPanel';

describe('ErrorDetailPanel component', () => {
  const baseError: ErrorDetailPanelError = {
    stepId: 'step_03',
    stepName: 'Test Generation',
    message: 'Jest exited with code 1',
    stack: 'Error: Jest exited with code 1\n  at step_03.js:42\n  at async runner.js:10',
  };

  afterEach(() => {
    cleanup();
  });

  const renderPanel = (props: Partial<ErrorDetailPanelProps> = {}) => {
    const onClose = props.onClose ?? jest.fn();
    const error: ErrorDetailPanelError | null = Object.prototype.hasOwnProperty.call(props, 'error')
      ? props.error ?? null
      : baseError;
    return {
      onClose,
      ...render(<ErrorDetailPanel error={error} onClose={onClose} />),
    };
  };

  it('renders error message and step name', () => {
    const { lastFrame } = renderPanel();
    const output = lastFrame() ?? '';

    expect(output).toContain('Test Generation');
    expect(output).toContain('Jest exited with code 1');
    expect(output).toContain('Failed');
  });

  it('renders stack trace lines', () => {
    const { lastFrame } = renderPanel();
    const output = lastFrame() ?? '';

    expect(output).toContain('Stack trace');
    expect(output).toContain('step_03.js:42');
  });

  it('renders close hint', () => {
    const { lastFrame } = renderPanel();
    const output = lastFrame() ?? '';

    expect(output).toContain('[e]');
    expect(output).toContain('[Esc]');
    expect(output).toContain('close');
  });

  it('calls onClose when e is pressed', () => {
    const onClose = jest.fn();
    const { stdin } = renderPanel({ onClose });

    stdin.write('e');

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = jest.fn();
    const { stdin } = renderPanel({ onClose });

    stdin.write('\u001b');
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    expect(onClose).toHaveBeenCalled();
  });

  it('truncates stack traces to 20 lines', () => {
    const longStack = Array.from({ length: 30 }, (_, index) => `  at frame${index}`).join('\n');
    const { lastFrame } = renderPanel({ error: { ...baseError, stack: longStack } });
    const output = lastFrame() ?? '';

    expect(output).toContain('frame0');
    expect(output).toContain('frame19');
    expect(output).not.toContain('frame20');
  });

  it('handles missing stack gracefully', () => {
    const { lastFrame } = renderPanel({ error: { ...baseError, stack: null } });
    const output = lastFrame() ?? '';

    expect(output).toContain('Jest exited with code 1');
    expect(output).not.toContain('Stack trace');
  });

  it('renders gracefully when error is null', () => {
    const { lastFrame } = renderPanel({ error: null });
    const output = lastFrame() ?? '';

    expect(output).toContain('No error recorded');
    expect(output).toContain('[e]');
  });

  it('exports the documented prop and error types', () => {
    const props: ErrorDetailPanelProps = {
      error: baseError,
      onClose: jest.fn(),
    };

    expect(props.error).toEqual(baseError);
  });

  it('default export matches named export', () => {
    expect(ErrorDetailPanelDefault).toBe(ErrorDetailPanel);
  });
});
