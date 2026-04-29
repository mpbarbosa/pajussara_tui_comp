/**
 * @fileoverview Tests for shared async-status helpers
 * @module helpers/status.test
 *
 * Jest test suite for src/helpers/status.ts
 */

import {
  isActivePanelStatus,
  shouldRenderStatusBadge,
  getActiveStatusLabel,
} from '../../src/helpers/status';

// PanelStatus type union as implied by usage in helpers/status.ts
type PanelStatus = 'loading' | 'streaming' | 'done' | 'error' | 'pending' | 'idle' | 'skipped';

describe('isActivePanelStatus', () => {
  it('returns true for "loading" and "streaming"', () => {
    expect(isActivePanelStatus('loading')).toBe(true);
    expect(isActivePanelStatus('streaming')).toBe(true);
  });
  it('returns false for non-active statuses', () => {
    expect(isActivePanelStatus('done')).toBe(false);
    expect(isActivePanelStatus('error')).toBe(false);
    expect(isActivePanelStatus('pending')).toBe(false);
    expect(isActivePanelStatus('idle')).toBe(false);
    expect(isActivePanelStatus('skipped')).toBe(false);
  });
});

describe('shouldRenderStatusBadge', () => {
  it('returns true for "done", "error", "loading", "streaming"', () => {
    expect(shouldRenderStatusBadge('done')).toBe(true);
    expect(shouldRenderStatusBadge('error')).toBe(true);
    expect(shouldRenderStatusBadge('loading')).toBe(true);
    expect(shouldRenderStatusBadge('streaming')).toBe(true);
  });
  it('returns false for other statuses', () => {
    expect(shouldRenderStatusBadge('pending')).toBe(false);
    expect(shouldRenderStatusBadge('idle')).toBe(false);
    expect(shouldRenderStatusBadge('skipped')).toBe(false);
  });
});

describe('getActiveStatusLabel', () => {
  it('returns "Streaming…" for "streaming"', () => {
    expect(getActiveStatusLabel('streaming')).toBe('Streaming…');
  });
  it('returns "Loading…" for "loading"', () => {
    expect(getActiveStatusLabel('loading')).toBe('Loading…');
  });
});
