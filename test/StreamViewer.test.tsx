/**
 * @file StreamViewer.test.tsx
 * @description Unit tests for StreamViewer — live AI token stream panel component.
 */

import React from 'react';
import { render } from 'ink-testing-library';
import StreamViewerDefault, { StreamViewer, wrapText, type StreamState } from '../src/StreamViewer';

/** Build a minimal StreamState object for tests. */
function makeStreamState(overrides: Partial<StreamState> = {}): StreamState {
  return {
    liveText: '',
    stepId: null,
    stepName: null,
    persona: null,
    tokenCount: 0,
    tokensPerSec: 0,
    history: [],
    ...overrides,
  };
}

describe('StreamViewer component', () => {
  it('renders "Waiting for AI response" when no chunks received', () => {
    const state = makeStreamState();
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    expect(lastFrame()).toContain('Waiting for AI response');
  });

  it('renders live text in the body', () => {
    const state = makeStreamState({ liveText: 'Hello from the model', persona: 'engineer' });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    expect(lastFrame()).toContain('Hello from the model');
  });

  it('renders header with stepId and persona', () => {
    const state = makeStreamState({
      stepId: 'step_03',
      persona: 'test_engineer',
      liveText: 'Generating tests...',
    });
    const frame = render(<StreamViewer streamChunks={state} width={60} height={12} />).lastFrame();
    expect(frame).toContain('step_03');
    expect(frame).toContain('test_engineer');
  });

  it('does not show [history] indicator when no history exists', () => {
    const state = makeStreamState({ liveText: 'some text' });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    expect(lastFrame()).not.toContain('[history');
  });

  it('shows token stats when tokenCount > 0', () => {
    const state = makeStreamState({ tokenCount: 42, tokensPerSec: 10 });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    expect(lastFrame()).toContain('tok/s');
    expect(lastFrame()).toContain('42');
  });

  it('renders dashes for step/persona when not set', () => {
    const state = makeStreamState({ stepId: null, persona: null });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    expect(lastFrame()).toContain('—');
  });

  it('renders without crashing when history is populated', () => {
    const state = makeStreamState({
      liveText: 'Live text here',
      history: [
        {
          stepId: 'step_01',
          stepName: 'Documentation',
          persona: 'doc_writer',
          fullText: 'Full response text from a completed step.',
          tokenCount: 15,
          tokensPerSec: 5,
        },
      ],
    });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} />
    );
    // Should render live text by default (historyIndex -1)
    expect(lastFrame()).toContain('Live text here');
  });

  it('accepts isFocused prop and shows navigation hint', () => {
    const state = makeStreamState();
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} isFocused={true} />
    );
    expect(lastFrame()).toContain('[/] nav history');
  });

  it('does not show navigation hint when not focused', () => {
    const state = makeStreamState({ tokenCount: 5, tokensPerSec: 2 });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={60} height={12} isFocused={false} />
    );
    expect(lastFrame()).not.toContain('[/] nav history');
  });

  it('exports default as StreamViewer', () => {
    // Verify the named and default export reference the same function.
    expect(StreamViewerDefault).toBe(StreamViewer);
  });
});

describe('wrapText (pure helper)', () => {
  it('returns empty array for empty string', () => {
    expect(wrapText('', 10)).toEqual([]);
  });

  it('returns empty array when maxWidth <= 0', () => {
    expect(wrapText('hello', 0)).toEqual([]);
    expect(wrapText('hello', -1)).toEqual([]);
  });

  it('does not split when text fits in one line', () => {
    expect(wrapText('hello', 10)).toEqual(['hello']);
  });

  it('splits text into correct chunks', () => {
    expect(wrapText('ABCDEFGH', 3)).toEqual(['ABC', 'DEF', 'GH']);
  });

  it('wraps long live text and shows last body lines (via rendering)', () => {
    // Width 20 → innerWidth 18; assert the component renders without crash
    const longText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJ';
    const state = makeStreamState({ liveText: longText });
    const { lastFrame } = render(
      <StreamViewer streamChunks={state} width={20} height={12} />
    );
    expect(lastFrame()).toContain('ABCDEFGHIJ');
  });
});
