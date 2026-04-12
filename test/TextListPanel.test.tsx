import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { jest } from '@jest/globals';
import type { TextListItem, TextListPanelProps } from '../src/TextListPanel.js';

jest.unstable_mockModule('../helpers/index.js', () => ({
  formatStepIcon: (status: string) =>
    status === 'done' ? '$' : status === 'running' ? '@' : '#',
  statusColor: (status: string) =>
    status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray',
  formatDuration: (duration: number) => `${duration}s`,
}));

let TextListPanel!: (props: TextListPanelProps) => React.ReactElement;

beforeAll(async () => {
  const mod = await import('../src/TextListPanel.js');
  TextListPanel = mod.TextListPanel;
});

describe('TextListPanel component', () => {
  const baseItems: TextListItem[] = [
    { id: 'alpha', text: 'Alpha details', status: 'done', duration: 5 },
    { id: 'beta', text: 'Beta details', status: 'running' },
    { id: 'gamma', text: 'Gamma details' },
  ];

  const renderPanel = (overrides: Partial<TextListPanelProps> = {}) =>
    render(
      React.createElement(TextListPanel, {
        items: baseItems,
        width: 40,
        ...overrides,
      })
    );

  it('renders text entries through ListPanel styling', () => {
    const { lastFrame } = renderPanel({ currentTextItemId: 'beta' });
    const output = lastFrame() ?? '';

    expect(output).toContain('TEXT');
    expect(output).toContain('Alpha details');
    expect(output).toContain('Beta details');
    expect(output).toContain('Gamma details');
    expect(output).toContain('$');
    expect(output).toContain('@');
    expect(output).toContain('5s');
  });

  it('renders custom title and empty text', () => {
    const { lastFrame } = renderPanel({
      items: [],
      title: 'PREVIEW',
      emptyText: 'Nothing to preview.',
    });

    expect(lastFrame()).toContain('PREVIEW');
    expect(lastFrame()).toContain('Nothing to preview.');
  });

  it('handles keyboard navigation when focused', () => {
    const onSelectTextItem = jest.fn();
    const { stdin, lastFrame } = renderPanel({
      currentTextItemId: 'alpha',
      isFocused: true,
      onSelectTextItem,
    });

    expect(lastFrame()).toMatch(/>.*Alpha details/);

    act(() => {
      stdin.write('\x1B[B');
    });

    expect(onSelectTextItem).toHaveBeenLastCalledWith('beta');
    expect(lastFrame()).toMatch(/>.*Beta details/);
  });

  it('syncs selection with selectedTextItemId prop changes', () => {
    const { rerender, lastFrame } = renderPanel({
      isFocused: true,
      selectedTextItemId: 'beta',
    });

    expect(lastFrame()).toMatch(/>.*Beta details/);

    act(() => {
      rerender(
        React.createElement(TextListPanel, {
          items: baseItems,
          width: 40,
          isFocused: true,
          selectedTextItemId: 'gamma',
        })
      );
    });

    expect(lastFrame()).toMatch(/>.*Gamma details/);
  });

  it('exports default as TextListPanel', async () => {
    const mod = await import('../src/TextListPanel.js');
    expect(mod.default).toBe(TextListPanel);
  });

  it('keeps the public types importable', () => {
    const item: TextListItem = {
      id: 'alpha',
      text: 'Alpha details',
    };

    expect(item.text).toBe('Alpha details');
  });
});
