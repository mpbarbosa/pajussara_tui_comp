/**
 * @fileoverview Tests for reusable TUI helper functions
 * @module helpers/reusable.test
 *
 * Jest test suite for src/helpers/reusable.ts
 */

import {
  formatStepIcon,
  statusColor,
  formatDuration,
  formatTimestamp,
  formatEta,
  formatProgressBar,
  formatProgressLine,
  truncateLogLine,
  keepLast,
  terminalIsSufficient,
  stepsPanelWidth,
  filterLogLines,
  highlightSearchMatch,
  truncateStackTrace,
  formatStepDetail,
  LogSearchEntry,
  StepDetailInput,
  StepAlternative,
} from '../../src/helpers/reusable';

describe('formatStepIcon', () => {
  it('returns correct icon for known statuses', () => {
    expect(formatStepIcon('running')).toBe('⚡');
    expect(formatStepIcon('done')).toBe('✅');
    expect(formatStepIcon('skipped')).toBe('⊘');
    expect(formatStepIcon('error')).toBe('❌');
    expect(formatStepIcon('pending')).toBe('⏳');
  });
  it('returns default icon for unknown status', () => {
    expect(formatStepIcon('unknown')).toBe('⏳');
    expect(formatStepIcon('')).toBe('⏳');
  });
});

describe('statusColor', () => {
  it('returns correct color for known statuses', () => {
    expect(statusColor('running')).toBe('yellow');
    expect(statusColor('done')).toBe('green');
    expect(statusColor('skipped')).toBe('gray');
    expect(statusColor('error')).toBe('red');
    expect(statusColor('pending')).toBe('gray');
  });
  it('returns default color for unknown status', () => {
    expect(statusColor('unknown')).toBe('gray');
    expect(statusColor('')).toBe('gray');
  });
});

describe('formatDuration', () => {
  it('formats seconds under 60', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(15000)).toBe('15s');
    expect(formatDuration(59999)).toBe('1m');
  });
  it('formats minutes and seconds', () => {
    expect(formatDuration(60000)).toBe('1m');
    expect(formatDuration(61000)).toBe('1m1s');
    expect(formatDuration(125000)).toBe('2m5s');
    expect(formatDuration(120000)).toBe('2m');
  });
  it('handles negative and non-finite values', () => {
    expect(formatDuration(-1)).toBe('0s');
    expect(formatDuration(Number.NaN)).toBe('0s');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('0s');
  });
});

describe('formatTimestamp', () => {
  it('formats timestamp as [hh:mm:ss]', () => {
    const date = new Date('2023-01-01T05:06:07Z');
    expect(formatTimestamp(date.getTime())).toMatch(/^\[\d{2}:\d{2}:\d{2}\]$/);
  });
});

describe('formatEta', () => {
  it('returns null for pct <= 0', () => {
    expect(formatEta(1000, 0)).toBeNull();
    expect(formatEta(1000, -5)).toBeNull();
  });
  it('returns "Done" for pct >= 100', () => {
    expect(formatEta(1000, 100)).toBe('Done');
    expect(formatEta(1000, 150)).toBe('Done');
  });
  it('returns ETA string for valid pct', () => {
    expect(formatEta(1000, 50)).toMatch(/^ETA \d+s$/);
    expect(formatEta(60000, 25)).toMatch(/^ETA \d+m(\d+s)?$/);
  });
});

describe('formatProgressBar', () => {
  it('renders correct bar for 0%, 50%, 100%', () => {
    expect(formatProgressBar(0, 10)).toBe('░'.repeat(10));
    expect(formatProgressBar(50, 10)).toBe('█████░░░░░');
    expect(formatProgressBar(100, 10)).toBe('██████████');
  });
  it('enforces minimum width of 4', () => {
    expect(formatProgressBar(50, 2)).toBe('██░░');
    expect(formatProgressBar(50, 0)).toBe('██░░');
  });
  it('clamps pct between 0 and 100', () => {
    expect(formatProgressBar(-10, 10)).toBe('░'.repeat(10));
    expect(formatProgressBar(150, 10)).toBe('██████████');
  });
});

