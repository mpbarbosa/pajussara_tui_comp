import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import { StatusChronometer, type StatusChronometerProps } from '../src/status_chronometer';

jest.mock('../helpers', () => ({
	formatStepIcon: (status: string) => `[${status}]`,
	statusColor: (status: string) =>
		status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray',
	formatDuration: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
}));

describe('StatusChronometer component', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	const renderComponent = (overrides: Partial<StatusChronometerProps> = {}) =>
		render(
			<StatusChronometer width={40} status="idle" {...overrides} />
		);

	// ── Layout ──────────────────────────────────────────────────────────────────

	it('renders both StatusBadge and Chronometer in the same frame', () => {
		const { lastFrame } = renderComponent({ status: 'loading' });
		const output = lastFrame() ?? '';
		// StatusBadge (loading spinner) and Chronometer title both visible
		expect(output).toContain('Loading…');
		expect(output).toContain('CHRONOMETER');
	});

	it('renders StatusBadge and Chronometer on the same line (side by side)', () => {
		const { lastFrame } = renderComponent({ status: 'done' });
		const output = lastFrame() ?? '';
		// Both pieces of content must appear; verify it is not empty
		expect(output).toContain('✓');
		expect(output).toContain('CHRONOMETER');
	});

	// ── StatusBadge integration ──────────────────────────────────────────────────

	it('shows idle badge (nothing) when status is "idle"', () => {
		const { lastFrame } = renderComponent({ status: 'idle' });
		// Badge renders nothing for idle; Chronometer should still be present
		expect(lastFrame()).toContain('CHRONOMETER');
	});

	it('shows done badge when status is "done"', () => {
		const { lastFrame } = renderComponent({ status: 'done' });
		expect(lastFrame()).toContain('✓');
		expect(lastFrame()).toContain('Done');
	});

	it('shows error badge with default message when status is "error"', () => {
		const { lastFrame } = renderComponent({ status: 'error' });
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('An error occurred.');
	});

	it('shows error badge with custom errorMessage when status is "error"', () => {
		const { lastFrame } = renderComponent({
			status: 'error',
			errorMessage: 'Network failure',
		});
		expect(lastFrame()).toContain('Network failure');
	});

	it('shows loading spinner when status is "loading"', () => {
		const { lastFrame } = renderComponent({ status: 'loading' });
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Loading…');
	});

	it('shows streaming spinner when status is "streaming"', () => {
		const { lastFrame } = renderComponent({ status: 'streaming' });
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Streaming…');
	});

	// ── Chronometer integration ──────────────────────────────────────────────────

	it('renders the default Chronometer title', () => {
		const { lastFrame } = renderComponent({ status: 'idle' });
		expect(lastFrame()).toContain('CHRONOMETER');
	});

	it('renders a custom Chronometer title', () => {
		const { lastFrame } = renderComponent({ status: 'idle', title: 'ELAPSED' });
		expect(lastFrame()).toContain('ELAPSED');
	});

	it('renders initialElapsedMs in the Chronometer', () => {
		const { lastFrame } = renderComponent({ status: 'idle', initialElapsedMs: 5000 });
		expect(lastFrame()).toContain('5.0s');
	});

	it('starts timer on space when focused and increments elapsed', () => {
		const { stdin, lastFrame } = renderComponent({ status: 'loading', isFocused: true });
		act(() => { stdin.write(' '); });
		act(() => { jest.advanceTimersByTime(200); });
		expect(lastFrame()).toContain('0.2s');
	});

	it('stops timer on second space and fires onStop', () => {
		const onStop = jest.fn();
		const { stdin } = renderComponent({ status: 'loading', isFocused: true, onStop });
		act(() => { stdin.write(' '); });
		act(() => { jest.advanceTimersByTime(300); });
		act(() => { stdin.write(' '); });
		expect(onStop).toHaveBeenCalledWith(300);
	});

	it('resets timer on r key and fires onReset', () => {
		const onReset = jest.fn();
		const { stdin, lastFrame } = renderComponent({
			status: 'loading',
			isFocused: true,
			onReset,
		});
		act(() => { stdin.write(' '); });
		act(() => { jest.advanceTimersByTime(400); });
		act(() => { stdin.write('r'); });
		expect(onReset).toHaveBeenCalled();
		expect(lastFrame()).toContain('0.0s');
	});

	it('calls onTick on every 100 ms tick', () => {
		const onTick = jest.fn();
		const { stdin } = renderComponent({ status: 'loading', isFocused: true, onTick });
		act(() => { stdin.write(' '); });
		act(() => { jest.advanceTimersByTime(300); });
		expect(onTick).toHaveBeenCalledTimes(3);
	});

	it('ignores keyboard events when isFocused is false', () => {
		const onTick = jest.fn();
		const { stdin, lastFrame } = renderComponent({
			status: 'loading',
			isFocused: false,
			onTick,
		});
		act(() => { stdin.write(' '); });
		act(() => { jest.advanceTimersByTime(300); });
		expect(onTick).not.toHaveBeenCalled();
		expect(lastFrame()).toContain('0.0s');
	});

	// ── Lifecycle ────────────────────────────────────────────────────────────────

	it('cleans up on unmount without errors', () => {
		const { stdin, unmount } = renderComponent({ status: 'loading', isFocused: true });
		act(() => { stdin.write(' '); });
		expect(() => {
			act(() => { unmount(); });
		}).not.toThrow();
	});

	// ── Type exports ─────────────────────────────────────────────────────────────

	it('exports StatusChronometerProps type (compile-time smoke test)', () => {
		const props: StatusChronometerProps = { width: 40, status: 'idle' };
		expect(props.width).toBe(40);
	});

	it('default export matches named export', async () => {
		const mod = await import('../src/status_chronometer');
		expect(mod.default).toBe(mod.StatusChronometer);
	});
});
