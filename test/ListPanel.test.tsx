import React from 'react';
import { render, act } from 'ink-testing-library';
import { ListPanel, StepsPanel, type ListItem, type ListPanelProps } from '../src/ListPanel';

jest.mock('../helpers', () => ({
  formatStepIcon: (status: string) => `[${status}]`,
  statusColor: (status: string) => (status === 'done' ? 'green' : status === 'running' ? 'yellow' : 'gray'),
  formatDuration: (duration: number) => `${duration}s`,
}));

describe('ListPanel component', () => {
  const baseItems: Record<string, ListItem> = {
    a: { id: 'a', name: 'Step A', status: 'done', duration: 5 },
    b: { id: 'b', name: 'Step B', status: 'running', duration: null },
    c: { id: 'c', name: 'Step C', status: 'pending' },
  };

  const renderPanel = (overrides: Partial<ListPanelProps> = {}) =>
    render(
      <ListPanel
        items={baseItems}
        currentItemId="b"
        width={40}
        {...overrides}
      />
    );

  it('renders with default props and items', () => {
    const { lastFrame } = renderPanel();
    const output = lastFrame();
    expect(output).toContain('STEPS');
    expect(output).toContain('[done]');
    expect(output).toContain('[running]');
    expect(output).toContain('[pending]');
    expect(output).toContain('Step A');
    expect(output).toContain('Step B');
    expect(output).toContain('Step C');
    expect(output).toContain('5s');
    expect(output).toContain('…'); // running step duration
  });

  it('renders empty state when items is empty', () => {
    const { lastFrame } = renderPanel({ items: {}, currentItemId: null, width: 30 });
    expect(lastFrame()).toContain('Waiting for steps…');
  });

  it('renders with custom title and emptyText', () => {
    const { lastFrame } = renderPanel({
      items: {},
      currentItemId: null,
      width: 30,
      title: 'MY PANEL',
      emptyText: 'No items!',
    });
    expect(lastFrame()).toContain('MY PANEL');
    expect(lastFrame()).toContain('No items!');
  });

  it('highlights the current item and selected item', () => {
    const { lastFrame } = renderPanel({ currentItemId: 'a', isFocused: true, selectedItemId: 'b' });
    const output = lastFrame();
    expect(output).toContain('Step A');
    expect(output).toContain('Step B');
    // '>' cursor for selected
    expect(output).toMatch(/>.*Step B/);
  });

  it('handles keyboard navigation (down/up arrow and j/k)', () => {
    const onSelectItem = jest.fn();
    const { stdin, lastFrame } = renderPanel({ currentItemId: 'a', isFocused: true, onSelectItem });
    // Initial selection is first item
    expect(lastFrame()).toMatch(/>.*Step A/);

    // Down arrow
    act(() => {
      stdin.write('\x1B[B'); // down arrow
    });
    expect(onSelectItem).toHaveBeenLastCalledWith('b');
    expect(lastFrame()).toMatch(/>.*Step B/);

    // Up arrow
    act(() => {
      stdin.write('\x1B[A'); // up arrow
    });
    expect(onSelectItem).toHaveBeenLastCalledWith('a');
    expect(lastFrame()).toMatch(/>.*Step A/);

    // 'j' key
    act(() => {
      stdin.write('j');
    });
    expect(onSelectItem).toHaveBeenLastCalledWith('b');
    expect(lastFrame()).toMatch(/>.*Step B/);

    // 'k' key
    act(() => {
      stdin.write('k');
    });
    expect(onSelectItem).toHaveBeenLastCalledWith('a');
    expect(lastFrame()).toMatch(/>.*Step A/);
  });

  it('does not crash if items is empty and keys are pressed', () => {
    const { stdin } = renderPanel({ items: {}, currentItemId: null, isFocused: true });
    expect(() => {
      act(() => {
        stdin.write('j');
        stdin.write('k');
        stdin.write('\x1B[A');
        stdin.write('\x1B[B');
      });
    }).not.toThrow();
  });

  it('truncates long item names and pads short ones', () => {
    const items: Record<string, ListItem> = {
      a: { id: 'a', name: 'A'.repeat(50), status: 'done', duration: 1 },
      b: { id: 'b', name: 'Short', status: 'pending' },
    };
    const { lastFrame } = renderPanel({ items, currentItemId: 'a', width: 20 });
    const output = lastFrame();
    expect(output).toMatch(/A{1,}…/); // truncated
    expect(output).toMatch(/Short\s+/); // padded
  });

  it('shows only visible items when entries exceed panel height', () => {
    const items: Record<string, ListItem> = {};
    for (let i = 0; i < 30; i++) {
      items[`id${i}`] = { id: `id${i}`, name: `Step ${i}`, status: 'pending' };
    }
    const { lastFrame } = renderPanel({ items, currentItemId: 'id25', width: 40, height: 10 });
    const output = lastFrame();
    // Only 8 visible (height - 2)
    let count = 0;
    for (let i = 0; i < 30; i++) {
      if (output.includes(`Step ${i}`)) count++;
    }
    expect(count).toBe(8);
    expect(output).toContain('Step 25');
  });

  it('syncs selection index with selectedItemId prop changes', () => {
    const { rerender, lastFrame } = renderPanel({ currentItemId: 'a', isFocused: true, selectedItemId: 'b' });
    expect(lastFrame()).toMatch(/>.*Step B/);
    rerender(
      <ListPanel
        items={baseItems}
        currentItemId="a"
        width={40}
        isFocused={true}
        selectedItemId="c"
      />
    );
    expect(lastFrame()).toMatch(/>.*Step C/);
  });

  it('exports StepsPanel as an alias of ListPanel', () => {
    expect(StepsPanel).toBe(ListPanel);
  });

  it('exports default as ListPanel', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../src/ListPanel');
    expect(mod.default).toBe(ListPanel);
  });
});