describe('formatProgressLine', () => {
  it('includes bar, percent, elapsed, and ETA', () => {
    const line = formatProgressLine(50, 10000, 10);
    expect(line).toMatch(/█+░+ +50% +Elapsed \d+s +ETA \d+s/);
  });
  it('omits ETA if pct <= 0', () => {
    const line = formatProgressLine(0, 10000, 10);
    expect(line).toMatch(/Elapsed \d+s$/);
  });
});

describe('truncateLogLine', () => {
  it('returns empty string for non-string or non-positive width', () => {
    // @ts-expect-error
    expect(truncateLogLine(null, 10)).toBe('');
    expect(truncateLogLine('abc', 0)).toBe('');
    expect(truncateLogLine('abc', -1)).toBe('');
  });
  it('returns line if within maxWidth', () => {
    expect(truncateLogLine('abc', 3)).toBe('abc');
    expect(truncateLogLine('abc', 4)).toBe('abc');
  });
  it('truncates and adds ellipsis if too long', () => {
    expect(truncateLogLine('abcdef', 4)).toBe('abc…');
    expect(truncateLogLine('abcdef', 2)).toBe('a…');
  });
});

describe('keepLast', () => {
  it('returns last n elements', () => {
    expect(keepLast([1, 2, 3, 4], 2)).toEqual([3, 4]);
    expect(keepLast([1, 2], 5)).toEqual([1, 2]);
  });
  it('returns empty for non-array or n <= 0', () => {
    // @ts-expect-error
    expect(keepLast(null, 2)).toEqual([]);
    expect(keepLast([1, 2], 0)).toEqual([]);
    expect(keepLast(undefined, 2)).toEqual([]);
  });
});

describe('terminalIsSufficient', () => {
  it('returns true for >= 80x20', () => {
    expect(terminalIsSufficient(80, 20)).toBe(true);
    expect(terminalIsSufficient(100, 30)).toBe(true);
  });
  it('returns false for too small', () => {
    expect(terminalIsSufficient(79, 20)).toBe(false);
    expect(terminalIsSufficient(80, 19)).toBe(false);
  });
});

describe('stepsPanelWidth', () => {
  it('returns 35% of totalCols, clamped between 25 and 45', () => {
    expect(stepsPanelWidth(200)).toBe(45);
    expect(stepsPanelWidth(100)).toBe(35);
    expect(stepsPanelWidth(50)).toBe(25);
    expect(stepsPanelWidth(60)).toBe(25);
  });
});

describe('filterLogLines', () => {
  const logs: LogSearchEntry[] = [
    { message: 'Hello World' },
    { message: 'Error: something failed' },
    { message: 'Another log' },
    { message: 'hello again' },
  ];
  it('returns matchCount and indices for query', () => {
    expect(filterLogLines(logs, 'hello')).toEqual({ matchCount: 2, matchIndices: [0, 3] });
    expect(filterLogLines(logs, 'error')).toEqual({ matchCount: 1, matchIndices: [1] });
  });
  it('is case-insensitive', () => {
    expect(filterLogLines(logs, 'WORLD')).toEqual({ matchCount: 1, matchIndices: [0] });
  });
  it('returns 0 for empty or non-matching query', () => {
    expect(filterLogLines(logs, '')).toEqual({ matchCount: 0, matchIndices: [] });
    expect(filterLogLines(logs, 'notfound')).toEqual({ matchCount: 0, matchIndices: [] });
  });
  it('returns 0 for non-array logs', () => {
    // @ts-expect-error
    expect(filterLogLines(null, 'hello')).toEqual({ matchCount: 0, matchIndices: [] });
    // @ts-expect-error
    expect(filterLogLines(undefined, 'hello')).toEqual({ matchCount: 0, matchIndices: [] });
  });
});

