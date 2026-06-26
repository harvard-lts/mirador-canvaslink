import { describe, it, expect, vi } from 'vitest';

// Mock `mirador` so importing the plugin doesn't load the full bundle
// (which triggers a jsdom HTMLCanvasElement.getContext error) and so we can
// drive mapStateToProps/mapDispatchToProps deterministically.
vi.mock('mirador', () => ({
  MiradorMenuButton: () => null,
  ScrollIndicatedDialogContent: () => null,
  cssNs: (s) => `mirador-${s}`,
  updateWindow: (windowId, payload) => ({ type: 'UPDATE_WINDOW', windowId, payload }),
  getContainerId: () => 'mirador',
  getRights: () => ['http://rights.example/1'],
  getVisibleCanvases: () => [{ id: 'canvas-1', imageServiceIds: ['svc'] }],
  getWindowManifests: () => ['manifest-1'],
  getWindowViewType: () => 'single',
  getWindowConfig: () => ({}),
}));

const { default: plugins } = await import('../src/index.js');

describe('plugin descriptor list', () => {
  it('exports three plugin descriptors', () => {
    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins).toHaveLength(3);
  });

  it('each descriptor has a target, mode and component', () => {
    plugins.forEach((p) => {
      expect(p.target).toBeTruthy();
      expect(p.mode).toBeTruthy();
      expect(p.component).toBeTruthy();
    });
  });

  it('targets the expected Mirador areas', () => {
    expect(plugins.map((p) => p.target)).toEqual([
      'WindowTopBarPluginArea',
      'Window',
      'ManifestRelatedLinks',
    ]);
  });
});

describe('ShareControl descriptor mapping', () => {
  const share = plugins[0];

  it('maps state to props', () => {
    const props = share.mapStateToProps({}, { windowId: 'w1' });
    expect(props.windowViewType).toBe('single');
    expect(props.config).toBeDefined();
  });

  it('dispatches an updateWindow action with the canvasLink', () => {
    const dispatch = vi.fn();
    const props = share.mapDispatchToProps(dispatch, { windowId: 'w1' });
    props.updateConfig({ dialogOpen: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_WINDOW',
      windowId: 'w1',
      payload: { canvasLink: { dialogOpen: true } },
    });
  });
});

describe('ShareCanvasLinkDialog descriptor mapping', () => {
  const dialog = plugins[1];

  it('maps state including manifestId, visibleCanvases and rights', () => {
    const props = dialog.mapStateToProps({}, { windowId: 'w1' });
    expect(props.manifestId).toBe('manifest-1');
    expect(props.visibleCanvases).toHaveLength(1);
    expect(props.rights).toEqual(['http://rights.example/1']);
  });
});

describe('InfoPanelCanvasLink descriptor mapping', () => {
  const infoPanel = plugins[2];

  it('maps config, manifestId and visibleCanvases', () => {
    const props = infoPanel.mapStateToProps({}, { windowId: 'w1' });
    expect(props.manifestId).toBe('manifest-1');
    expect(props.visibleCanvases).toHaveLength(1);
    expect(props.config).toBeDefined();
  });
});
