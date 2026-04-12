import React, { act } from 'react';
import { render, cleanup as inkCleanup } from 'ink-testing-library';
import { jest } from '@jest/globals';
import type { DirectoryTextBrowserWithStatusBarProps } from '../src/DirectoryTextBrowserWithStatusBar.js';
import type { TextListItem } from '../src/TextListPanel.js';

interface MockDirent {
  name: string;
  isDirectory: () => boolean;
}

const readdirMock = jest.fn<
  (path: string, options: { withFileTypes: true }) => Promise<MockDirent[]>
>();

jest.unstable_mockModule('node:fs/promises', () => ({
  readdir: readdirMock,
}));

jest.unstable_mockModule('../helpers/index.js', () => ({
  formatStepIcon: (status: string) =>
    status === 'done' ? '$' : status === 'running' ? '@' : '#',
  statusColor: (status: string) =>
    status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray',
  formatDuration: (duration: number) => `${duration}s`,
}));

let DirectoryTextBrowserWithStatusBar!: (
  props: DirectoryTextBrowserWithStatusBarProps
) => React.ReactElement;

beforeAll(async () => {
  const mod = await import('../src/DirectoryTextBrowserWithStatusBar.js');
  DirectoryTextBrowserWithStatusBar = mod.DirectoryTextBrowserWithStatusBar;
});

function createDirent(name: string, isDirectory: boolean): MockDirent {
  return {
    name,
    isDirectory: (): boolean => isDirectory,
  };
}

async function flushEffects(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

describe('DirectoryTextBrowserWithStatusBar component', () => {
  const itemsByDirectoryPath: Record<string, TextListItem[]> = {
    '/workspace/alpha': [
      { id: 'alpha-1', text: 'Alpha overview', status: 'done', duration: 3 },
    ],
    '/workspace/beta': [{ id: 'beta-1', text: 'Beta overview', status: 'running' }],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    readdirMock.mockResolvedValue([
      createDirent('alpha', true),
      createDirent('beta', true),
    ]);
  });

  afterEach(() => {
    act(() => {
      inkCleanup();
    });
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const getTextItems = (directoryPath: string | null): TextListItem[] =>
    directoryPath ? itemsByDirectoryPath[directoryPath] ?? [] : [];

  const renderBrowser = (
    overrides: Partial<DirectoryTextBrowserWithStatusBarProps> = {}
  ) =>
    render(
      React.createElement(DirectoryTextBrowserWithStatusBar, {
        directoryPath: '/workspace',
        getTextItems,
        width: 72,
        height: 10,
        ...overrides,
      })
    );

  it('renders the directory browser with a bottom status bar', async () => {
    const { lastFrame } = renderBrowser({
      selectedDirectoryPath: '/workspace/beta',
      statusBarProps: {
        hints: [
          { key: 'q', label: 'Quit' },
          { key: 'Tab', label: 'Focus' },
        ],
      },
    });

    await flushEffects();

    const output = lastFrame() ?? '';
    expect(output).toContain('FOLDERS');
    expect(output).toContain('TEXT');
    expect(output).toContain('Beta overview');
    expect(output).toContain('[q]');
    expect(output).toContain('Quit');
    expect(output).toContain('[Tab]');
    expect(output).toContain('Focus');
  });

  it('forwards status bar state props to the composed status bar', async () => {
    const { lastFrame } = renderBrowser({
      statusBarProps: {
        status: 'error',
        errorMessage: 'Network failure',
      },
    });

    await flushEffects();

    const output = lastFrame() ?? '';
    expect(output).toContain('Network');
    expect(output).toContain('failure');
  });

  it('exports default as DirectoryTextBrowserWithStatusBar', async () => {
    const mod = await import('../src/DirectoryTextBrowserWithStatusBar.js');
    expect(mod.default).toBe(DirectoryTextBrowserWithStatusBar);
  });
});