describe('highlightSearchMatch', () => {
  it('returns full line as non-match if query is empty or not found', () => {
    expect(highlightSearchMatch('Hello World', '')).toEqual([{ text: 'Hello World', isMatch: false }]);
    expect(highlightSearchMatch('Hello World', 'notfound')).toEqual([{ text: 'Hello World', isMatch: false }]);
  });
  it('highlights all matches (case-insensitive)', () => {
    expect(highlightSearchMatch('Hello hello', 'hello')).toEqual([
      { text: 'Hello', isMatch: true },
      { text: ' ', isMatch: false },
      { text: 'hello', isMatch: true },
    ]);
  });
  it('handles non-string line', () => {
    // @ts-expect-error
    expect(highlightSearchMatch(null, 'a')).toEqual([{ text: '', isMatch: false }]);
  });
  it('handles overlapping matches', () => {
    expect(highlightSearchMatch('aaaa', 'aa')).toEqual([
      { text: 'aa', isMatch: true },
      { text: 'aa', isMatch: true },
    ]);
  });
});

describe('truncateStackTrace', () => {
  const stack = 'line1\nline2\nline3\nline4\nline5';
  it('returns up to maxLines lines', () => {
    expect(truncateStackTrace(stack, 3)).toEqual(['line1', 'line2', 'line3']);
    expect(truncateStackTrace(stack, 10)).toEqual(['line1', 'line2', 'line3', 'line4', 'line5']);
  });
  it('returns empty for null/undefined/non-string', () => {
    // @ts-expect-error
    expect(truncateStackTrace(null)).toEqual([]);
    // @ts-expect-error
    expect(truncateStackTrace(undefined)).toEqual([]);
    // @ts-expect-error
    expect(truncateStackTrace(123)).toEqual([]);
  });
  it('returns at least one line if maxLines < 1', () => {
    expect(truncateStackTrace(stack, 0)).toEqual(['line1']);
    expect(truncateStackTrace(stack, -5)).toEqual(['line1']);
  });
});

describe('formatStepDetail', () => {
  it('returns empty result for null/undefined', () => {
    // @ts-expect-error
    expect(formatStepDetail(null)).toEqual({ lines: [], hasError: false, logLines: [] });
    // @ts-expect-error
    expect(formatStepDetail(undefined)).toEqual({ lines: [], hasError: false, logLines: [] });
  });
  it('formats all fields and alternatives', () => {
    const step: StepDetailInput = {
      id: 'step1',
      name: 'Test Step',
      status: 'done',
      duration: 61000,
      retryCount: 2,
      exitCode: 1,
      errorMessage: 'Something went wrong',
      dependsOn: ['a', 'b'],
      stepLogs: ['log1', 'log2', 'log3'],
      alternatives: [
        { number: 1, title: 'Alt1', description: 'desc1', tradeoffs: 'trade1' },
        { number: 2, title: 'Alt2' },
      ],
      recommendedAlternative: 'Alt1',
    };
    const result = formatStepDetail(step);
    expect(result.lines).toEqual(
      expect.arrayContaining([
        'Name:       Test Step',
        'ID:         step1',
        'Status:     done',
        'Duration:   1m1s',
        'Retries:    2',
        'Depends-on: a, b',
        'Exit code:  1',
        'Error:      Something went wrong',
        'Alternatives:',
        '  [1] Alt1',
        '       desc1',
        '       Trade-offs: trade1',
        '  [2] Alt2',
        '  → Recommended: Alt1',
      ])
    );
    expect(result.hasError).toBe(true);
    expect(result.logLines).toEqual(['log1', 'log2', 'log3']);
  });
  it('handles missing/empty fields', () => {
    const step: StepDetailInput = {};
    const result = formatStepDetail(step);
    expect(result.lines).toEqual(
      expect.arrayContaining([
        'Name:       (unknown)',
        'ID:         (unknown)',
        'Status:     pending',
        'Depends-on: (none)',
      ])
    );
    expect(result.hasError).toBe(false);
    expect(result.logLines).toEqual([]);
  });
  it('limits logLines to last 10', () => {
    const logs = Array.from({ length: 15 }, (_, i) => `log${i + 1}`);
    const step: StepDetailInput = { stepLogs: logs };
    const result = formatStepDetail(step);
    expect(result.logLines).toEqual(logs.slice(-10));
  });
  it('handles alternatives as empty/undefined', () => {
    const step: StepDetailInput = { alternatives: undefined };
    const result = formatStepDetail(step);
    expect(result.lines.some(l => l.includes('Alternatives:'))).toBe(false);
  });
});
