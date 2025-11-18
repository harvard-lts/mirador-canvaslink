import Mirador from "mirador/dist/es/src/index";

import canvasLinkPlugin from "../src";

// Get manifestId from miradorOptions or fall back to default
const manifestId = 'https://nrs.lib.harvard.edu/URN-3:FHCL.LOEB:25853480:MANIFEST:3';

const config = {
  id: "mirador",
  window: {
    allowFullscreen: true,
    canvasLink: {
      active: manifestId.includes('lib.harvard.edu'),
      enabled: manifestId.includes('lib.harvard.edu'),
      singleCanvasOnly: false,
      getCanvasLink: (manifestId, visibleCanvases) => {
        const currentHost = window.location.origin;
        const URN = manifestId.match(/URN-\d+:[^:]+:[^:]+/);
        const canvasIndices = visibleCanvases.map(
          (canvas) => canvas.id.split("/").slice(-1)[0].replace(/^canvas-drs:/, ""),
        );
        return `${currentHost}/viewer/${URN}?page=${canvasIndices.join(
          ",",
        )}`;
      },
    },
  },
  windows: [
    {
      canvasIndex: parseInt(new URLSearchParams(window.location.search).get('n'))-1,
      manifestId: manifestId,
      view: "single",
      sideBarOpen: true,
      xsideBarPanel: 'info',
      canvasId: new URLSearchParams(window.location.search).get('page') ? `${manifestId}/canvas/canvas-drs:${new URLSearchParams(window.location.search).get('page').toString()}` : new URLSearchParams(window.location.search).get('canvasId')?.toString(),
   
    },
  ],
};

Mirador.viewer(config, [...canvasLinkPlugin]);
