import { describe, it, expect } from 'vitest';
import plugin from '../src/index.js';

describe('mirador-canvaslink plugin', () => {
  it('exports an array of plugin definitions', () => {
    expect(Array.isArray(plugin)).toBe(true);
    expect(plugin.length).toBe(3);
  });

  it('each entry has the required plugin shape', () => {
    plugin.forEach((entry) => {
      expect(entry).toHaveProperty('component');
      expect(entry).toHaveProperty('mode');
      expect(entry).toHaveProperty('target');
    });
  });

  it('ShareControl targets WindowTopBarPluginArea', () => {
    expect(plugin[0].target).toBe('WindowTopBarPluginArea');
    expect(plugin[0].mode).toBe('add');
  });

  it('ShareCanvasLinkDialog targets Window', () => {
    expect(plugin[1].target).toBe('Window');
    expect(plugin[1].mode).toBe('add');
  });

  it('InfoPanelCanvasLink targets ManifestRelatedLinks with wrap mode', () => {
    expect(plugin[2].target).toBe('ManifestRelatedLinks');
    expect(plugin[2].mode).toBe('wrap');
  });
});
