import {
  filterLogLines,
  formatDuration,
  formatEta,
  formatProgressBar,
  formatProgressLine,
  formatStepDetail,
  formatStepIcon,
  formatTimestamp,
  highlightSearchMatch,
  keepLast,
  statusColor,
  stepsPanelWidth,
  terminalIsSufficient,
  truncateLogLine,
  truncateStackTrace,
} from '../src/helpers/reusable.js';

function buildReusableStep() {
  return {
    id: 'step_01',
    name: 'Documentation Validation',
    status: 'done',
    duration: 5000,
    retryCount: 0,
    dependsOn: ['step_00'],
    exitCode: null,
    errorMessage: null,
    stepLogs: ['log line 1', 'log line 2'],
  };
}

describe('src/helpers/reusable.ts', () => {
  describe('formatStepIcon', () => {
    it('maps known statuses and falls back to pending icon', () => {
      expect(formatStepIcon('running')).toBe('⚡');
      expect(formatStepIcon('done')).toBe('✅');
      expect(formatStepIcon('skipped')).toBe('⊘');
      expect(formatStepIcon('error')).toBe('❌');
      expect(formatStepIcon('pending')).toBe('⏳');
      expect(formatStepIcon('whatever')).toBe('⏳');
    });
  });

  describe('statusColor', () => {
    it('maps known statuses and falls back to gray', () => {
      expect(statusColor('running')).toBe('yellow');
      expect(statusColor('done')).toBe('green');
      expect(statusColor('skipped')).toBe('gray');
      expect(statusColor('error')).toBe('red');
      expect(statusColor('pending')).toBe('gray');
      expect(statusColor('unknown')).toBe('gray');
    });
  });

  describe('formatDuration', () => {
    it('formats durations with rounding and minute compaction', () => {
      expect(formatDuration(0)).toBe('0s');
      expect(formatDuration(400)).toBe('0s');
      expect(formatDuration(800)).toBe('1s');
      expect(formatDuration(83_000)).toBe('1m23s');
      expect(formatDuration(120_000)).toBe('2m');
    });

    it('returns 0s for invalid values', () => {
      expect(formatDuration(-500)).toBe('0s');
      expect(formatDuration(Number.NaN)).toBe('0s');
      expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('0s');
    });
  });

  describe('formatTimestamp', () => {
    it('returns [HH:MM:SS]', () => {
      const ts = Date.UTC(2026, 2, 7, 12, 5, 3);
      expect(formatTimestamp(ts)).toMatch(/^\[\d{2}:\d{2}:\d{2}\]$/);
    });
  });

  describe('formatEta', () => {
    it('returns null at zero progress and Done at completion', () => {
      expect(formatEta(60_000, 0)).toBeNull();
      expect(formatEta(60_000, 100)).toBe('Done');
    });

    it('returns remaining time while in progress', () => {
      expect(formatEta(60_000, 50)).toBe('ETA 1m');
      expect(formatEta(10_000, 10)).toBe('ETA 1m30s');
    });
  });

  describe('formatProgressBar', () => {
    it('clamps width and percentage', () => {
      expect(formatProgressBar(0, 10)).toBe('░'.repeat(10));
      expect(formatProgressBar(100, 10)).toBe('█'.repeat(10));
      expect(formatProgressBar(50, 10)).toBe('█████░░░░░');
      expect(formatProgressBar(150, 8)).toBe('█'.repeat(8));
      expect(formatProgressBar(-10, 8)).toBe('░'.repeat(8));
      expect(formatProgressBar(50, 0)).toHaveLength(4);
    });
  });

  describe('formatProgressLine', () => {
    it('includes bar, percent, elapsed time, and eta when available', () => {
      const line = formatProgressLine(50, 60_000, 20);
      expect(line).toContain('50%');
      expect(line).toContain('Elapsed 1m');
      expect(line).toContain('ETA 1m');
      expect(line.slice(0, 20)).toMatch(/^[█░]+$/);
    });

    it('omits eta when percentage is zero', () => {
      expect(formatProgressLine(0, 60_000, 20)).not.toContain('ETA');
    });
  });

  describe('truncateLogLine', () => {
    it('truncates with ellipsis and handles invalid widths', () => {
      expect(truncateLogLine('hello', 10)).toBe('hello');
      expect(truncateLogLine('hello world', 8)).toBe('hello w…');
      expect(truncateLogLine('hello', 0)).toBe('');
    });
  });

  describe('keepLast', () => {
    it('returns the last N entries without mutating input', () => {
      const original = [1, 2, 3, 4, 5];
      expect(keepLast(original, 3)).toEqual([3, 4, 5]);
      expect(keepLast(original, 0)).toEqual([]);
      expect(original).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('terminalIsSufficient', () => {
    it('enforces a minimum 80x20 terminal', () => {
      expect(terminalIsSufficient(80, 20)).toBe(true);
      expect(terminalIsSufficient(79, 24)).toBe(false);
      expect(terminalIsSufficient(120, 19)).toBe(false);
    });
  });

  describe('stepsPanelWidth', () => {
    it('returns a 35% width clamped to [25, 45]', () => {
      expect(stepsPanelWidth(40)).toBe(25);
      expect(stepsPanelWidth(80)).toBe(28);
      expect(stepsPanelWidth(100)).toBe(35);
      expect(stepsPanelWidth(200)).toBe(45);
    });
  });

  describe('filterLogLines', () => {
    const logs = [
      { message: 'Starting workflow', time: 1 },
      { message: 'Error: build failed', time: 2 },
      { message: 'Warning: deprecated API', time: 3 },
      { message: 'Error: lint failed', time: 4 },
      { message: 'Done', time: 5 },
    ];

    it('finds case-insensitive matches', () => {
      expect(filterLogLines(logs, 'ERROR')).toEqual({ matchCount: 2, matchIndices: [1, 3] });
    });

    it('returns empty results for missing input', () => {
      expect(filterLogLines([], 'error')).toEqual({ matchCount: 0, matchIndices: [] });
      expect(filterLogLines(null, 'error')).toEqual({ matchCount: 0, matchIndices: [] });
      expect(filterLogLines(logs, '')).toEqual({ matchCount: 0, matchIndices: [] });
    });
  });

  describe('highlightSearchMatch', () => {
    it('returns structured segments for matching text', () => {
      expect(highlightSearchMatch('build failed here', 'failed')).toEqual([
        { text: 'build ', isMatch: false },
        { text: 'failed', isMatch: true },
        { text: ' here', isMatch: false },
      ]);
    });

    it('falls back cleanly for empty query or invalid input', () => {
      expect(highlightSearchMatch('hello world', '')).toEqual([
        { text: 'hello world', isMatch: false },
      ]);
      expect(highlightSearchMatch('ERROR occurred', 'error')[0]).toEqual({
        text: 'ERROR',
        isMatch: true,
      });
    });
  });

  describe('truncateStackTrace', () => {
    it('returns up to maxLines lines', () => {
      const stack = Array.from({ length: 30 }, (_, i) => `  at frame${i}`).join('\n');
      const result = truncateStackTrace(stack, 20);
      expect(result).toHaveLength(20);
      expect(result[0]).toBe('  at frame0');
      expect(result[19]).toBe('  at frame19');
    });

    it('returns an empty array for missing stack', () => {
      expect(truncateStackTrace(null)).toEqual([]);
      expect(truncateStackTrace('')).toEqual([]);
    });
  });

  describe('formatStepDetail', () => {
    it('formats step metadata and recent logs', () => {
      const result = formatStepDetail(buildReusableStep());
      expect(result.lines.some((line) => line.includes('Documentation Validation'))).toBe(true);
      expect(result.lines.some((line) => line.includes('Duration') && line.includes('5s'))).toBe(
        true
      );
      expect(result.lines.some((line) => line.includes('step_00'))).toBe(true);
      expect(result.hasError).toBe(false);
      expect(result.logLines).toEqual(['log line 1', 'log line 2']);
    });

    it('formats errors and alternatives when present', () => {
      const result = formatStepDetail({
        ...buildReusableStep(),
        exitCode: 1,
        errorMessage: 'Build failed',
        alternatives: [
          {
            number: 1,
            title: 'Use Redis',
            description: 'Fast in-memory cache',
            tradeoffs: 'Requires extra infra',
          },
        ],
        recommendedAlternative: '1 — Redis is faster for this workload',
      });

      expect(result.hasError).toBe(true);
      expect(result.lines.some((line) => line.includes('Exit code') && line.includes('1'))).toBe(
        true
      );
      expect(result.lines.some((line) => line.includes('Build failed'))).toBe(true);
      expect(result.lines.some((line) => line.includes('Alternatives:'))).toBe(true);
      expect(result.lines.some((line) => line.includes('Recommended:'))).toBe(true);
    });

    it('returns an empty structure for missing step data', () => {
      expect(formatStepDetail(null)).toEqual({ lines: [], hasError: false, logLines: [] });
    });
  });
});
