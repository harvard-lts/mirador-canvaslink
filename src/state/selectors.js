import { getWindowConfig } from "mirador";
import { createSelector } from "reselect";

const defaultConfig = {
  dialogOpen: false,
  enabled: true,
  showRightsInformation: true,
  singleCanvasOnly: false,
};

const getPluginConfig = createSelector(
  [getWindowConfig],
  ({ canvasLink = {} }) => ({
    ...defaultConfig,
    ...canvasLink,
  }),
);

export { getPluginConfig };
