import * as api from '../src/index';

describe('pajussara_tui_comp public API (src/index.ts)', () => {
  it('should export ListPanel and StepsPanel as the same reference', () => {
    expect(api.ListPanel).toBeDefined();
    expect(api.StepsPanel).toBeDefined();
    expect(api.ListPanel).toBe(api.StepsPanel);
  });

  it('should export ListItem and ListPanelProps types', () => {
    // TypeScript compilation validates that these named type exports exist;
    // the assignments below fail at compile time if the types are removed.
    type _ListItem = api.ListItem;
    type _ListPanelProps = api.ListPanelProps;
    // Runtime: assert the module is an object with the expected function exports
    expect(typeof api.ListPanel).toBe('function');
    expect(typeof api.StepsPanel).toBe('function');
  });

  it('should export StreamViewer and wrapText', () => {
    expect(typeof api.StreamViewer).toBe('function');
    expect(typeof api.wrapText).toBe('function');
    // Type exports (StreamState, StreamHistoryEntry, StreamViewerProps) are
    // compile-time only; no runtime assertion needed.
  });

  it('should not export unexpected symbols', () => {
    const exportedKeys = Object.keys(api);
    expect(exportedKeys.sort()).toEqual(
      ['ListPanel', 'StepsPanel', 'StreamViewer', 'wrapText'].sort()
    );
  });
});
