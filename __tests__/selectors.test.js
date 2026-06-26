import { describe, it, expect, vi } from 'vitest';

// getWindowConfig comes from the mirador bundle; mock it so we avoid loading
// the full bundle and can control what window config the selector receives.
let windowConfig = {};
vi.mock('mirador', () => ({
  getWindowConfig: () => windowConfig,
}));

const { getPluginConfig } = await import('../src/state/selectors.js');

describe('getPluginConfig', () => {
  it('returns the default config when no canvasLink config is present', () => {
    windowConfig = {};
    const config = getPluginConfig.resultFunc(windowConfig);
    expect(config.enabled).toBe(true);
    expect(config.dialogOpen).toBe(false);
    expect(config.showRightsInformation).toBe(true);
    expect(config.singleCanvasOnly).toBe(false);
  });

  it('merges user-supplied canvasLink config over the defaults', () => {
    const merged = getPluginConfig.resultFunc({
      canvasLink: { enabled: false, singleCanvasOnly: true },
    });
    expect(merged.enabled).toBe(false);
    expect(merged.singleCanvasOnly).toBe(true);
    // untouched defaults remain
    expect(merged.showRightsInformation).toBe(true);
  });
});
