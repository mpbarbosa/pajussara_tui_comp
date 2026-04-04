import React from 'react';
import { render, act } from 'ink-testing-library';
import StatusBadge from '../src/status_badge';

describe('StatusBadge', () => {
	it('renders nothing for idle status', () => {
		const { lastFrame } = render(<StatusBadge status="idle" />);
		expect(lastFrame()).toBe('');
	});

	it('renders loading spinner and label for loading status', () => {
		const { lastFrame } = render(<StatusBadge status="loading" />);
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Loading…');
	});

	it('animates spinner frames for loading status', () => {
		jest.useFakeTimers();
		const { lastFrame } = render(<StatusBadge status="loading" />);
		expect(lastFrame()).toContain('⠋');
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(lastFrame()).toContain('⠙');
		act(() => {
			jest.advanceTimersByTime(500);
		});
		expect(lastFrame()).toMatch(/⠇/);
		jest.useRealTimers();
	});

	it('renders streaming spinner and label for streaming status', () => {
		const { lastFrame } = render(<StatusBadge status="streaming" />);
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Streaming…');
	});

	it('animates spinner frames for streaming status', () => {
		jest.useFakeTimers();
		const { lastFrame } = render(<StatusBadge status="streaming" />);
		expect(lastFrame()).toContain('⠋');
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(lastFrame()).toContain('⠙');
		act(() => {
			jest.advanceTimersByTime(500);
		});
		expect(lastFrame()).toMatch(/⠇/);
		jest.useRealTimers();
	});

	it('renders done indicator for done status', () => {
		const { lastFrame } = render(<StatusBadge status="done" />);
		expect(lastFrame()).toContain('✓');
		expect(lastFrame()).toContain('Done');
	});

	it('renders error indicator and default message for error status', () => {
		const { lastFrame } = render(<StatusBadge status="error" />);
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('An error occurred.');
	});

	it('renders error indicator and custom message for error status', () => {
		const { lastFrame } = render(<StatusBadge status="error" errorMessage="Custom error" />);
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('Custom error');
	});

	it('does not crash if errorMessage is empty string', () => {
		const { lastFrame } = render(<StatusBadge status="error" errorMessage="" />);
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('');
	});

	it('cleans up interval on unmount for loading/streaming', () => {
		jest.useFakeTimers();
		const { unmount } = render(<StatusBadge status="loading" />);
		unmount();
		// No explicit assertion; this checks for cleanup without error
		jest.useRealTimers();
	});
});
