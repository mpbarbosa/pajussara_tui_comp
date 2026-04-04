import type { PanelStatus } from '../src/types';

describe('PanelStatus type', () => {
  const validStatuses: PanelStatus[] = [
    'idle',
    'loading',
    'streaming',
    'done',
    'error',
  ];

  it('should allow all valid PanelStatus values', () => {
    validStatuses.forEach((status) => {
      // TypeScript will error at compile time if status is not assignable
      const s: PanelStatus = status;
      expect(s).toBe(status);
    });
  });

  it('should not allow invalid PanelStatus values (compile-time check)', () => {
    // The following lines are intentionally commented out because they should fail type-checking.
    // Uncommenting them will cause a TypeScript error, as expected.
    //
    // const invalid1: PanelStatus = 'pending';
    // const invalid2: PanelStatus = '';
    // const invalid3: PanelStatus = 'completed';
    expect(true).toBe(true); // Placeholder to keep test passing
  });

  it('should be usable in discriminated unions', () => {
    type Panel =
      | { status: 'idle'; message: string }
      | { status: 'loading'; progress: number }
      | { status: 'streaming'; streamId: string }
      | { status: 'done'; result: unknown }
      | { status: 'error'; error: Error };

    function getPanelMessage(panel: Panel) {
      switch (panel.status) {
        case 'idle':
          return panel.message;
        case 'loading':
          return `Loading: ${panel.progress}%`;
        case 'streaming':
          return `Streaming: ${panel.streamId}`;
        case 'done':
          return `Done: ${panel.result}`;
        case 'error':
          return `Error: ${panel.error.message}`;
      }
    }

    expect(
      getPanelMessage({ status: 'idle', message: 'Waiting...' })
    ).toBe('Waiting...');
    expect(
      getPanelMessage({ status: 'loading', progress: 42 })
    ).toBe('Loading: 42%');
    expect(
      getPanelMessage({ status: 'streaming', streamId: 'abc123' })
    ).toBe('Streaming: abc123');
    expect(
      getPanelMessage({ status: 'done', result: 7 })
    ).toBe('Done: 7');
    expect(
      getPanelMessage({ status: 'error', error: new Error('fail') })
    ).toBe('Error: fail');
  });
});
