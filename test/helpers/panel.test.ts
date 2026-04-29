/**
 * @fileoverview Tests for panel layout helpers
 * @module helpers/panel.test
 *
 * Covers selection, viewport, and label formatting helpers.
 *
 * @version 1.4.0
 * @since 2026-04-29
 */

import {
  getBoundedSelectionIndex,
  getVisibleWindow,
  formatFixedWidthLabel,
} from '../../src/helpers/panel';

describe('getBoundedSelectionIndex', () => {
  it('increments index within bounds', () => {
    expect(getBoundedSelectionIndex(1, 5, 1)).toBe(2);
  });

  it('decrements index within bounds', () => {
    expect(getBoundedSelectionIndex(3, 5, -1)).toBe(2);
  });

  it('does not go below zero', () => {
    expect(getBoundedSelectionIndex(0, 5, -1)).toBe(0);
  });

  it('does not exceed itemCount - 1', () => {
    expect(getBoundedSelectionIndex(4, 5, 1)).toBe(4);
  });

  it('returns 0 if itemCount is zero', () => {
    expect(getBoundedSelectionIndex(2, 0, 1)).toBe(0);
  });

  it('returns 0 if itemCount is negative', () => {
    expect(getBoundedSelectionIndex(2, -3, -1)).toBe(0);
  });
});

describe('getVisibleWindow', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns all items if items.length <= maxVisible', () => {
    expect(getVisibleWindow(['x', 'y'], 5, 0)).toEqual(['x', 'y']);
  });

  it('returns a window of maxVisible items ending at anchorIndex+1', () => {
    expect(getVisibleWindow(items, 3, 2)).toEqual(['a', 'b', 'c']);
    expect(getVisibleWindow(items, 3, 4)).toEqual(['c', 'd', 'e']);
  });

  it('handles anchorIndex < 0 as 0', () => {
    expect(getVisibleWindow(items, 2, -2)).toEqual(['a', 'b']);
  });

  it('handles maxVisible < 1 as 1', () => {
    expect(getVisibleWindow(items, 0, 3)).toEqual(['d']);
  });

  it('returns correct window when anchorIndex+1 < maxVisible', () => {
    expect(getVisibleWindow(items, 4, 1)).toEqual(['a', 'b']);
  });

  it('returns empty array if items is empty', () => {
    expect(getVisibleWindow([], 3, 1)).toEqual([]);
  });
});

describe('formatFixedWidthLabel', () => {
  it('pads label to fixed width if shorter', () => {
    expect(formatFixedWidthLabel('foo', 5)).toBe('foo  ');
  });

  it('returns label unchanged if length equals width', () => {
    expect(formatFixedWidthLabel('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis if label is longer', () => {
    expect(formatFixedWidthLabel('longlabel', 5)).toBe('long…');
  });

  it('handles width < 1 as width 1', () => {
    expect(formatFixedWidthLabel('abc', 0)).toBe('…');
    expect(formatFixedWidthLabel('a', -2)).toBe('a');
  });

  it('pads empty label', () => {
    expect(formatFixedWidthLabel('', 3)).toBe('   ');
  });

  it('returns ellipsis for width 1 and label longer', () => {
    expect(formatFixedWidthLabel('abc', 1)).toBe('…');
  });
});
