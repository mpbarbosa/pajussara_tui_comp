import * as api from '../src/index';

describe('pajussara_tui_comp public API (src/index.ts)', () => {
  it('should export ListPanel and StepsPanel as the same reference', () => {
    expect(api.ListPanel).toBeDefined();
    expect(api.StepsPanel).toBeDefined();
    expect(api.ListPanel).toBe(api.StepsPanel);
  });

  it('should export ListItem and ListPanelProps types', () => {
    // Type-only test: compile-time only, so we do a runtime check for presence in type exports
    // This is a no-op at runtime, but ensures the named exports exist
    type _ListItem = api.ListItem;
    type _ListPanelProps = api.ListPanelProps;
    expect(true).toBe(true); // Dummy assertion for type-only test
  });

  it('should not export unexpected symbols', () => {
    const exportedKeys = Object.keys(api);
    expect(exportedKeys.sort()).toEqual(['ListPanel', 'StepsPanel'].sort());
  });
});
