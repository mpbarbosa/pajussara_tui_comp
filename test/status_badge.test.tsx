import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import StatusBadge from '../src/status_badge';

describe('StatusBadge', () => {
	let unmountCurrent: (() => void) | undefined;

	afterEach(() => {
		unmountCurrent?.();
		unmountCurrent = undefined;
	});

	it('renders nothing for idle status', () => {
		const { lastFrame, unmount } = render(<StatusBadge status="idle" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toBe('');
	});

	it('renders loading spinner and label for loading status', () => {
		jest.useFakeTimers();
		const { lastFrame, unmount } = render(<StatusBadge status="loading" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Loading…');
		jest.useRealTimers();
	});

	it('animates spinner frames for loading status', () => {
		jest.useFakeTimers();
		const { lastFrame, unmount } = render(<StatusBadge status="loading" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('⠋');
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(lastFrame()).toContain('⠙');
		act(() => {
			jest.advanceTimersByTime(400);
		});
		expect(lastFrame()).toMatch(/⠇/);
		jest.useRealTimers();
	});

	it('renders streaming spinner and label for streaming status', () => {
		jest.useFakeTimers();
		const { lastFrame, unmount } = render(<StatusBadge status="streaming" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('⠋');
		expect(lastFrame()).toContain('Streaming…');
		jest.useRealTimers();
	});

	it('animates spinner frames for streaming status', () => {
		jest.useFakeTimers();
		const { lastFrame, unmount } = render(<StatusBadge status="streaming" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('⠋');
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(lastFrame()).toContain('⠙');
		act(() => {
			jest.advanceTimersByTime(400);
		});
		expect(lastFrame()).toMatch(/⠇/);
		jest.useRealTimers();
	});

	it('renders done indicator for done status', () => {
		const { lastFrame, unmount } = render(<StatusBadge status="done" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('✓');
		expect(lastFrame()).toContain('Done');
	});

	it('renders error indicator and default message for error status', () => {
		const { lastFrame, unmount } = render(<StatusBadge status="error" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('An error occurred.');
	});

	it('renders error indicator and custom message for error status', () => {
		const { lastFrame, unmount } = render(<StatusBadge status="error" errorMessage="Custom error" />);
		unmountCurrent = unmount;
		expect(lastFrame()).toContain('✗');
		expect(lastFrame()).toContain('Custom error');
	});

	it('does not crash if errorMessage is empty string', () => {
		const { lastFrame, unmount } = render(<StatusBadge status="error" errorMessage="" />);
		unmountCurrent = unmount;
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
