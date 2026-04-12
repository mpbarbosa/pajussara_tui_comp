import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import type {
  DirectoryEntry,
  DirectoryPanelProps,
} from '../src/DirectoryPanel.js';

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

let DirectoryPanel!: (props: DirectoryPanelProps) => React.ReactElement;

beforeAll(async () => {
  const mod = await import('../src/DirectoryPanel.js');
  DirectoryPanel = mod.DirectoryPanel;
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

describe('DirectoryPanel component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPanel = (overrides: Partial<DirectoryPanelProps> = {}) =>
    render(
      React.createElement(DirectoryPanel, {
        directoryPath: '/workspace',
        width: 40,
        ...overrides,
      })
    );

  it('renders folders from the target path in alphabetical order', async () => {
    readdirMock.mockResolvedValue([
      createDirent('zeta', true),
      createDirent('alpha', true),
      createDirent('README.md', false),
    ]);

    const { lastFrame } = renderPanel();

    expect(lastFrame()).toContain('Loading folders…');

    await flushEffects();

    const output = lastFrame() ?? '';
    expect(output).toContain('FOLDERS');
    expect(output).toContain('alpha/');
    expect(output).toContain('zeta/');
    expect(output).not.toContain('README.md');
    expect(output.indexOf('alpha/')).toBeLessThan(output.indexOf('zeta/'));
  });

  it('renders empty state when no child folders are present', async () => {
    readdirMock.mockResolvedValue([]);

    const { lastFrame } = renderPanel({ emptyText: 'Nothing here.' });

    await flushEffects();

    expect(lastFrame()).toContain('Nothing here.');
  });

  it('renders a filesystem error state', async () => {
    readdirMock.mockRejectedValue(new Error('permission denied'));

    const { lastFrame } = renderPanel();

    await flushEffects();

    expect(lastFrame()).toContain('Unable to read folders: permission');
    expect(lastFrame()).toContain('denied');
  });

  it('renders custom title and loading text', () => {
    readdirMock.mockImplementation(
      async (): Promise<MockDirent[]> =>
        new Promise<MockDirent[]>((resolve) => {
          setTimeout(() => resolve([]), 10);
        })
    );

    const { lastFrame } = renderPanel({
      title: 'PROJECT TREE',
      loadingText: 'Scanning…',
    });

    const output = lastFrame() ?? '';
    expect(output).toContain('PROJECT TREE');
    expect(output).toContain('Scanning…');
  });

  it('handles keyboard navigation when focused', async () => {
    readdirMock.mockResolvedValue([
      createDirent('alpha', true),
      createDirent('beta', true),
      createDirent('gamma', true),
    ]);

    const onSelectDirectory = jest.fn();
    const { stdin, lastFrame } = renderPanel({
      isFocused: true,
      onSelectDirectory,
    });

    await flushEffects();

    expect(lastFrame()).toMatch(/>.*alpha\//);

    act(() => {
      stdin.write('\x1B[B');
    });
    expect(onSelectDirectory).toHaveBeenLastCalledWith('/workspace/beta');
    expect(lastFrame()).toMatch(/>.*beta\//);

    act(() => {
      stdin.write('j');
    });
    expect(onSelectDirectory).toHaveBeenLastCalledWith('/workspace/gamma');
    expect(lastFrame()).toMatch(/>.*gamma\//);

    act(() => {
      stdin.write('k');
    });
    expect(onSelectDirectory).toHaveBeenLastCalledWith('/workspace/beta');
    expect(lastFrame()).toMatch(/>.*beta\//);
  });

  it('keeps keyboard input inactive when unfocused', async () => {
    readdirMock.mockResolvedValue([
      createDirent('alpha', true),
      createDirent('beta', true),
    ]);

    const onSelectDirectory = jest.fn();
    const { stdin, lastFrame } = renderPanel({
      isFocused: false,
      onSelectDirectory,
    });

    await flushEffects();

    act(() => {
      stdin.write('\x1B[B');
      stdin.write('j');
    });

    expect(onSelectDirectory).not.toHaveBeenCalled();
    expect(lastFrame()).not.toMatch(/>.*beta\//);
  });

  it('syncs selection with selectedDirectoryPath prop changes', async () => {
    readdirMock.mockResolvedValue([
      createDirent('alpha', true),
      createDirent('beta', true),
      createDirent('gamma', true),
    ]);

    const { rerender, lastFrame } = renderPanel({
      isFocused: true,
      selectedDirectoryPath: '/workspace/beta',
    });

    await flushEffects();
    expect(lastFrame()).toMatch(/>.*beta\//);

    act(() => {
      rerender(
        React.createElement(DirectoryPanel, {
          directoryPath: '/workspace',
          width: 40,
          isFocused: true,
          selectedDirectoryPath: '/workspace/gamma',
        })
      );
    });

    expect(lastFrame()).toMatch(/>.*gamma\//);
  });

  it('shows only visible folders when entries exceed panel height', async () => {
    const folders: MockDirent[] = [];
    for (let i = 0; i < 30; i++) {
      folders.push(createDirent(`folder-${i.toString().padStart(2, '0')}`, true));
    }
    readdirMock.mockResolvedValue(folders);

    const { lastFrame } = renderPanel({
      height: 10,
      isFocused: true,
      selectedDirectoryPath: '/workspace/folder-25',
    });

    await flushEffects();

    const output = lastFrame() ?? '';
    let count = 0;
    for (let i = 0; i < 30; i++) {
      if (new RegExp(`folder-${i.toString().padStart(2, '0')}/`).test(output)) {
        count++;
      }
    }

    expect(count).toBe(8);
    expect(output).toContain('folder-25/');
  });

  it('exports default as DirectoryPanel', async () => {
    const mod = await import('../src/DirectoryPanel.js');
    expect(mod.default).toBe(DirectoryPanel);
  });

  it('keeps the public types importable', () => {
    const sampleEntry: DirectoryEntry = {
      name: 'alpha',
      path: '/workspace/alpha',
    };

    expect(sampleEntry.path).toBe('/workspace/alpha');
  });
});
