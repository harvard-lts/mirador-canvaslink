import Mirador from "mirador/dist/es/src/index";

import canvasLinkPlugin from "../src";

const config = {
  id: "mirador",
  window: {
    allowFullscreen: true,
canvasLink: {
      active: true,
      enabled: false,
      infoPanelEnabled: true,
      singleCanvasOnly: false,
      getCanvasLink: (manifestId, visibleCanvases) => {
        // Extract the actual manifestId from the canvas ID since the plugin
        // may not pass the correct per-window manifestId
        if (!visibleCanvases || visibleCanvases.length === 0) {
          return null;
        }
        
        // Get manifestId from the canvas ID (format: {manifestId}/canvas/...)
        const canvasId = visibleCanvases[0].id;
        const actualManifestId = canvasId.split('/canvas/')[0];
        
        // Only generate canvas link for Harvard manifests
        if (!actualManifestId || !actualManifestId.toLowerCase().includes('harvard.edu')) {
          return null;
        }
        
        const URN = actualManifestId.match(/[Uu][Rr][Nn]-\d+:[^:]+:[^:]+/);
        if (!URN) {
          return null;
        }
        
        const canvasIndices = visibleCanvases.map(
          (canvas) => canvas.id.split("/").slice(-1)[0].replace(/^canvas-drs:/, ""),
        );
        return `https://nrs.harvard.edu/${URN}:VIEW?page=${canvasIndices.join(
          ",",
        )}`;
      },
    },
  },
  windows: [
    {
      canvasIndex: parseInt(new URLSearchParams(window.location.search).get('n'))-1,
      manifestId: 'https://nrs.harvard.edu/URN-3:FHCL:106214677:MANIFEST:3',
      view: "single",
      sideBarOpen: true,
      xsideBarPanel: 'info',
      canvasId: new URLSearchParams(window.location.search).get('page') ? `${manifestId}/canvas/canvas-drs:${new URLSearchParams(window.location.search).get('page').toString()}` : new URLSearchParams(window.location.search).get('canvasId')?.toString(),
   
    },
    {
      canvasIndex: parseInt(new URLSearchParams(window.location.search).get('n'))-1,
      manifestId: 'https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00135902/manifest',
      view: "single",
      sideBarOpen: true,
      xsideBarPanel: 'info',
      canvasId: new URLSearchParams(window.location.search).get('page') ? `${manifestId}/canvas/canvas-drs:${new URLSearchParams(window.location.search).get('page').toString()}` : new URLSearchParams(window.location.search).get('canvasId')?.toString(),
   
    },
  ],
};

Mirador.viewer(config, [...canvasLinkPlugin]);
