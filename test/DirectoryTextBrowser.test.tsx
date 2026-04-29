import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import type {
  DirectoryTextBrowserPane,
  DirectoryTextBrowserProps,
} from '../src/DirectoryTextBrowser.js';
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

jest.unstable_mockModule('../src/helpers/index.js', () => ({
  formatStepIcon: (status: string) =>
    status === 'done' ? '$' : status === 'running' ? '@' : '#',
  statusColor: (status: string) =>
    status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray',
  formatDuration: (duration: number) => `${duration}s`,
}));

let DirectoryTextBrowser!: (props: DirectoryTextBrowserProps) => React.ReactElement;

beforeAll(async () => {
  const mod = await import('../src/DirectoryTextBrowser.js');
  DirectoryTextBrowser = mod.DirectoryTextBrowser;
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

describe('DirectoryTextBrowser component', () => {
  const itemsByDirectoryPath: Record<string, TextListItem[]> = {
    '/workspace/alpha': [
      { id: 'alpha-1', text: 'Alpha overview', status: 'done', duration: 3 },
      { id: 'alpha-2', text: 'Alpha notes', status: 'pending' },
    ],
    '/workspace/beta': [
      { id: 'beta-1', text: 'Beta overview', status: 'running' },
      { id: 'beta-2', text: 'Beta notes', status: 'pending' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    readdirMock.mockResolvedValue([
      createDirent('alpha', true),
      createDirent('beta', true),
    ]);
  });

  const getTextItems = (directoryPath: string | null): TextListItem[] =>
    directoryPath ? itemsByDirectoryPath[directoryPath] ?? [] : [];

  const renderBrowser = (overrides: Partial<DirectoryTextBrowserProps> = {}) =>
    render(
      React.createElement(DirectoryTextBrowser, {
        directoryPath: '/workspace',
        getTextItems,
        width: 72,
        height: 10,
        ...overrides,
      })
    );

  it('renders both panes and shows placeholder text before directory selection', async () => {
    const { lastFrame } = renderBrowser();

    await flushEffects();

    const output = lastFrame() ?? '';
    expect(output).toContain('FOLDERS');
    expect(output).toContain('TEXT');
    expect(output).toContain('alpha/');
    expect(output).toContain('Select a directory to view its text');
    expect(output).toContain('items.');
  });

  it('renders text items for the controlled selected directory', async () => {
    const { lastFrame } = renderBrowser({
      selectedDirectoryPath: '/workspace/beta',
      focusedPane: 'text',
      textTitle: 'DETAILS',
    });

    await flushEffects();

    const output = lastFrame() ?? '';
    expect(output).toContain('DETAILS');
    expect(output).toContain('Beta overview');
    expect(output).toContain('Beta notes');
  });

  it('switches focus between panes and routes navigation to the active pane', async () => {
    const onSelectDirectory = jest.fn();
    const onSelectTextItem = jest.fn();
    const onFocusPaneChange = jest.fn();
    const { stdin, lastFrame } = renderBrowser({
      onSelectDirectory,
      onSelectTextItem,
      onFocusPaneChange,
    });

    await flushEffects();

    act(() => {
      stdin.write('\x1B[B');
    });

    expect(onSelectDirectory).toHaveBeenLastCalledWith('/workspace/beta');
    expect(lastFrame()).toContain('Beta overview');

    act(() => {
      stdin.write('\x1B[C');
    });

    expect(onFocusPaneChange).toHaveBeenLastCalledWith('text');

    act(() => {
      stdin.write('\x1B[B');
    });

    expect(onSelectTextItem).toHaveBeenLastCalledWith('beta-2');
    expect(lastFrame()).toMatch(/>.*Beta notes/);

    act(() => {
      stdin.write('\x1B[D');
    });

    expect(onFocusPaneChange).toHaveBeenLastCalledWith('directories');

    act(() => {
      stdin.write('\x1B[A');
    });

    expect(onSelectDirectory).toHaveBeenLastCalledWith('/workspace/alpha');
  });

  it('renders directory-specific empty text when a selected directory has no items', async () => {
    const { lastFrame } = renderBrowser({
      selectedDirectoryPath: '/workspace/missing',
    });

    await flushEffects();

    expect(lastFrame()).toContain('No text items for this directory.');
  });

  it('exports default as DirectoryTextBrowser', async () => {
    const mod = await import('../src/DirectoryTextBrowser.js');
    expect(mod.default).toBe(DirectoryTextBrowser);
  });

  it('keeps the public pane type importable', () => {
    const pane: DirectoryTextBrowserPane = 'directories';
    expect(pane).toBe('directories');
  });
});
